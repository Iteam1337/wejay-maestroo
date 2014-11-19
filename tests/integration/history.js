var chai = require('chai');
var fs = require('fs');
var async = require('async');
//var sinon = require('sinon');
//var proxyquire = require('proxyquire');
var expect = chai.expect;
chai.use(require('sinon-chai'));

var db = require(process.cwd() + '/lib/db');
var history = require(process.cwd() + '/lib/history');


describe('history', function () {

  before(function (done) {
    var connection = db.connect();
    
    async.series({
      clean: function(next){
        var sql = fs.readFileSync(process.cwd() + '/db/clean.sql').toString();
        connection.query(sql, next);
      },
      setup: function(next){
        var sql = fs.readFileSync(process.cwd() + '/db/createdb.sql').toString();
        connection.query(sql, next);
      },
      import : function(next){
        var sql = fs.readFileSync(process.cwd() + '/db/one.sql').toString();
        connection.query(sql, next);
      }
    }, done);
  });

  it('returns the full history from db', function (done) {
    history.all(function(err, rows){
      expect(err).to.not.exist;
      expect(rows).to.have.property('length');
      expect(rows.length, 'length').to.be.above(0);
      done();
    });
  });
});