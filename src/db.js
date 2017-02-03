import mongoose from 'mongoose';

export default (callback) => {
  const url = 'mongodb://admin:hacks@ds019946.mlab.com:19946/ryde-board';
  mongoose.connect(url, (err) => {
    if (err) return console.log(err);
    return console.log('Connected successfully to server w/ mongoose');
  });

  callback(mongoose);
};
