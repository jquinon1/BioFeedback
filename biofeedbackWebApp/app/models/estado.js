// Example model

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var EstadoSchema = new Schema({
    estado: Boolean,
    conductor: { type: Schema.Types.ObjectId, ref: 'User' }
});

EstadoSchema.virtual('date')
    .get(function(){
        return this._id.getTimestamp();
    });

mongoose.model('Estado', EstadoSchema);

