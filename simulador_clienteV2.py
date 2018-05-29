import requests
import time

while True:
    r = requests.post("http://localhost:3000/signal/save", data={"ecg": 88.553, "tiempo": 12, "conductor": "5b0c32dbb4711b4242afef53"})
    print(r.status_code, r.reason)
    print(r.text)
    time.sleep(1)
