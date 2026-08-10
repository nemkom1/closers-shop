import base64
import hashlib
import hmac
import json
import os
import sqlite3
import sys
from datetime import datetime
from urllib.parse import parse_qsl

if sys.stdout.encoding and sys.stdout.encoding.lower() != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')

import requests
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)
CORS(app, origins="*", allow_headers=["Content-Type", "Origin"])

BOT_TOKEN = os.environ["BOT_TOKEN"]
ADMIN_CHAT_ID = os.environ["ADMIN_CHAT_ID"]
ADMIN_SECRET = os.environ["ADMIN_SECRET"]
WEBHOOK_SECRET = os.environ["WEBHOOK_SECRET"]

DB_PATH = os.environ.get('DB_PATH', os.path.join(os.path.dirname(__file__), 'orders.db'))

# Порядок статусов должен совпадать с массивом `statuses` в js/app.js (loadOrders)
STATUS_FLOW = ['pending', 'searching', 'ordered', 'shipping', 'stock', 'delivery', 'completed']
STATUS_DATE_COLUMN = {
    'searching': 'search_date',
    'ordered': 'ordered_date',
    'shipping': 'shipping_date',
    'stock': 'stock_date',
    'delivery': 'delivery_date',
    'completed': 'completed_date',
}
STATUS_LABEL = {
    'pending': 'Ожидание',
    'searching': 'Поиск на POIZON',
    'ordered': 'Заказано у поставщика',
    'shipping': 'В пути в Россию',
    'stock': 'На складе',
    'delivery': 'Передано в доставку',
    'completed': 'Получен',
}


def db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = db()
    conn.execute('''CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT,
        user_name TEXT,
        username TEXT,
        items TEXT,
        promo_code TEXT,
        total_items INTEGER,
        referred_by TEXT,
        status TEXT DEFAULT 'pending',
        date TEXT,
        search_date TEXT,
        ordered_date TEXT,
        shipping_date TEXT,
        stock_date TEXT,
        delivery_date TEXT,
        completed_date TEXT,
        payment_status TEXT DEFAULT 'unpaid',
        payment_screenshot TEXT
    )''')
    # На случай, если таблица уже существует со старой схемой (до добавления оплаты)
    for column, definition in [('payment_status', "TEXT DEFAULT 'unpaid'"), ('payment_screenshot', 'TEXT')]:
        try:
            conn.execute(f'ALTER TABLE orders ADD COLUMN {column} {definition}')
        except sqlite3.OperationalError:
            pass
    conn.commit()
    conn.close()


init_db()


def send_telegram_message(chat_id, text):
    try:
        requests.post(
            f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage",
            json={'chat_id': chat_id, 'text': text},
            timeout=10,
        )
    except requests.RequestException as e:
        print("⚠️ Не удалось отправить сообщение в Telegram:", e)


def answer_callback_query(callback_id, text):
    try:
        requests.post(
            f"https://api.telegram.org/bot{BOT_TOKEN}/answerCallbackQuery",
            json={'callback_query_id': callback_id, 'text': text},
            timeout=10,
        )
    except requests.RequestException:
        pass


def edit_message_caption(chat_id, message_id, caption):
    try:
        requests.post(
            f"https://api.telegram.org/bot{BOT_TOKEN}/editMessageCaption",
            json={'chat_id': chat_id, 'message_id': message_id, 'caption': caption,
                  'reply_markup': {'inline_keyboard': []}},
            timeout=10,
        )
    except requests.RequestException:
        pass


def send_payment_review(order_id, screenshot_data_url, row):
    caption = (
        f"💳 Заказ #{order_id} — скриншот оплаты на проверку\n"
        f"👤 {row['user_name']} (@{row['username']})"
    )
    reply_markup = json.dumps({
        'inline_keyboard': [[
            {'text': '✅ Подтвердить', 'callback_data': f'pay_ok:{order_id}'},
            {'text': '❌ Отклонить', 'callback_data': f'pay_no:{order_id}'},
        ]]
    })
    try:
        header, b64data = screenshot_data_url.split(',', 1)
        photo_bytes = base64.b64decode(b64data)
        requests.post(
            f"https://api.telegram.org/bot{BOT_TOKEN}/sendPhoto",
            data={'chat_id': ADMIN_CHAT_ID, 'caption': caption, 'reply_markup': reply_markup},
            files={'photo': ('payment.jpg', photo_bytes)},
            timeout=15,
        )
    except (ValueError, requests.RequestException) as e:
        print("⚠️ Не удалось отправить скриншот оплаты:", e)
        send_telegram_message(ADMIN_CHAT_ID, caption + '\n(не удалось прочитать фото)')


