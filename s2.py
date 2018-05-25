import requests
import time
import random

while True:
    val = random.uniform(35.5,82.2)
    r = requests.post("http://pi2biofeedback.dis.eafit.edu.co/signal/save", data={"ecg": val, "tiempo": 11, "conductor": "5b04551181c20f22762b3e49"})
    print(r.status_code, r.reason)
    print(r.text)
    time.sleep(1)
