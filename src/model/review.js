import mongoose from 'mongoose';
import Pet from './pet';
let Schema = mongoose.Schema;

let ReviewSchema = new Schema({
  title: String,
  text: String,
  pet: {type: Schema.Types.ObjectId, ref: 'Pet'}
});

module.exports = mongoose.model('Review', ReviewSchema);