def verify_init_data(init_data):
    """Проверяет подпись Telegram WebApp initData (см. core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app)."""
    if not init_data:
        return None
    try:
        pairs = dict(parse_qsl(init_data, strict_parsing=True))
    except ValueError:
        return None
    received_hash = pairs.pop('hash', None)
    if not received_hash:
        return None
    data_check_string = '\n'.join(f'{k}={v}' for k, v in sorted(pairs.items()))
    secret_key = hmac.new(b'WebAppData', BOT_TOKEN.encode(), hashlib.sha256).digest()
    computed_hash = hmac.new(secret_key, data_check_string.encode(), hashlib.sha256).hexdigest()
    if not hmac.compare_digest(computed_hash, received_hash):
        return None
    return pairs


def is_admin_request(init_data):
    pairs = verify_init_data(init_data)
    if not pairs:
        return False
    try:
        user = json.loads(pairs.get('user', '{}'))
    except json.JSONDecodeError:
        return False
    return str(user.get('id')) == str(ADMIN_CHAT_ID)


def order_to_dict(row):
    return {
        'id': row['id'],
        'status': row['status'],
        'paymentStatus': row['payment_status'],
        'date': row['date'],
        'searchDate': row['search_date'],
        'orderedDate': row['ordered_date'],
        'shippingDate': row['shipping_date'],
        'stockDate': row['stock_date'],
        'deliveryDate': row['delivery_date'],
        'completedDate': row['completed_date'],
        'items': json.loads(row['items']) if row['items'] else [],
        'promoCode': row['promo_code'],
    }


@app.route('/api/create-order', methods=['POST', 'OPTIONS'])
def create_order():
    if request.method == 'OPTIONS':
        return '', 200

    data = request.json
    user_id = str(data['userId'])
    items = data.get('items', [])
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    conn = db()

    is_first_order = conn.execute(
        'SELECT 1 FROM orders WHERE user_id = ? LIMIT 1', (user_id,)
    ).fetchone() is None

    referred_by = data.get('referredBy')
    if referred_by:
        referred_by = str(referred_by)
        if referred_by == user_id:
            referred_by = None

    cur = conn.execute(
        '''INSERT INTO orders
               (user_id, user_name, username, items, promo_code, total_items, referred_by, status, date)
           VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?)''',
        (user_id, data.get('userName', ''), data.get('username', ''),
         json.dumps(items, ensure_ascii=False), data.get('promoCode'),
         data.get('totalItems', len(items)), referred_by, now),
    )
    order_id = cur.lastrowid
    conn.commit()
    conn.close()

    item_lines = "\n".join(
        f"• {i.get('name', '?')}" + (f" ({i.get('query')})" if i.get('query') else '')
        for i in items
    )
    msg = (
        f"🛍️ ЗАКАЗ #{order_id}\n"
        f"👤 {data.get('userName', '?')} (@{data.get('username', 'guest')})\n"
        f"{item_lines}"
        + (f"\n🏷️ Промокод: {data.get('promoCode')}" if data.get('promoCode') else '')
    )
    send_telegram_message(ADMIN_CHAT_ID, msg)

    if referred_by and is_first_order:
        send_telegram_message(
            referred_by,
            "🎉 Ваш друг оформил первый заказ по вашей ссылке!\n"
            "Ваш промокод на скидку: CLOSERS10",
        )

    return jsonify({'success': True, 'orderId': order_id})


@app.route('/api/user-orders', methods=['GET', 'OPTIONS'])
def get_orders():
    if request.method == 'OPTIONS':
        return '', 200

    user_id = request.args.get('userId')
    conn = db()
    rows = conn.execute(
        'SELECT * FROM orders WHERE user_id = ? ORDER BY date DESC', (user_id,)
    ).fetchall()
    conn.close()

    return jsonify([order_to_dict(r) for r in rows])


def apply_status_update(order_id, new_status):
    if new_status not in STATUS_FLOW:
        return jsonify({'success': False, 'error': 'invalid status'}), 400

    conn = db()
    row = conn.execute('SELECT * FROM orders WHERE id = ?', (order_id,)).fetchone()
    if row is None:
        conn.close()
        return jsonify({'success': False, 'error': 'order not found'}), 404

    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    date_column = STATUS_DATE_COLUMN.get(new_status)
    if date_column:
        conn.execute(
            f'UPDATE orders SET status = ?, {date_column} = ? WHERE id = ?',
            (new_status, now, order_id),
        )
    else:
        conn.execute('UPDATE orders SET status = ? WHERE id = ?', (new_status, order_id))
    conn.commit()
    conn.close()

    send_telegram_message(
        row['user_id'],
        f"📦 Заказ #{order_id}: статус обновлён — {STATUS_LABEL[new_status]}",
    )

    return jsonify({'success': True})


