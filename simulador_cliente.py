import requests
import time

while True:
    r = requests.post("http://localhost:3000/signal/save", data={"ecg": 57.553, "tiempo": 11, "conductor": "5ae7b005e1f17c1f83b42883"})
    print(r.status_code, r.reason)
    print(r.text)
    time.sleep(2)
