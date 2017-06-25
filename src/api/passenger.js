import mongoose from 'mongoose';
import resource from 'resource-router-middleware';
import Util from '../lib';
import { Ride } from '../models';

mongoose.Promise = global.Promise;

/**
 * Helper methods
 */
const getPassengers = (ride, response) => { // eslint-disable-line
  Ride.findById(ride).populate('passengers').exec((err, result) => {
    if (err) return err;
    return response.json(result.passengers);
  });
};

const updatePassengersList = (response, rideToUpdate) => {
  Ride.findById(rideToUpdate, (err, ride) => { // eslint-disable-line
    const curRide = ride;
    if (err) return Util.handleError(response, err);
    curRide.passengers = rideToUpdate.passengers;
    curRide.save((saveErr, updatedRide) => {
      if (saveErr) return Util.handleError(response, saveErr);
      updatedRide.populate('passengers', (err, updatedRide) => {
        return response.json(updatedRide.passengers);
      });
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

  /** GET / - List all passengers */
  index({ params }, response) {
    return Util.handleError(response, 'cannot retrieve passengers without ride id', 404);
  },

  /** POST / - Add new passenger to ride */
  create({ body }, response) {
    response.json({ foo: 'bar' });
  },

  /** GET /:id - Return passengers from ride */
  read({ ride }, response) {
    getPassengers(ride, response);
  },

  /** PUT /:id - Update passenger */
  update({ ride, body }, response) {
    // Check if user is already in ride
    if (ride.passengers.indexOf(body.user_id) > -1) {
      return Util.handleError(response, 'passenger already in list', 409);
    }
    // Add user to ride
    ride.passengers.push(mongoose.Types.ObjectId(body.user_id));
    updatePassengersList(response, ride);
  },

  /** DELETE /:id - Delete a given entity */
  delete({ ride, body }, response) {
    // Check if user exists
    if (ride.passengers.indexOf(body.user_id) < 0) {
      return Util.handleError(response, 'passenger does not exist', 408);
    }

    // Remove user from ride
    ride.passengers.splice(ride.passengers.indexOf(body.user_id), 1);
    updatePassengersList(response, ride);
  },
});
