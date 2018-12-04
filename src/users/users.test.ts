import 'jest';
import * as request from 'supertest';
import * as log4js from 'log4js';
const log = log4js.getLogger('users-test');

/*consult: https://jestjs.io/docs/en/api */

test('get /users', () => {
  return request('http://localhost:3000')
    .get('/users')
    .then((response) => {
      log.debug(JSON.stringify(response));
      expect(response.status).toBe(200);
    })
    .catch(fail);
});
