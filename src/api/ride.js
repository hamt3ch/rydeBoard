import resource from 'resource-router-middleware';
import geocoder from '../service';
import Util from '../lib';
import { Ride } from '../models';

/**
 * Helper methods
 */

const convertAddress = (address, callback) => {
  geocoder.batchGeocode(address)
  .then((response) => {
    callback({
      departure: {
        latitude: response[0].value[0].latitude,
        longitude: response[0].value[0].longitude,
      },
      arrival: {
        latitude: response[1].value[0].latitude,
        longitude: response[1].value[0].longitude,
      },
    });
  })
  .catch((err) => {
    callback(err);
  });
};

const configureBody = (body, data) => {
  const response = body;

  // Get long and lat for arrival and depart address
  convertAddress([response.departure_location, response.arrival_location], (callback) => {
    response.departure_longitude = callback.departure.longitude;
    response.departure_latitude = callback.departure.latitude;
    response.arrival_longitude = callback.arrival.longitude;
    response.arrival_latitude = callback.arrival.latitude;
    data(body);
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

  /** GET /:id - Find a ride with the given id */
  load(req, id, callback) {
    Ride.findOne({ _id: id }, (err, ride) => {
      if (err) return callback(err, null); // handleError() method should go here based upon message
      return callback(null, ride);
    });
  },

  /** GET / - List all rides */
  index({ params }, response) {
    Ride.find()
      .sort('-date_posted')
      .populate('created_by')
      .exec((err, rides) => {
        if (err) return Util.handleError(response, err);
        return response.json(rides);
      });
  },

  /** POST / - Create new ride */
  create({ body }, response) {
    if (!Util.allFieldsValid(body)) {
      Util.handleError(response, 'One or more field is empty.', 400);
    } else {
      configureBody(body, (data) => {
        const rideToSave = new Ride(data);
        rideToSave.save((err) => {
          if (err) return Util.handleError(response, err);
          return response.json(rideToSave);
        });
      });
    }
  },

  /** GET /:id - Return ride based on id */
  read({ ride }, response) {
    response.json(ride);
  },

  /** PUT /:id - Update ride */
  update({ ride, body }, response) {
    response.sendStatus(204);
  },

  /** DELETE /:id - Delete a given entity */
  delete({ ride }, response) {
    const _id = ride._id; // eslint-disable-line
    Ride.remove({ _id }, (err, ride) => { // eslint-disable-line
      if (err) return Util.handleError(response, err, 400);
      return response.json({
        message: `Removed ride ${_id}`, // eslint-disable-line
      });
    });
  },
});
