from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import os

cwd = os.getcwd()

import numpy as np

path = 'DatasetEntrenamiento/NoAfan'

arrNoAfan = []

for filename in os.listdir(path):
    # do your stuff
    with open('DatasetEntrenamiento/NoAfan/' + filename) as json_data:
        features = []
        noafan = {}
        d = json.load(json_data)
        features.append(d['maverageHeartRate'])
        features.append(d['meanSSinterval'])
        features.append(d['mean_RR'])

        noafan['feature'] = features
        
        noafan['estado'] = 1
        arrNoAfan.append(noafan)

# print(arrNoAfan)

path = 'DatasetEntrenamiento/Afan'

afan = {}
arrAfan = []

for filename in os.listdir(path):
    # do your stuff
    with open('DatasetEntrenamiento/Afan/' + filename) as json_data:
        features = []
        afan = {}
        d = json.load(json_data)
        features.append(d['maverageHeartRate'])
        features.append(d['meanSSinterval'])
        features.append(d['mean_RR'])

        afan['feature'] = features

        afan['estado'] = 2
        arrAfan.append(afan)

# print(arrAfan)

X = []
Y = []

for feature in arrNoAfan:
    X.append(feature['feature'])
    Y.append(feature['estado'])

for feature in arrAfan:
    X.append(feature['feature'])
    Y.append(feature['estado'])

print("FEATURES: " + str(X))
print("LENGTH: " + str(len(X)))
print("ESTADO: " + str(Y))
print("LENGTH: " + str(len(Y)))

X = np.array(X)
Y = np.array(Y)



from sklearn.naive_bayes import GaussianNB
clf = GaussianNB()
clf.fit(X, Y)


def index(request):
    var = clf.predict([[102.54,70.2,72.5]])
    return HttpResponse("Prediccion [1] --> No afan [2] --> Afan<br>" + str(var))

@csrf_exempt
def process(request):
    #if request.is_ajax():
    if request.method == 'POST':
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)

        if 'HeartRate' in body.keys():
            hrate = body['HeartRate']
            print(body)
            pred = clf.predict([[float(hrate)]])
            if pred == [1]:
                return HttpResponse("false")
            elif pred == [2]:
                return HttpResponse("true")
        else:
            print ("Error")

        return HttpResponse("Error")
    return HttpResponse("Not available")