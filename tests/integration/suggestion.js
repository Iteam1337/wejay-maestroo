var chai = require('chai');
var expect = chai.expect;
var suggestion = require(process.cwd() + '/lib/suggestion');

describe('suggestion', function () {
  var users;

  beforeEach(function () {
    users = [94, 13, 88, 84];
  });
  
  describe('next', function () {
    it('returns the next song', function(done){

      this.timeout(5000);

      var userId = users[Math.floor(Math.random()*4)];
      suggestion.next(userId, function(err, song){
        expect(err).not.to.exist;
        expect(song).to.exist;
        expect(song.UserId).to.eql(userId);
        done();
      });
    });
  });

});