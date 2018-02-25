import mongoose from 'mongoose';
import Account from './account';
const Schema = mongoose.Schema;

let ProfileSchema = new Schema({
    firstName : String,
    lastName : String,
    account : {type: Schema.Types.ObjectId, ref: 'Account'}
});

module.exports = mongoose.model('Profile', ProfileSchema);
