var chai = require('chai');
var db = require(process.cwd() + '/lib/db');

describe('db', function () {

  describe('setup', function () {
    it('can create all neccessary db tables', function (done) {
      this.timeout(15000);
      db.setup(done);
    });
  });

});