@app.route('/api/update-status', methods=['POST', 'OPTIONS'])
def update_status():
    if request.method == 'OPTIONS':
        return '', 200

    data = request.json
    if data.get('secret') != ADMIN_SECRET:
        return jsonify({'success': False, 'error': 'unauthorized'}), 401

    return apply_status_update(data.get('orderId'), data.get('status'))


@app.route('/api/submit-payment', methods=['POST', 'OPTIONS'])
def submit_payment():
    if request.method == 'OPTIONS':
        return '', 200

    data = request.json or {}
    order_id = data.get('orderId')
    user_id = str(data.get('userId', ''))
    screenshot = data.get('screenshot')
    if not order_id or not screenshot:
        return jsonify({'success': False, 'error': 'orderId and screenshot required'}), 400

    conn = db()
    row = conn.execute(
        'SELECT * FROM orders WHERE id = ? AND user_id = ?', (order_id, user_id)
    ).fetchone()
    if row is None:
        conn.close()
        return jsonify({'success': False, 'error': 'order not found'}), 404

    conn.execute(
        "UPDATE orders SET payment_status = 'submitted', payment_screenshot = ? WHERE id = ?",
        (screenshot, order_id),
    )
    conn.commit()
    conn.close()

    send_payment_review(order_id, screenshot, row)

    return jsonify({'success': True})


@app.route('/telegram-webhook', methods=['POST'])
def telegram_webhook():
    if request.headers.get('X-Telegram-Bot-Api-Secret-Token') != WEBHOOK_SECRET:
        return '', 403

    update = request.json or {}
    cq = update.get('callback_query')
    if not cq:
        return '', 200

    callback_id = cq.get('id')
    from_id = str(cq.get('from', {}).get('id', ''))
    data = cq.get('data', '')
    message = cq.get('message', {}) or {}

    if from_id != str(ADMIN_CHAT_ID):
        answer_callback_query(callback_id, 'Недостаточно прав')
        return '', 200

    if ':' not in data:
        return '', 200
    action, order_id_str = data.split(':', 1)
    try:
        order_id = int(order_id_str)
    except ValueError:
        return '', 200

    conn = db()
    row = conn.execute('SELECT * FROM orders WHERE id = ?', (order_id,)).fetchone()
    if row is None:
        conn.close()
        answer_callback_query(callback_id, 'Заказ не найден')
        return '', 200

    chat_id = message.get('chat', {}).get('id')
    message_id = message.get('message_id')
    base_caption = message.get('caption', '') or ''

    if action == 'pay_ok':
        conn.execute("UPDATE orders SET payment_status = 'confirmed' WHERE id = ?", (order_id,))
        conn.commit()
        send_telegram_message(row['user_id'], f"✅ Оплата заказа #{order_id} подтверждена!")
        edit_message_caption(chat_id, message_id, base_caption + '\n\n✅ ПОДТВЕРЖДЕНО')
        answer_callback_query(callback_id, 'Подтверждено')
    elif action == 'pay_no':
        conn.execute("UPDATE orders SET payment_status = 'rejected' WHERE id = ?", (order_id,))
        conn.commit()
        send_telegram_message(
            row['user_id'],
            f"❌ Оплата заказа #{order_id} не подтверждена. Пришлите, пожалуйста, скриншот ещё раз или свяжитесь с администратором.",
        )
        edit_message_caption(chat_id, message_id, base_caption + '\n\n❌ ОТКЛОНЕНО')
        answer_callback_query(callback_id, 'Отклонено')

    conn.close()
    return '', 200


@app.route('/api/admin/orders', methods=['GET'])
def admin_orders():
    if not is_admin_request(request.args.get('initData')):
        return jsonify({'success': False, 'error': 'unauthorized'}), 401

    conn = db()
    rows = conn.execute('SELECT * FROM orders ORDER BY date DESC').fetchall()
    conn.close()

    result = []
    for r in rows:
        d = order_to_dict(r)
        d['userName'] = r['user_name']
        d['username'] = r['username']
        result.append(d)
    return jsonify(result)


@app.route('/api/admin/update-status', methods=['POST', 'OPTIONS'])
def admin_update_status():
    if request.method == 'OPTIONS':
        return '', 200

    data = request.json or {}
    if not is_admin_request(data.get('initData')):
        return jsonify({'success': False, 'error': 'unauthorized'}), 401

    return apply_status_update(data.get('orderId'), data.get('status'))


if __name__ == '__main__':
    print("🚀 Сервер запущен!")
    app.run(host='0.0.0.0', port=5000, debug=True)
