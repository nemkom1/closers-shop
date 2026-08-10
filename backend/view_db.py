import json
import sqlite3

conn = sqlite3.connect('orders.db')
conn.row_factory = sqlite3.Row
orders = conn.execute("SELECT * FROM orders ORDER BY date DESC").fetchall()

print("=" * 80)
print(f"📦 ВСЕГО ЗАКАЗОВ: {len(orders)}")
print("=" * 80)

for o in orders:
    items = json.loads(o['items']) if o['items'] else []
    print(f"🆔 Заказ #{o['id']}")
    print(f"👤 Пользователь: {o['user_name']} (@{o['username']}, ID: {o['user_id']})")
    print(f"📦 Позиций: {len(items)}")
    for i in items:
        print(f"   • {i.get('name', '?')}" + (f" — {i.get('query')}" if i.get('query') else ''))
    print(f"🏷️ Промокод: {o['promo_code'] or 'нет'}")
    if o['referred_by']:
        print(f"🔗 Приглашён пользователем: {o['referred_by']}")
    print(f"📌 Статус: {o['status']}")
    print(f"⏰ Дата: {o['date']}")
    print("-" * 40)

conn.close()
