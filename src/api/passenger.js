import mongoose from 'mongoose';
import resource from 'resource-router-middleware';
import Util from '../lib';
import { Ride } from '../models';

mongoose.Promise = global.Promise;

/**
 * Helper methods
 */
const getPassenger = (ride) => { // eslint-disable-line
  return {
    passengers: ride.passengers,
    stand_by: ride.stand_by_passengers,
  };
};

const updatePassenger = (response, rideToUpdate) => {
  Ride.findById(rideToUpdate._id, (err, ride) => { // eslint-disable-line
    const curRide = ride;
    if (err) return Util.handleError(response, err);
    curRide.passengers = rideToUpdate.passengers;
    curRide.stand_by_passengers = rideToUpdate.stand_by_passengers;
    curRide.save((saveErr, updatedRide) => {
      if (saveErr) Util.handleError(response, saveErr);
      return updatedRide;
    });
  });
};

/**
 * HTTP requests
 */
export default ({ config, db }) => resource({  // eslint-disable-line

// Property name to store preloaded entity on `request`.
  id: 'ride',

// For requests with an `id`, you can auto-load the entity.
// Errors terminate the request, success sets `req[id] = data`.

  load(req, id, callback) {
    // let facet = facets.find( facet => facet.id===id ),
    // err = facet ? null : 'Not found';
    // callback(err, facet);
    // middleware for id calls
    Ride.findOne({ _id: id }, (err, ride) => {
      if (err) return callback(err, null); // handleError() method should go here based upon message
      return callback(null, ride);
    });
  },

  /** GET / - List all rides */
  index({ params }, response) {
    response.status(404);
    response.json({ error: 'no get for passenger without id' });
  },

  /** POST / - Add new passenger to ride */
  create({ body }, response) {
    response.json({ foo: 'bar' });
  },

  /** GET /:id - Return passengers from ride */
  read({ ride }, response) {
    response.json(getPassenger(ride));
  },

  /** PUT /:id - Update passenger */
  update({ ride, body }, response) {
    if (!body.confirm) {
      ride.stand_by_passengers.push(mongoose.Types.ObjectId(body.user_id));
    } else {
      ride.passengers.push(mongoose.Types.ObjectId(body.user_id));
    }
    updatePassenger(response, ride);
    response.json(getPassenger(ride));
  },

  /** DELETE /:id - Delete a given entity */
  delete({ ride }, response) {
    response.sendStatus(204);
  },
});
