
import requests
import sys
import random
import json
import time
from random import randint

if len(sys.argv) < 2:
	print("Debe pasasr el id del conductor")
	sys.exit(1)

with open('DatosECGPersonas/ECGPersona6NoAfan.json') as f:
    data = json.load(f)

print(len(data['ecg']))

for i in data['ecg']:
    print(i)
    r = requests.post("http://localhost:3000/signal/save", data={"ecg": i, "conductor": sys.argv[1]})
    
    print(r.status_code, r.reason)
    print(r.text)

    time.sleep(0.02)
