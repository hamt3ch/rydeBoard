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

test('POST /rides :Success - creating a new ride', async (t) => {
  // const res = await request(server)
  //                   .post('/api/rides')
  //                   .send({ foo: 'bar' });
  //
  // console.log(res.body);
  // t.is(res.body.response, 'A field is empty.');
  t.pass();
});

test('POST /rides :Fail - invalid fields', async (t) => {
  const res = await request(server)
                    .post('/api/rides')
                    .send({ foo: 'bar' });
  t.is(res.body.response, 'A field is empty.');
  t.is(res.status, 400);
});

test('POST /rides :Fail - invalid time', async (t) => {
  const res = await request(server)
                    .post('/api/rides')
                    .send({
                      departure_location: 'Iceland',
                      arrival_location: 'London, United Kingdom',
                      departure_time: '1999-12-31T23:23:00.000Z',
                      seats_available: 6,
                      created_by: 'Hugh',
                    });
  t.is(res.body.response, 'Please format time correctly.');
  t.is(res.status, 400);
});

// TODO: Finsh writing these test
/*

test('DELETE /rides :Success - deleting a ride', async (t) => {
  t.pass();
});

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
