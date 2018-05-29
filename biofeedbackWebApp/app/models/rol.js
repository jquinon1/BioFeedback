// Example model

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var RolSchema = new Schema({
  nombre: String
});

RolSchema.virtual('date')
  .get(function(){
    return this._id.getTimestamp();
  });

mongoose.model('Rol', RolSchema);
