import requests
import random
import json
import time

with open('DatosECGPersonas/ECGPersona6NoAfan.json') as f:
    data = json.load(f)

print(len(data['ecg']))

for i in data['ecg']:
    print(i)
    r = requests.post("http://localhost:3000/signal/save", data={"ecg": i, "conductor": "5b0e22d5cd245e45df3640c3"})
    print(r.status_code, r.reason)
    print(r.text)
    time.sleep(0.02)

'''while True:
    val = random.uniform(35.5,82.2)
    r = requests.post("http://localhost:3000/signal/save", data={"ecg": val, "tiempo": 11, "conductor": "5b0dd4b2761968111fb446cd"})
    print(r.status_code, r.reason)
    print(r.text)
    time.sleep(0.02)'''
