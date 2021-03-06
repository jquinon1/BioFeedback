/*jshint esversion: 6 */
var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    Conductor = mongoose.model('Conductor'),
    Estado = mongoose.model('Estado'),
    User = mongoose.model('User'),
    Senal = mongoose.model('DatosSenal');

require('dotenv').config();

var accountSid = process.env.TWILIO_ACCOUNT_SID ;
var authToken = process.env.TWILIO_TOKEN;
var client = require('twilio')(accountSid, authToken);


var config = require('../../config/config');
module.exports = function (app) {
    app.use('/supervisor', router);
};

router.get('/', function (req, res) {
    if(!req.user) {
        return res.redirect('/login?required=true');
    }
    Conductor.find({supervisor:req.user._id})
        .populate('supervisor')
        .exec(function (err, conductorData) {
            if (err) return res.send(err);


            res.render('index', {
                baseUrl: config.baseUrl,
                userInfo: req.user,
                conductores: conductorData
            });
        });
});



router.get('/delete/:id', function(req, res) {

    Conductor.deleteOne({_id: req.params.id}, function(err){
        if (err) {
            return res.send(err);
        }

        Senal.deleteMany({conductor: req.params.id}, function(err) {
            if (err) {
                return res.send(err);
            }

            return res.redirect("/supervisor/perfil");
        });

    });
});

router.post('/cambiar_estado', function (req, res) {
    console.log(req);
    Conductor.findOne({_id: req.body.conductor}).populate("supervisor").exec(function (err, condu) {
        if (err) {
            return res.send(err);
        } else if (condu == null) {
            return res.end("Id de conductor invalido");
        }
        console.log("ESTO ES: " + req.body.estado_afan + " typeof" + typeof(req.body.estado_afan));
        if (req.body.estado_afan == true) {
            if (condu.estado_afan == false){
              client.messages.create({
               body: 'El estado del conductor '+ condu.nombre +' ha cambiado a afan le recomendamos ponerse en contacto con el: '+condu.telefono,
               from: process.env.TWILIO_PHONE,
               to: '+57'+condu.supervisor.telefono
              }).then(message => console.log(message.sid)).done();
            }
            condu.estado_afan = true;
        }else if (req.body.estado_afan == false){
            condu.estado_afan = false;
        }

        condu.save(function (err, updatedCond) {
            if (err) return res.send(err);

            estado = new Estado({
                estado: condu.estado_afan,
                conductor: condu._id
            });

            Estado.create(estado, function (err, es) {
                if(err)
                    return res.send(err);
                console.log("Nuevo estado agregado: " + es);
                return res.json(updatedCond);
            });


        });

    });
});

router.get('/get', function (req, res) {

    if(!req.user){
        return res.redirect("/login?error=true");
    }

    Conductor.find({supervisor: req.user._id})
        .populate('supervisor')
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

router.get('/position_conductor/:id', function (req,res){
  if(!req.user){
      return res.redirect("/login?error=true");
  }
  Senal.findOne({conductor: req.params.id}).sort({_id: -1}).populate("conductor").exec(function(err,senal){
    if (err) return res.send(err);
    return res.status(200).json(senal);
  });
});

router.get('/test', function (req, res) {

    return res.render('live', {
        baseUrl: config.baseUrl
    });

});

router.get('/agregar_conductor', function (req, res, next) {
    if(!req.user) {
        return res.redirect("/login");
    }else {
        return res.render('agregar_conductor', {
            baseUrl: config.baseUrl,
            userInfo: req.user
        });
    }
});

router.post('/agregar_conductor', function (req, res) {
    if(!req.user){
        return res.redirect("/login");
    }

    cond = new Conductor({
        nombre: req.body.nombre,
        apellidos: req.body.apellidos,
        fecha_nacimiento: req.body.fnacimiento,
        telefono: req.body.telefono,
        estado_afan: false,
        supervisor: req.user._id
    });

    Conductor.create(cond, function (err, condu) {
        if(err)
            return res.send(err);

        console.log(condu);
        return res.redirect('/supervisor');
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

        fecha = new Date(cond.fecha_nacimiento);
        fechaActual = new Date();

        cond.edad = fechaActual.getFullYear() - fecha.getFullYear();

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
