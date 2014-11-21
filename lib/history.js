var db = require('./db');

module.exports = {
  all : function(done){
    var connection = db.connect();
    connection.query('SELECT * FROM history', function(err, rows){
      connection.end();
      return done(err, rows);
    })
  },
  add : function(played, done){
    console.log('TODO: save to db', played);
    return done();
    // var connection = db.connect();
    //'INSERT INTO maestroo.history (SongId, SongLength, RoomId, UserId, SongPlayed)
    //VALUES ("spotify:track:", 231, "ITEAM", 94, "2011-08-22 12:46:35.813");'
/*
    connection.query('INSERT INTO history', function(err, rows){
      connection.end();
      return done(err, rows);
    });*/
  }
}