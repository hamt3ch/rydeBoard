import resource from 'resource-router-middleware';
import bcrypt from 'bcrypt';
import { User } from '../models';
import Util from '../lib';

export default ({ config, db }) => resource({  // eslint-disable-line

  /** Property name to store preloaded entity on `request`. */
  id: 'user',

  // For requests with an `id`, you can auto-load the entity.
  // Errors terminate the request, success sets `req[id] = data`.

  load(req, id, callback) {
    // let user = users.find( user => user.id === id ),
    // err = user ? null : 'Not found';
    // callback(err, user);
    User.findOne({ _id: id }, (err, user) => {
      if (err) return callback(err, null);
      return callback(null, user);
    });
  },

  /** GET / - List all users */
  index({ params }, response) {
    User.find().sort('-date_created').exec((err, users) => {
      if (err) return Util.handleError(err);
      return response.json(users);
    });
  },

  /** POST / - Create new user */
  create({ body }, response) {
    if (Util.allFieldsValid(body)) {
      const userToSave = new User(body);
      const salt = bcrypt.genSaltSync(10);
      userToSave.password = bcrypt.hashSync(userToSave.password, salt);
      userToSave.save((err) => {
        if (err) return Util.handleError(err);
        response.json(userToSave);
        return true;
      });
    } else {
      response.status(400);
      response.json({ error: 'One or more fields are missing.' });
    }
  },

  /** GET /:id - Return user */
  read({ user }, response) {
    response.json(user);
  },

  /** PUT /:id - Update user */
  update({ user, body }, response) {
    const tempUser = user;
    /* eslint no-restricted-syntax: 0 */
    for (const key in body) {
      if (key !== 'id') {
        tempUser[key] = body[key];
      }
    }
    response.sendStatus(204);
  },

  /** DELETE /:id - Delete a given entity */
  delete({ user }, response) {
    user.splice(user.indexOf(user), 1);
    response.sendStatus(204);
  },
});
