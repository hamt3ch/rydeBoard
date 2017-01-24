import resource from 'resource-router-middleware';
import Ride from '../models/ride';
import moment from 'moment';
import geocoder from '../service/google.maps'

export default ({ config, db }) => resource({

	/** Property name to store preloaded entity on `request`. */
	id : 'ride',

	/** For requests with an `id`, you can auto-load the entity.
	 *  Errors terminate the request, success sets `req[id] = data`.
	 */
	load(req, id, callback) {
		// let facet = facets.find( facet => facet.id===id ),
		// 	err = facet ? null : 'Not found';
		// callback(err, facet);
	},

	/** GET / - List all entities */
	index({ params }, res) {
    Ride.where('createdBy')
    .exec((err, rides) => {
      if (err) return handleError(err);
      res.json(rides);
    })
	},

	/** POST / - Create a new entity */
	create({ body }, res) {
		if(requestValid(body)) {
      configureBody(body, (data) => {
				console.log(data)
				var rideToSave = new Ride(data);
	      rideToSave.save((err) => { // problem saving data to db
	      	if (err) return console.log(err);
				})

				res.json(rideToSave); // Send back ride.json for confirmation

		});
		} else {
			res.json({'error': 'misformatted body'});
		}
	},

	/** GET /:id - Return a given entity */
	read({ facet }, res) {
		res.json(facet);
	},

	/** PUT /:id - Update a given entity */
	update({ facet, body }, res) {
		for (let key in body) {
			if (key!=='id') {
				facet[key] = body[key];
			}
		}
		res.sendStatus(204);
	},

	/** DELETE /:id - Delete a given entity */
	delete({ facet }, res) {
		facets.splice(facets.indexOf(facet), 1);
		res.sendStatus(204);
	}
});

// Helper Methods
var requestValid = (body) => {
	var count = 0;
  for(var field in body){
    //check if any fields are empty
    if(body[field] === ''){
      return false;
    }
    count++;
  }

  // make sure date is valid
  console.log(body.departure_time);
  if(!moment(body.departure_time, "MM-DD-YYYY h:mm a").isValid()){
    return false;
  }

  // make sure all fields are accounted for
  if(count !== 5){
    return false;
  }

  return true;
}

var configureBody = (body, data) => {
  // Transform date.string to actual date type
  var dateString = body.departure_time;
  var convert = moment(dateString, "MM-DD-YYYY h:mm a");
  body.departure_time = convert;

  // Get long and lat for arrival and depart address
  var locations = geocodeAddress([body.departure_location,body.arrival_location], (callback) => {
    body.departure_longitude = callback.departure.longitude;
    body.departure_latitude = callback.departure.latitude;
    body.arrival_longitude = callback.arrival.longitude;
    body.arrival_latitude = callback.arrival.latitude;
		data(body);
  });
}

var geocodeAddress = (addr,callback) => {
  geocoder.batchGeocode(addr)
  .then(function(res) {
    callback({
      "departure": {
        "latitude":res[0].value[0].latitude,
        "longitude": res[0].value[0].longitude
      },
      "arrival": {
        "latitude":res[1].value[0].latitude,
        "longitude": res[1].value[0].longitude
      }
    })
  })
  .catch(function(err) {
    console.log(err);
  });
}
