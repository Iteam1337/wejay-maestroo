var db = require('./db');
var moment = require('moment');

module.exports = {
  next : function(userId, done){
    var connection = db.connect();

    var startDate = moment().subtract(3, 'months').valueOf();
    var stopDate = moment().subtract(7, 'days').valueOf();
    

    connection.query('\
      CREATE TEMPORARY TABLE\
      IF NOT EXISTS songPlayed AS\
      (\
        SELECT SongId, MAX(SongPlayed) AS played\
        FROM history\
        HAVING (h.UserId = @userId) AND\
        GROUP BY SongId\
      );\
      \
      SELECT * FROM history h\
      INNER JOIN songPlayed s ON h.songid = s.songid\
      HAVING (h.UserId = @userId) AND\
        (\
        (s.played < @stopDate) -- title separation\
        AND (s.played > @startDate) -- how far back do we want to include?\
        -- AND (COUNT(*) >= 2) -- or have been played at least two times during the period\
        -- AND (ISNULL(AVG(maestro_votes.vote_value), 3) >= 3) -- average vote is not below normal\
        ) \
        -- OR\
        -- ( \
        --   (ISNULL(AVG(maestro_votes.vote_value), 3) >= 4) -- \
        --   AND \
        --   (MAX(lastPlayed.SongPlayed) < @stopDate) -- play good songs forever but respect title separation\
        -- ) \
      LIMIT 0,1;\
    ', {userId: userId, stopDate: stopDate, startDate: startDate}, function(err, rows){
      if (err) return done(err);
      connection.end();
      return done(err, rows[0]);
    })
  }
}

