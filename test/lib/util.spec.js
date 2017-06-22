/* eslint import/no-extraneous-dependencies: 0 */
import test from 'ava';
import 'babel-register';

import Util from '../../src/lib';

test('formatQuery() :Success - {mongoGeocoding Query}', (t) => {
  const inputBody = { departure_coordinate: '[-118.2436849, 30.443902444762696]' };
  const formattedBody = Util.formatQuery(inputBody);
  const result = {
    departure_coordinate: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [-118.2436849, 30.443902444762696],
        },
        $maxDistance: 1,
      },
    },
  };

  t.deepEqual(result, formattedBody);
});
