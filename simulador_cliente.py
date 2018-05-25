import requests
import time
import random

while True:
    val = random.uniform(35.5,82.2)
    r = requests.post("http://localhost:3000/signal/save", data={"ecg": val, "tiempo": 11, "conductor": "5b059330f64cf70cc4eb3498"})
    print(r.status_code, r.reason)
    print(r.text)
    time.sleep(1)
