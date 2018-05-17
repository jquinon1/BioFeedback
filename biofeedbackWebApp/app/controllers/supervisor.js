var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    Conductor = mongoose.model('Conductor'),
    User = mongoose.model('User');

var config = require('../../config/config');
module.exports = function (app) {
    app.use('/supervisor', router);
};

router.get('/', function (req, res) {
    if(!req.user) {
        return res.redirect('/login?required=true');
    }


    Conductor.find()
        .populate({
            path: 'supervisor',
            match: { _id: req.user._id}
        })
        .exec(function (err, conductorData) {
            if (err) return res.send(err);


            res.render('index', {
                baseUrl: config.baseUrl,
                userInfo: req.user,
                conductores: conductorData
            });
        });
});

router.get('/get', function (req, res) {

    if(!req.user){
        return res.redirect("/login?error=true");
    }

    Conductor.find()
        .populate({
            path: 'supervisor',
            match: { _id: req.user._id}
        })
        .exec(function (err, signalData) {
            if (err) res.send(err);
            return res.json(signalData);
        });

});

router.get('/estado_conductor/:id', function (req, res) {

    if(!req.user){
        return res.redirect("/login?error=true");
    }

    Conductor.findOne({_id: req.params.id}, function (err, condu) {
            if (err) return res.send(err);

            return res.status(200).end(condu.estado_afan.toString());
    });

});

router.get('/create', function (req, res, next) {
    if(!req.user){
        return res.redirect("/login");
    }

    cond = new Conductor({
        nombre: "Mariana",
        apellidos: "Quintero",
        fecha_nacimiento: new Date,
        telefono: "222223",
        estado_afan: false,
        supervisor: req.user._id
    });

    Conductor.create(cond, function (err, condu) {
        if(err)
            res.send(err);
        console.log(condu);
        return res.end("good");
    });

});

router.get('/perfil', function (req, res, next) {
    if(!req.user){
        return res.redirect("/login");
    }
    return res.render('perfil', {
        baseUrl: config.baseUrl,
        userInfo: req.user

    });
});

router.get('/reportes', function (req, res) {
    if (!req.user) {
        return res.redirect('/login?required=true');
    }

    return res.render('reportes', {
        baseUrl: config.baseUrl,
        userInfo: req.user
    });
});


router.get('/conductor/:id', function (req, res, next) {
    if(!req.user){
        return res.redirect("/login");
    }
    Conductor.findOne({_id: req.params.id},function(err, cond) {
        if (err) return res.send(err);

        console.log("CONDUCTOR: " + cond);
        return res.render('conductor', {
            conductor: cond,
            baseUrl: config.baseUrl,
            userInfo: req.user

        });
    });
});


router.get('/tables', function (req, res, next) {
    res.render('tables');
});

router.get('/map', function (req, res, next) {
    res.render('map');
});