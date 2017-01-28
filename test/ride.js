/* global describe:true it:true*/
/* eslint import/no-extraneous-dependencies: ["error", {"peerDependencies": true}] */
import 'babel-polyfill';
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../src';

const should = chai.should();
chai.use(chaiHttp);

describe('/rides', () => {
  it('should list ALL rides on /api/rides GET', (done) => {
    chai.request(server)
    .get('/api/rides')
    .end((err, res) => {
      res.should.have.status(200);
      done();
    });
  });
  it('should list a SINGLE ride on api/rides/<id> GET');
  it('should add a SINGLE ride on api/rides POST');
  it('should update a SINGLE ride on api/rides/<id> PUT');
  it('should delete a SINGLE ride on api/rides/<id> DELETE');
});
