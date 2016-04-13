var db = require('./db')
var moment = require('moment')

module.exports = {
  next: function (users, startDate, stopDate, done) {
    var connection = db.connect({multipleStatements: true})

    var userIds = users.map(function (user) {
      return moment(user.lastPlayDate) > moment().subtract(1, 'hour') && (user.facebookId || user.id)
    })

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
      'INNER JOIN user u ON u.UserId = h.UserId',
      'HAVING (u.FacebookId IN (@userIds) OR u.UserId IN (@userIds)) AND',
      '  (',
      '    (s.played < @stopDate)',
      '    AND (s.played > @startDate)',
      '  )',
      'LIMIT 0,1;'
    ].join('\r\n'), {userIds: userIds, stopDate: moment(stopDate).toISOString(), startDate: moment(startDate).toISOString()}, function (err, rows) {
      if (err) return console.error(err)
      console.log('sql', rows)
      connection.end()
      return done(err, rows && rows.length ? rows[1][0] : null)
    })
  }
}
