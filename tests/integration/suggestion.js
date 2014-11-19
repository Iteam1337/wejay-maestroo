var chai = require('chai');
var fs = require('fs');
var async = require('async');
//var sinon = require('sinon');
//var proxyquire = require('proxyquire');
var expect = chai.expect;
chai.use(require('sinon-chai'));

var db = require(process.cwd() + '/lib/db');
var suggestion = require(process.cwd() + '/lib/suggestion');


describe('suggestion', function () {
    var users;

    before(function (done) {
      var connection = db.connect();
      this.timeout(15000);
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
          var sql = fs.readFileSync(process.cwd() + '/db/import.sql').toString();
          connection.query(sql, next);
        }
      }, done);

      users = [94, 13, 88, 84];
    });

    
    describe('suggestion', function () {
      it('returns the next song', function(done){

        this.timeout(5000);

        suggestion.next(users, function(err, song){
          expect(err).not.to.exist;
          expect(song).to.exist;
          done();
        });
      });
    });

});