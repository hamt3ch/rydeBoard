import http from 'http';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import initializeDb from './db';
import middleware from './middleware';
import api from './api';
import config from './config.json';

// new instance of express
const app = express();
app.server = http.createServer(app);

/**
 * 3rd party middleware
 */

// Logger for HTTP Request
app.use(morgan('dev'));

app.use(cors({
  exposedHeaders: config.corsHeaders,
}));

app.use(bodyParser.json({
  limit: config.bodyLimit,
}));

// connect to db
initializeDb(config, (db) => {
  // internal middleware
  app.use(middleware({ config, db }));

  // api router
  app.use('/api', api({ config, db }));

  app.server.listen(process.env.PORT || config.port);

  console.log(`Started on port ${app.server.address().port}`); // eslint-disable-line
});

export default app;
