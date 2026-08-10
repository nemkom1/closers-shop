import json
import os
import sqlite3
import sys
from datetime import datetime

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
        completed_date TEXT
    )''')
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


def order_to_dict(row):
    return {
        'id': row['id'],
        'status': row['status'],
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


@app.route('/api/update-status', methods=['POST', 'OPTIONS'])
def update_status():
    if request.method == 'OPTIONS':
        return '', 200

    data = request.json
    if data.get('secret') != ADMIN_SECRET:
        return jsonify({'success': False, 'error': 'unauthorized'}), 401

    order_id = data.get('orderId')
    new_status = data.get('status')
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


if __name__ == '__main__':
    print("🚀 Сервер запущен!")
    app.run(host='0.0.0.0', port=5000, debug=True)
