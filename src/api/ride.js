import resource from 'resource-router-middleware';
import geocoder from '../service';
import Util from '../lib';
import { Ride } from '../models';

/**
 * Helper methods
 */

const noEmptyFields = body => Util.allFieldsValid(body);

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
    Util.handleError(err);
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
    // var Ride =  db.model('Ride', model)
    Ride.find().sort('-date_posted').exec((err, rides) => {
      if (err) return Util.handleError(err);
      return response.json(rides);
    });
  },

  /** POST / - Create new ride */
  create({ body }, response) {
    if (!noEmptyFields(body)) {
      response.status(400);
      response.json({
        error: 'One or more field is empty.',
      });
    } else {
      configureBody(body, (data) => {
        const rideToSave = new Ride(data);
        rideToSave.save((err) => { // problem saving data to db
          if (err) return Util.handleError(err);
          return true;
        });
        response.json(rideToSave); // Send back ride.json for confirmation
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
    if (ride === null) {
      response.sendStatus(404);
    }

    Ride.remove({ _id: ride._id }, (err, ride) => { // eslint-disable-line
      if (err) {
        response.status(400);
        response.json({
          response: 'error deleting ride',
        });
        return Util.handleError(err);
      }
    });
    response.json({
      delete: ride._id, // eslint-disable-line
    });
  },
});
