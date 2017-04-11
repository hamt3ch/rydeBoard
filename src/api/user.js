import resource from 'resource-router-middleware';
import { User } from '../models';
import Util from '../lib';

export default ({ config, db }) => resource({  // eslint-disable-line

  /** Property name to store preloaded entity on `request`. */
  id: 'user',

  // For requests with an `id`, you can auto-load the entity.
  // Errors terminate the request, success sets `req[id] = data`.

  load(req, id, callback) {
    User.findOne({ _id: id }, (err, user) => {
      if (err) return callback(err, null);
      return callback(null, user);
    });
  },

  /** GET / - List all users */
  index({ params }, response) {
    User.find().sort('-date_created').exec((err, users) => {
      if (err) return Util.handleError(response, err);
      return response.json(users);
    });
  },

  /** POST / - Create new user */
  create({ body }, response) {
    if (Util.allFieldsValid(body)) {
      User.findOne({ email: body.email }, (err, user) => {
        if (user) {
          Util.handleError(response, 'A user associated with this email already exists. Please use another email.', 400);
        } else {
          const userToSave = new User(body);
          userToSave.hashPassword(userToSave.password, (hashError, hashedPassword) => {
            if (hashError) return Util.handleError(response, hashError);
            userToSave.password = hashedPassword;
            userToSave.save((saveError) => {
              if (saveError) return Util.handleError(response, saveError);
              return response.json(userToSave);
            });
            return true;
          });
        }
      });
    } else {
      Util.handleError(response, 'One or more fields are missing.', 400);
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
    User.remove({ _id: user._id }, (err, user) => { // eslint-disable-line
      if (err) return Util.handleError(response, err, 400);
      return response.json({
        message: `All info for user ${user._id} has been removed.`, // eslint-disable-line
      });
    });
  },
});
