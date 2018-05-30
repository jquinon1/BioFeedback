import requests
import time
import random

while True:
    val = random.uniform(35.5,82.2)
    r = requests.post("http://localhost:3000/signal/save", data={"ecg": val, "lat": "6.198536","log":"-75.577793","tiempo": 11, "conductor": "5b0df958e16d464bba5ebcbc"})
    print(r.status_code, r.reason)
    print(r.text)
    time.sleep(1)
