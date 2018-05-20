var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    Supervisor = mongoose.model('Supervisor'),
    User = mongoose.model('User');

var config = require('../../config/config');
module.exports = function (app) {
    app.use('/administrador', router);
};


router.get('/agregar_supervisor', function (req, res, next) {
    if(!req.user) {
        return res.redirect("/login");
    }else {
        return res.render('agregar_supervisor', {
            baseUrl: config.baseUrl,
                userInfo: req.user
        });
    }
});

router.post('/agregar_supervisor', function (req, res) {
    if(!req.user){
        return res.redirect("/login");
    }

    sup = new Supervisor({
        nombre: req.body.nombre,
        apellidos: req.body.apellidos,
        fecha_nacimiento: req.body.fnacimiento,
        correo: req.body.correo,
        celular: req.body.celular
    });

    Supervisor.create(cond, function (err, condu) {
        if(err)
            return res.send(err);

        console.log(condu);
        return res.redirect('/administrador');
    });

});