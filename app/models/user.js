// Example model

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var UserSchema = new Schema({
  name: String,
  lastname: String,
  username: {type: String, unique: true/*, required: true*/},
  password: String,
  google: {
		id: String,
		token: String,
		name: String
	}
});

UserSchema.virtual('date')
  .get(function(){
    return this._id.getTimestamp();
  });
mongoose.model('User', UserSchema);

