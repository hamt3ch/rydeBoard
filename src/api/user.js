import resource from 'resource-router-middleware';
import users from '../models/users';

export default ({ config, db }) => resource({

	/** Property name to store preloaded entity on `request`. */
	id : 'user',

	// For requests with an `id`, you can auto-load the entity.
  // Errors terminate the request, success sets `req[id] = data`.

	load(req, id, callback) {
		let user = users.find( user => user.id === id ),
			err = user ? null : 'Not found';
		callback(err, user);
	},

	/** GET / - List all entities */
	index({ params }, response) {
		response.json(users);
	},

	/** POST / - Create a new entity */
	create({ body }, response) {
		body.id = users.length.toString(36);
		users.push(body);
		response.json(body);
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
