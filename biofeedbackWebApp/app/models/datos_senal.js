var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var DatosSenalSchema = new Schema({
    ecg: Number,
    lat: String,
    log: String,
    fecha: { type: Date, default: Date.now },
    afan: Boolean,
    conductor: { type: Schema.Types.ObjectId, ref: 'Conductor' }
});

DatosSenalSchema.virtual('date')
    .get(function(){
        return this._id.getTimestamp();
    });

mongoose.model('DatosSenal', DatosSenalSchema);
