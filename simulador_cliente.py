import requests
import time

while True:
    r = requests.post("http://localhost:3000/signal/save", data={"ecg": 57.553, "tiempo": 11, "conductor": "5aeb446d4629621fa4ed7fa6"})
    print(r.status_code, r.reason)
    print(r.text)
    time.sleep(1)
