import mongoose from 'mongoose';

var user = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  currentLocation: String,
  trips: [] // array of rideIDs
});

export default mongoose.model('User', user);
