import moment from 'moment';
import resource from 'resource-router-middleware';
import Ride from '../models/ride';
import { geocoder } from '../service';

// Helper Methods
const requestValid = (body) => {
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

const geocodeAddress = (addr, callback) => {
  geocoder.batchGeocode(addr)
  .then((res) => {
    callback({
      departure: {
        latitude: res[0].value[0].latitude,
        longitude: res[0].value[0].longitude,
      },
      arrival: {
        latitude: res[1].value[0].latitude,
        longitude: res[1].value[0].longitude,
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
  geocodeAddress([response.departure_location, response.arrival_location], (callback) => {
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

export default ({ config, db }) => resource({

/** Property name to store preloaded entity on `request`. */
  id: 'ride',

/** For requests with an `id`, you can auto-load the entity.
*  Errors terminate the request, success sets `req[id] = data`.
*/
  load(req, id, callback) {
  // let facet = facets.find( facet => facet.id===id ),
  // err = facet ? null : 'Not found';
  // callback(err, facet);
  },

  /** GET / - List all entities */
  index({ params }, res) {
    Ride.where('createdBy')
      .exec((err, rides) => {
        if (err) return handleError(err);
        return res.json(rides);
      });
  },

  /** POST / - Create a new entity */
  create({ body }, res) {
    if (requestValid(body)) {
      configureBody(body, (data) => {
        const rideToSave = new Ride(data);
        rideToSave.save((err) => { // problem saving data to db
          if (err) return console.log(err);
          return true;
        });
        res.json(rideToSave); // Send back ride.json for confirmation
      });
    } else {
      res.json({ error: 'misformatted body' });
    }
  },

  /** GET /:id - Return a given entity */
  read({ facet }, res) {
    res.json(facet);
  },

  /** PUT /:id - Update a given entity */
  update({ facet, body }, res) {
    res.sendStatus(204);
  },

  /** DELETE /:id - Delete a given entity */
  delete({ facet }, res) {
    res.sendStatus(204);
  },
});
