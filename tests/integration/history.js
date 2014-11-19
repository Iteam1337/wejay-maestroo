var chai = require('chai');
//var sinon = require('sinon');
//var proxyquire = require('proxyquire');
var expect = chai.expect;
chai.use(require('sinon-chai'));

var history = require(process.cwd() + '/lib/history');

describe('db', function () {

  describe('history', function () {

    it('returns the full history from db', function (done) {
      history.all(function(err, rows){
        expect(err).to.not.exist;
        expect(rows).to.have.property('length');
        expect(rows.length, 'length').to.be.above(0);
        done();
      });
    });
  });

});