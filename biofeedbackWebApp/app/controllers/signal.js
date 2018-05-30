var express = require('express'),
    request = require('request'),
    mongoose = require('mongoose'),
    Senal = mongoose.model('DatosSenal'),
    Conductor = mongoose.model('Conductor'),
    User = mongoose.model('User'),
    router = express.Router(),
    fs = require('fs'),
    path = require('path');

var config = require('../../config/config');
module.exports = function (app) {
    app.use('/signal', router);
};

heartRateValues = [];

function getFeature(n, callback) {
    filePath = path.join(__dirname, '../dataMixta.json');

    fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
        if (!err) {
            datos = JSON.parse(data);
            callback(datos[n]);
        } else {
            console.log(err);
        }
    });
}

router.get('/file', function(req, res) {
    getFeature(1, function(result){
        console.log(result);
    });
    return res.send("hola");
});

router.get('/reset/:id', function(req, res) {

    Senal.deleteMany({conductor: req.params.id}, function(err){
        if (err) {
            return res.send(err);
        }

        Conductor.updateOne({_id: req.params.id}, {estado_afan: false, index_feature: 0, senales_recibidas: 0}, function(err, result){
            console.log(result);
            return res.redirect("/supervisor");
        });

    });
});

router.post('/save', function (req, res) {
    Conductor.findOne({_id: req.body.conductor}, function (err, condu) {
        if (err) {
            return res.send(err);
        }else if (condu == null){
            return res.end("Id de conductor invalido");
        }
        console.log(condu.senales_recibidas);
        if (condu.senales_recibidas >= 1500){

            Senal.find({conductor: condu._id}).sort({_id: -1}).limit(1500).exec(function (err, sen) {
                if (err) return res.send(err);
                console.log("señales sorted: " + sen);

                //rand = (Math.random()*(89 - 77) + 77);
                rand = Math.random();

                //body = {
                //    "HeartRate": rand
                //}
                // AQUI SE ENVIAN LAS SEÑALES A MATLAB
                if (condu.index_feature == 17){
                    condu.index_feature = 0;
                    condu.save(function (err, updatedCond) {
                        if (err) return res.send(err);
                    });

                }
                getFeature(condu.index_feature, function(result) {

                    predData = {
                        heartRate: result.maverageHeartRate,
                        intervalRR: result.mean_RR,
                        intervalSS: result.meanSSinterval
                    };

                    request.post(
                        'http://localhost:8000/signal/',
                        { json: predData },
                        function (error, response, body) {
                            if (!error && response.statusCode == 200) {
                                console.log(body);
                                if(body != "Error"){
                                    request.post(
                                        'http://localhost:3000/supervisor/cambiar_estado',
                                        { json: { conductor: condu._id, estado_afan: body } },
                                        function (err, res, bod) {
                                            if (!err && res.statusCode == 200) {
                                                console.log(bod);
                                            }else {
                                                console.log("error: " + err);
                                            }
                                        }
                                    );
                                }else {
                                    console.log("Error");
                                }
                            }
                        }
                    );
                    condu.index_feature = condu.index_feature + 1;
                    condu.save(function (err, updatedCond) {
                        if (err) return res.send(err);
                    });

                    condu.senales_recibidas = condu.senales_recibidas + 1;
                    condu.save(function (err, updatedCond) {
                        if (err) return res.send(err);
                    });
                });



                return res.json({success: true, result: "good"});
            });

            condu.senales_recibidas = 0;
            condu.save(function (err, updatedCond) {
                if (err) return res.send(err);
            });
        }else {
            signal = new Senal({
                ecg: req.body.ecg,
                lat: req.body.lat,
                log: req.body.log,
                afan: condu.estado_afan,
                conductor: condu._id
            });

            Senal.create(signal, function (err, sigObj) {
                if (err) return res.send(err);
                condu.senales_recibidas = condu.senales_recibidas + 1;
                condu.save(function (err, updatedCond) {
                    if (err) return res.send(err);
                    return res.send(updatedCond);
                });
                //return res.json(sigObj);
            });
        }
    });
});

router.get('/get', function (req, res, next) {
    Senal.find()
        .populate('conductor')
        .exec(function (err, signalData) {
            if (err) res.send(err);
            res.json(signalData);
        });
});

router.get('/active', function (req, res, next) {
    Senal.find({
            date: {
                $gte: new Date(2018, 1, 1),
                $lt: new Date()
            }
        })
        .populate('conductor')
        .exec(function (err, signalData) {
            if (err) res.send(err);
            res.json(signalData);
        });
});

router.get('/get/:user', function (req, res, next) {
    Senal.find({conductor: req.params.user}).sort({_id: -1}).limit(500).exec(function (err, signalData) {
        if (err){
            return res.send(err);
        }else if (signalData == null){
            return res.end("Id de conductor invalido o no hay señales");
        }

        data = [];

        for(var i = 0;i < signalData.length;i++){
            data.push({
                x: signalData[i].fecha,
                y: signalData[i].ecg,
                afan: signalData[i].afan
            });
        }


        return res.json(data);
    });
});

router.get('/save/:id', function (req, res, next) {
    if(!req.user){
        return res.redirect("/login");
    }

    signal = new Senal({
        ecg: 0.0005,
        tiempo: 2.0,
        conductor: req.params.id
    });

    Senal.create(signal, function (err, sign) {
        if(err)
            return res.send(err);
        console.log(sign);
        return res.end("good");
    });

});
