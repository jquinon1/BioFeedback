import requests
import time

while True:
    r = requests.post("http://localhost:3000/signal/save", data={"ecg": 57.553, "tiempo": 11, "conductor": "5aeb39c88c131d1cf52d1a7b"})
    print(r.status_code, r.reason)
    print(r.text)
    time.sleep(1)
