var moment = require('moment');
var chai = require('chai');
var expect = chai.expect;
var suggestion = require(process.cwd() + '/lib/suggestion');

describe('suggestion', function () {
  var users;

  beforeEach(function () {
    users = [{facebookId: '523648061', '594216665'}];
  });
  
  describe('next', function () {
    it('returns the next song', function(done){

      var startDate = moment('2011-01-01').subtract(3, 'months').valueOf();
      var stopDate = moment().subtract(7, 'days').valueOf();
      
      this.timeout(5000);

      suggestion.next(users, startDate, stopDate, function(err, song){
        expect(err).not.to.exist;
        expect(song).to.exist;
        expect(song.FacebookId, 'facebookId' + JSON.stringify(song)).to.exist;

        expect(song.FacebookId).to.equal(users[0].facebookId);
        done();
      });
    });

    it('handles zero songs gracefully', function(done){

      var startDate = moment().subtract(1, 'days').valueOf();
      var stopDate = moment().subtract(7, 'days').valueOf();
      
      this.timeout(5000);

      suggestion.next(users, startDate, stopDate, function(err, song){
        expect(err).not.to.exist;
        expect(song).not.to.exist;
        done();
      });
    });
  });

});