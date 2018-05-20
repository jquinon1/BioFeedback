import requests
import time

while True:
    r = requests.post("http://localhost:3000/signal/save", data={"ecg": 88.553, "tiempo": 12, "conductor": "5aeb39e58c131d1cf52d1a7c"})
    print(r.status_code, r.reason)
    print(r.text)
    time.sleep(1)
