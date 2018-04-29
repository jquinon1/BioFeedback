var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var DatosSenalSchema = new Schema({
    ecg: Number,
    tiempo: Number,
    conductor: { type: Schema.Types.ObjectId, ref: 'Conductor' }
});

DatosSenalSchema.virtual('date')
    .get(function(){
        return this._id.getTimestamp();
    });

mongoose.model('DatosSenal', DatosSenalSchema);
