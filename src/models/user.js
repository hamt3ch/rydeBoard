import mongoose from 'mongoose';

var user = new mongoose.Schema({
  firstName: String,
  lastName: String,
  currentLocation: String
  // Finsh up other fields
});

export default mongoose.model('User', user);
