import mongoose from 'mongoose';

const user = new mongoose.Schema({
  date_created: { type: Date, default: Date.now },
  email: { type: String, required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  password: { type: String, required: true },
  trips: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ride' }],
});

export default mongoose.model('User', user);
