var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    Senal = mongoose.model('DatosSenal'),
    Conductor = mongoose.model('Conductor'),
    User = mongoose.model('User');

var config = require('../../config/config');
module.exports = function (app) {
    app.use('/signal', router);
};

heartRateValues = [];

router.post('/save', function (req, res) {
    console.log(req.body);

    Conductor.findOne({_id: req.body.conductor}, function (err, condu) {
        console.log("CONDUCTOR: " + condu);
        if (err) {
            return res.send(err);
        }else if (condu == null){
            return res.end("Id de conductor invalido");
        }

        if (condu.senales_recibidas == 0){

        }

        signal = new Senal({
            ecg: req.body.ecg,
            tiempo: req.body.tiempo,
            conductor: condu._id
        });

        Senal.create(signal, function (err, sigObj) {
            if(err)
                return res.send(err);
            return res.json(sigObj);
        });


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

router.get('/get/:user', function (req, res, next) {
    Senal.find()
        .populate({
            path: 'conductor',
            match: {_id: req.params.user}
        })
        .exec(function (err, signalData) {
            if (err) return res.send(err);
            return res.json(signalData);
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
