import mongoose from 'mongoose';

mongoose.Promise = global.Promise;

export default (config, callback) => {
  const url = config.db.url;
  mongoose.connect(url, (err) => {
    if (err) return console.log(err);
    return console.log('Connected successfully to server w/ mongoose');
  });

  callback(mongoose);
};
