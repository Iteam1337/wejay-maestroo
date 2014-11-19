var db = require('./db');
var moment = require('moment');

module.exports = {
  next : function(userId, startDate, stopDate, done){
    var connection = db.connect();

    connection.query([
        'CREATE TEMPORARY TABLE',
        'IF NOT EXISTS songPlayed AS',
        '(',
        '  SELECT SongId, MAX(SongPlayed) AS played',
        '  FROM history',
        '  GROUP BY SongId',
        ');',
        '',
        'SELECT * FROM history h',
        'INNER JOIN songPlayed s ON h.songid = s.songid',
        'HAVING (h.UserId = @userId) AND',
        '  (',
        '    (s.played < @stopDate)',
        '    AND (s.played > @startDate)',
        '  )',
        'LIMIT 0,1;'
      ].join('\r\n'),
    {userId: userId, stopDate: moment(stopDate).toISOString(), startDate: moment(startDate).toISOString()}, function(err, rows){
      console.log(this.sql);
      if (err) return done(err);
      connection.end();
      return done(err, rows[0]);
    })
  }
}

