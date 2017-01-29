import moment from 'moment';
import resource from 'resource-router-middleware';
import Ride from '../models/ride';
import { geocoder } from '../service';

/******************
 * Helper methods *
 ******************/
const validateRequest = (body) => {
  let count = 0;
  for (var field in body) {
    // check if any fields are empty
    if (body[field] === '') {
      return false;
    }
    count += 1;
  }

  // make sure date is valid
  if (!moment(body.departure_time, 'MM-DD-YYYY h:mm a').isValid()) {
    return false;
  }

  // make sure all fields are accounted for
  if (count !== 5) {
    return false;
  }

  return true;
};

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
    console.log(err);
  });
};

const configureBody = (body, data) => {
  // Transform date.string to actual date type
  const dateString = body.departure_time;
  const convert = moment(dateString, 'MM-DD-YYYY h:mm a');
  const response = body;
  response.departure_time = convert;

  // Get long and lat for arrival and depart address
  convertAddress([response.departure_location, response.arrival_location], (callback) => {
    response.departure_longitude = callback.departure.longitude;
    response.departure_latitude = callback.departure.latitude;
    response.arrival_longitude = callback.arrival.longitude;
    response.arrival_latitude = callback.arrival.latitude;
    data(body);
  });
};

// TODO: fill out error handling for all request
const handleError = (error) => {
  console.log(error);
};

/*****************
 * HTTP requests *
 *****************/
export default ({ config, db }) => resource({

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

  /** GET / - List all entities */
  index({ params }, response) {
    Ride.where('createdBy')
      .exec((err, rides) => {
        if (err) return handleError(err);
        return response.json(rides);
      });
  },

  /** POST / - Create a new entity */
  create({ body }, response) {
    if (validateRequest(body)) {
      configureBody(body, (data) => {
        const rideToSave = new Ride(data);
        rideToSave.save((err) => { // problem saving data to db
          if (err) return handleError(err);
          return true;
        });
        response.json(rideToSave); // Send back ride.json for confirmation
      });
    } else {
      response.json({ error: 'misformatted body' });
    }
  },

  /** GET /:id - Return a given entity */
  read({ ride }, response) {
    response.json(ride);
  },

  /** PUT /:id - Update a given entity */
  update({ ride, body }, response) {
    response.sendStatus(204);
  },

  /** DELETE /:id - Delete a given entity */
  delete({ ride }, response) {
    reresponses.sendStatus(204);
  },
});
