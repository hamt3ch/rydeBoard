import resource from 'resource-router-middleware';
import User from '../models/user';
import Util from '../lib/util';

export default ({ config, db }) => resource({

	/** Property name to store preloaded entity on `request`. */
	id : 'user',

	// For requests with an `id`, you can auto-load the entity.
  // Errors terminate the request, success sets `req[id] = data`.

	load(req, id, callback) {
		// let user = users.find( user => user.id === id ),
		// 	err = user ? null : 'Not found';
		// callback(err, user);
		User.findOne({ _id: id }, (err, user) => {
			if (err) return callback(err, null);
			return callback(null, user);
		});
	},

	/** GET / - List all entities */
	index({ params }, response) {
		User.where('createdBy')
      .exec((err, users) => {
        if (err) return Util.handleError(err);
        return response.json(users);
      });
	},

	/** POST / - Create a new entity */
	create({ body }, response) {
		if (Util.allFieldsValid(body)) {
			const userToSave = new User(body);
			userToSave.save((err) => {
				if (err) return Util.handleError(err);
				response.json(userToSave);
				return true;
			});
		} else {
      response.json({ error: 'misformatted body' });
    }
	},

	/** GET /:id - Return a given entity */
	read({ user }, response) {
		response.json(user);
	},

	/** PUT /:id - Update a given entity */
	update({ user, body }, response) {
		for (let key in body) {
			if (key !== 'id') {
				user[key] = body[key];
			}
		}
		response.sendStatus(204);
	},

	/** DELETE /:id - Delete a given entity */
	delete({ user }, response) {
		users.splice(users.indexOf(user), 1);
		response.sendStatus(204);
	}
});
