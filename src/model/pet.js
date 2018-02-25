import mongoose from 'mongoose';
import Review from './review';
let Schema = mongoose.Schema;

let PetSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  foodtype: {
    type: String,
    required: true
  },
  price: Number,
  reviews: [{type: Schema.Types.ObjectId, ref: 'Review'}]
});

module.exports = mongoose.model('Pet', PetSchema);
