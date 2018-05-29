import requests
import time
import random

while True:
    val = random.uniform(35.5,82.2)
<<<<<<< HEAD
    r = requests.post("http://localhost:3000/signal/save", data={"ecg": val, "tiempo": 11, "conductor": "5b059330f64cf70cc4eb3498"})
=======
    r = requests.post("http://pi2biofeedback.dis.eafit.edu.co/signal/save", data={"ecg": val, "tiempo": 11, "conductor": "5b03383d3c02fb156bad57f2"})
>>>>>>> 3703649435e2e01e3326d4203ece51e08d5ad598
    print(r.status_code, r.reason)
    print(r.text)
    time.sleep(1)
