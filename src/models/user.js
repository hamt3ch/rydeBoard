import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';

const user = new mongoose.Schema({
  date_created: { type: Date, default: Date.now },
  email: { type: String, required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  password: String, // only accepting Facebook users for now
  facebookId: String,
});

user.methods.hashPassword = (password, callback) => {
  bcrypt.hash(password, bcrypt.genSaltSync(), null, (err, hash) => {
    // Store hash in your password DB.
    if (err) return callback(err, null);
    return callback(null, hash);
  });
};

export default mongoose.model('User', user);
