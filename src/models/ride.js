import mongoose from 'mongoose';

const ride = new mongoose.Schema({
  arrival_location: String,
  coordinates: {
    arrival_latitude: Number,
    arrival_longitude: Number,
    departure_latitude: Number,
    departure_longitude: Number,
  },
  date_posted: { type: Date, default: Date.now },
  departure_location: String,
  departure_time: Date,
  passengers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  posted_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  seats_available: Number,
  stand_by_passengers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  // oneWay: Ride // if undefined >> oneWay Trip
  // else >> return Ride.Id of return trip
});

export default mongoose.model('Ride', ride);
