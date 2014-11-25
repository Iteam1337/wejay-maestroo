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

    var connection = db.connect();
    var record = {
      songId : played.song.spotifyId,
      roomName : played.room.roomName,
      userId : played.user.facebookId,
      started : played.song.started
    };

    connection.query('\
      INSERT INTO history (SongId, SongLength, RoomId, UserId, SongPlayed) \
      VALUES (@songId, null, @roomName, @userUd, @started);\
      ', record, function(err, rows){
        console.log('History added', record);
        connection.end();
        return done && done(err, rows);
    });
    // var connection = db.connect();
    //'INSERT INTO history (SongId, SongLength, RoomId, UserId, SongPlayed)
    //VALUES ("spotify:track:", 231, "ITEAM", 94, "2011-08-22 12:46:35.813");'
/*
    connection.query('INSERT INTO history', function(err, rows){
      connection.end();
      return done(err, rows);
    });*/
  }
}