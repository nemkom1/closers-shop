import os
import sys

import requests
from dotenv import load_dotenv

load_dotenv()

API_URL = os.environ.get('API_URL', 'http://localhost:5000/api')
ADMIN_SECRET = os.environ['ADMIN_SECRET']
STATUSES = ['pending', 'searching', 'ordered', 'shipping', 'stock', 'delivery', 'completed']


def main():
    if len(sys.argv) != 3:
        print("Использование: python admin_cli.py <orderId> <status>")
        print("Статусы:", ", ".join(STATUSES))
        return

    order_id, status = sys.argv[1], sys.argv[2]
    if status not in STATUSES:
        print("Неизвестный статус. Доступные:", ", ".join(STATUSES))
        return

    r = requests.post(f"{API_URL}/update-status", json={
        'orderId': int(order_id), 'status': status, 'secret': ADMIN_SECRET,
    })
    print(r.status_code, r.json())


if __name__ == '__main__':
    main()
