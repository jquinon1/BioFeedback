import requests
import time

while True:
    r = requests.post("http://localhost:3000/signal/save", data={"ecg": 88.553,"lat":"6.200438","log":"-75.581884", "tiempo": 12, "conductor": "5b0e042a4afd9054d803bb3c"})
    print(r.status_code, r.reason)
    print(r.text)
    time.sleep(1)
