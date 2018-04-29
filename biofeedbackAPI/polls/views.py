from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import os

cwd = os.getcwd()
print(cwd)

import numpy as np

path = 'DatasetEntrenamiento/NoAfan'

arrNoAfan = []

for filename in os.listdir(path):
    # do your stuff
    with open('DatasetEntrenamiento/NoAfan/' + filename) as json_data:
        noafan = {}
        d = json.load(json_data)
        noafan['feature'] = d['averageHeartRate']
        print(d['averageHeartRate'])
        noafan['estado'] = 1
        arrNoAfan.append(noafan)

# print(arrNoAfan)

path = 'DatasetEntrenamiento/Afan'

afan = {}
arrAfan = []

for filename in os.listdir(path):
    # do your stuff
    with open('DatasetEntrenamiento/Afan/' + filename) as json_data:
        afan = {}
        d = json.load(json_data)
        afan['feature'] = d['averageHeartRate']
        afan['estado'] = 2
        arrAfan.append(afan)

# print(arrAfan)

X = []
Y = []

for feature in arrNoAfan:
    X.append([feature['feature']])
    Y.append(feature['estado'])

for feature in arrAfan:
    X.append([feature['feature']])
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

print("sssssssssssssssssss", type(clf))


def index(request):
    var = clf.predict([[66.65]])
    return HttpResponse("Hello, world. You're at the polls index." + str(var))

@csrf_exempt
def process(request):
    #if request.is_ajax():
    if request.method == 'POST':
        print ("Raw Data: ", request.body)
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)

        if 'HeartRate' in body.keys():
            hrate = body['HeartRate']


        else:
            print ("boo")

        content = body['content']

        return JsonResponse(body)
    return HttpResponse("Not available")