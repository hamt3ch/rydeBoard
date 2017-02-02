import mongoose from 'mongoose';

const ride = new mongoose.Schema({
  departure_location: String,
  departure_longitude: Number, // geocoded by address (googleMaps Api)
  departure_latitude: Number,
  departure_time: Date,
  arrival_location: String,
  arrival_longitude: Number, // geocoded by address (googleMaps Api)
  arrival_latitude: Number,
  seats_available: Number,
  // passengers: [User], //list of userIds
  created_by: String,
  // created_by: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  // oneWay: Ride // if undefined >> oneWay Trip
  // else >> return Ride.Id of return trip
});

export default mongoose.model('Ride', ride);
