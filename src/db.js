import mongoose from 'mongoose';

mongoose.Promise = global.Promise;

export default (config, callback) => {
  const url = config.db.url;
  mongoose.connect(url, (err) => {
    console.log(err);
    if (err) callback(err);
  });
  callback(mongoose);
};
