var moment = require('moment');
var chai = require('chai');
var expect = chai.expect;
var suggestion = require(process.cwd() + '/lib/suggestion');

describe('suggestion', function () {
  var users;

  beforeEach(function () {
    users = [88];
  });
  
  describe('next', function () {
    it('returns the next song', function(done){

      var startDate = moment('2011-01-01').subtract(3, 'months').valueOf();
      var stopDate = moment().subtract(7, 'days').valueOf();
      
      this.timeout(5000);

      var userId = users[Math.floor(Math.random()*4)];
      suggestion.next(userId, startDate, stopDate, function(err, song){
        expect(err).not.to.exist;
        expect(song).to.exist;
        expect(song.UserId).to.eql(userId);
        done();
      });
    });
  });

});