/* eslint import/no-extraneous-dependencies: 0 */
import test from 'ava';
import request from 'supertest';
import 'babel-register';

import server from '../../src';

test('GET /Rides :Success', async t => {
  t.plan(1); // 1 assertion

  const res = await request(server)
              .get('/api/rides');

  t.is(res.status, 200);
});
