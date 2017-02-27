import mongoose from 'mongoose';

const user = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: String,
  password: String,
  trips: [],
});

export default mongoose.model('User', user);
