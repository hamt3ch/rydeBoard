import resource from 'resource-router-middleware';
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
      if (err) return Util.handleError(err.code);
      return response.json(users);
    });
  },

  /** POST / - Create new user */
  create({ body }, response) {
    if (Util.allFieldsValid(body)) {
      User.findOne({ email: body.email }, (err, user) => {
        if (user) {
          response.status(400).send({
            error: 'A user associated with this email already exists. Please use another email.'
          });
        } else {
          const userToSave = new User(body);
          userToSave.hashPassword(userToSave.password, (error, hashedPassword) => {
            if (error) return Util.handleError(error);
            userToSave.password = hashedPassword;
            userToSave.save((saveError) => {
              if (saveError) return Util.handleError(saveError.code);
              response.json(userToSave);
              return true;
            });
          });
        }
      });
    } else {
      response.status(400).send({ error: 'One or more fields are missing.' });
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
    if (user === null) {
      response.sendStatus(404);
    }

    User.remove({ _id: user._id }, (err, user) => { // eslint-disable-line
      if (err) {
        response.status(400).send({
          error: 'User unable to be removed.',
        });
        return Util.handleError(err);
      }
    });
    response.json({
      delete: user._id, // eslint-disable-line
    });
  },
});
