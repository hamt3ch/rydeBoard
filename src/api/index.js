import { version } from '../../package.json';
import { Router } from 'express';
import ride from './ride';
import user from './user';

export default ({ config, db }) => {
	let api = Router();

	api.use('/rides', ride({ config, db }));
	api.use('/user', user({ config, db }));

	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		res.json({ version });
	});

	return api;
}
