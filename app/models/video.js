// Example model

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var VideoSchema = new Schema({
  title: String,
  description: String,
  file_name: String,
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  privacy: String,
  category: String,
  tags: [String]

});

VideoSchema.virtual('date')
  .get(function(){
    return this._id.getTimestamp();
  });

mongoose.model('Video', VideoSchema);

