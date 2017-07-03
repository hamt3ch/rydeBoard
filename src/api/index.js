import { Router } from 'express';
import ride from './ride';
import user from './user';
import passenger from './passenger';
import { version } from '../../package.json';

export default ({ config, db }) => {
  const api = Router();

  api.use('/rides', ride({ config, db }));
  api.use('/users', user({ config, db }));
  api.use('/passengers', passenger({ config, db }));

  // perhaps expose some API metadata at the root
  api.get('/', (request, response) => {
    response.json({ version });
  });

  return api;
};
