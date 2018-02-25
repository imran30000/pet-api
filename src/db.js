import mongoose from 'mongoose';

export default callback => {
  let db = mongoose.connect('mongodb://imran:imran@ds247838.mlab.com:47838/pet', {useMongoClient: true});
  callback(db);
}
