var express = require('express'),
    request = require('request'),
    mongoose = require('mongoose'),
    Senal = mongoose.model('DatosSenal'),
    Conductor = mongoose.model('Conductor'),
    User = mongoose.model('User'),
    router = express.Router();

var config = require('../../config/config');
module.exports = function (app) {
    app.use('/signal', router);
};

heartRateValues = [];

router.post('/save', function (req, res) {
    Conductor.findOne({_id: req.body.conductor}, function (err, condu) {
        if (err) {
            return res.send(err);
        }else if (condu == null){
            return res.end("Id de conductor invalido");
        }
        console.log(condu.senales_recibidas);
        if (condu.senales_recibidas >= 10){

            Senal.find({conductor: condu._id}).sort({_id: -1}).limit(10).exec(function (err, sen) {
                if (err) return res.send(err);
                console.log("señales sorted: " + sen);

                rand = (Math.random()*(89 - 77) + 77);

                //body = {
                //    "HeartRate": rand
                //}
                // AQUI SE ENVIAN LAS SEÑALES A MATLAB

                request.post(
                    'http://localhost:8000/signal/',
                    { json: { HeartRate: rand } },
                    function (error, response, body) {
                        if (!error && response.statusCode == 200) {
                            console.log(body);
                            if(body != "Error"){
                                request.post(
                                    'http://pi2biofeedback.dis.eafit.edu.co/supervisor/cambiar_estado',
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

                return res.json(sen);
            });

            condu.senales_recibidas = 0;
            condu.save(function (err, updatedCond) {
                if (err) return res.send(err);
            });
        }else {
            signal = new Senal({
                ecg: req.body.ecg,
                tiempo: req.body.tiempo,
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
    Senal.find({conductor: req.params.user}, function (err, signalData) {
        if (err){
            return res.send(err);
        }else if (signalData == null){
            return res.end("Id de conductor invalido o no hay señales");
        }

        data = [];

        for(var i = 0;i < signalData.length;i++){
            data.push({
                x: signalData[i].date,
                y: signalData[i].ecg
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
