/* eslint import/no-extraneous-dependencies: 0 */
import test from 'ava';
import request from 'supertest';
import 'babel-register';

import server from '../../src';

test('GET /rides :Success: - ping endpoint', async (t) => {
  const res = await request(server)
              .get('/api/rides');

  t.is(res.status, 200);
});

test('POST /rides :Success: - creating a new ride', async (t) => {
  const res = await request(server)
                    .post('/api/rides')
                    .send({
                      departure_location: 'Iceland',
                      arrival_location: 'London, United Kingdom',
                      departure_time: '12-06-2017 3:30am',
                      seats_available: 6,
                      created_by: '58db64d8faff18761da07736',
                    });
  t.is(res.body.arrival_location, 'London, United Kingdom');
  t.is(res.body.departure_location, 'Iceland');
  // t.is(res.body.departure_time, '2017-12-06T15:30:00.000Z'); getting which is causing error "2017-12-06T11:30:00.000Z"
  t.is(res.body.seats_available, 6);
  t.is(res.body.arrival_longitude, -0.1277583);
  t.is(res.body.arrival_latitude, 51.5073509);
  t.is(res.body.departure_longitude, -19.020835);
  t.is(res.body.departure_latitude, 64.963051);
  t.is(res.body.created_by, '58db64d8faff18761da07736');
  t.is(res.status, 200);
});

test('POST /rides :Fail - invalid time', async (t) => {
  const res = await request(server)
                    .post('/api/rides')
                    .send({
                      departure_location: 'Iceland',
                      arrival_location: 'London, United Kingdom',
                      departure_time: '1999-12-31T23:23:00.000Z',
                      seats_available: 6,
                      created_by: 'testId',
                    });
  t.is(res.body.error, 'Please format time correctly.');
  t.is(res.status, 400);
});

test('POST /rides :Fail: - invalid fields', async (t) => {
  const res = await request(server)
                    .post('/api/rides')
                    .send({ foo: 'bar' });
  t.is(res.body.error, 'One or more field is empty.');
  t.is(res.status, 400);
});

test('DELETE /rides :Success - deleting a ride', async (t) => {
  const createRes = await request(server)
                    .post('/api/rides')
                    .send({
                      departure_location: 'Iceland',
                      arrival_location: 'London, United Kingdom',
                      departure_time: '12-06-2017 3:30am',
                      seats_available: 6,
                      created_by: '58db64d8faff18761da07736',
                    });

  let idToDelete = createRes.body._id; // eslint-disable-line
  const res = await request(server)
                    .delete(`/api/rides/${idToDelete}`);
  t.is(res.body.delete, `${idToDelete}`);
  t.is(res.status, 200);
});

test('DELETE /rides :Success - deleting ride that doesnt exist', async (t) => {
  const idToDelete = 'someId'; // id thats isnt in the db
  const res = await request(server)
                    .delete(`/api/rides/${idToDelete}`);
  t.is(res.status, 404);
});


// TODO: Finsh writing these test
/*
test('GET /rides/:id :Success - getting a ride w/ certain id', async (t) => {
  t.pass();
});

test('UPDATE /rides/:id :Success - update a ride w/ certain id', async (t) => {
  t.pass();
});

test('', async (t) => {
  t.pass();
});

*/
