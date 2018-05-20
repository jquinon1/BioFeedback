var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SupervisorSchema = new Schema({
    nombre: String,
    apellidos: String,
    fecha_nacimiento: Date,
    correo: String,
    celular: String,
});

SupervisorSchema.virtual('date')
    .get(function(){
        return this._id.getTimestamp();
    });

mongoose.model('Supervisor', SupervisorSchema);