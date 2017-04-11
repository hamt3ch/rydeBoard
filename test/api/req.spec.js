/* eslint import/no-extraneous-dependencies: 0 */
import test from 'ava';
import request from 'supertest';
import 'babel-register';

import server from '../../src';

test('GET /rides :Success - ping endpoint', async (t) => {
  const res = await request(server)
              .get('/api/rides');

  t.is(res.status, 200);
});

test('POST /rides :Success - post new ride', async (t) => {
  const res = await request(server)
                    .post('/api/rides')
                    .send({
                      departure_location: 'Iceland',
                      arrival_location: 'London, United Kingdom',
                      departure_time: '12-06-2017 3:30 am',
                      seats_available: 6,
                      created_by: '58db64d8faff18761da07736',
                    });
  t.is(res.body.arrival_location, 'London, United Kingdom');
  t.is(res.body.departure_location, 'Iceland');
  t.is(res.body.departure_time, '12-06-2017 3:30 am');
  t.is(res.body.seats_available, 6);
  t.is(res.body.arrival_longitude, -0.1277583);
  t.is(res.body.arrival_latitude, 51.5073509);
  t.is(res.body.departure_longitude, -19.020835);
  t.is(res.body.departure_latitude, 64.963051);
  t.is(res.body.created_by, '58db64d8faff18761da07736');
  t.is(res.status, 200);
  let idToDelete = res.body._id; // eslint-disable-line
  await request(server).delete(`/api/rides/${idToDelete}`);
});

test('POST /rides :Fail - invalid user posting ride', async (t) => {
  const res = await request(server)
                    .post('/api/rides')
                    .send({
                      departure_location: 'Iceland',
                      arrival_location: 'London, United Kingdom',
                      departure_time: '12-06-2017 3:30 am',
                      seats_available: 6,
                      created_by: 'whoisthis',
                    });
  t.is(res.status, 500);
});

test('POST /rides :Fail - invalid fields', async (t) => {
  const res = await request(server)
                    .post('/api/rides')
                    .send({ foo: 'bar' });
  t.is(res.body.message, 'One or more field is empty.');
  t.is(res.status, 400);
});

test('DELETE /rides :Success - remove ride', async (t) => {
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
  t.is(res.body.message, `Removed ride ${idToDelete}`);
  t.is(res.status, 200);
});

test('DELETE /rides :Fail - remove non-existent ride', async (t) => {
  const idToDelete = 'someId'; // id thats isnt in the db
  const res = await request(server)
                    .delete(`/api/rides/${idToDelete}`);
  t.is(res.status, 404);
});

// USERS

test('GET /users :Success - ping endpoint', async (t) => {
  const res = await request(server)
              .get('/api/users');

  t.is(res.status, 200);
});

test('POST /users :Success - create new user', async (t) => {
  const res = await request(server)
              .post('/api/users')
              .send({
                first_name: 'Test',
                last_name: 'Tester',
                email: 'test@test.com',
                password: 'test',
              });
  t.is(res.body.last_name, 'Tester');
  t.is(res.body.email, 'test@test.com');
  t.is(res.status, 200);
  let idToDelete = res.body._id; // eslint-disable-line
  await request(server).delete(`/api/users/${idToDelete}`);
  t.is(res.status, 200);
});

test('POST /users :Fail - missing password', async (t) => {
  const res = await request(server)
              .post('/api/users')
              .send({
                first_name: 'Test',
                last_name: 'Tester',
                email: 'test@test.com',
              });
  t.is(res.status, 400);
});

test('POST /users :Fail - user already exists', async (t) => {
  const res = await request(server)
              .post('/api/users')
              .send({
                first_name: 'Test',
                last_name: 'Tester',
                email: 'test@test.com',
                password: 'test',
              });
  const res2 = await request(server)
              .post('/api/users')
              .send({
                first_name: 'Test',
                last_name: 'Tester',
                email: 'test@test.com',
                password: 'test',
              });
  t.is(res2.status, 400);
  t.is(res2.body.message, 'A user associated with this email already exists. Please use another email.');
  let idToDelete = res.body._id; // eslint-disable-line
  await request(server).delete(`/api/users/${idToDelete}`);
  t.is(res.status, 200);
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
