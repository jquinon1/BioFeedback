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
            match: { _id: req.params.user}
        })
        .exec(function (err, signalData) {
            if (err) res.send(err);
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
