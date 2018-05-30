// Example model

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ConductorSchema = new Schema({
    nombre: String,
    apellidos: String,
    fecha_nacimiento: Date,
    telefono: String,
    estado_afan: { type: Number, default: false },
    index_feature: { type: Number, default: 0 },
    senales_recibidas: { type: Number, default: 0 },
    supervisor: { type: Schema.Types.ObjectId, ref: 'User' }
    // users: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

ConductorSchema.virtual('date')
    .get(function(){
        return this._id.getTimestamp();
    });

mongoose.model('Conductor', ConductorSchema);

