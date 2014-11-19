var db = require('./db');
var moment = require('moment');

module.exports = {
  next : function(userId, done){
    var connection = db.connect();

    var startDate = moment().subtract(3, 'months').valueOf();
    var stopDate = moment().subtract(7, 'days').valueOf();
    

    connection.query('\
      SELECT * FROM history \
      LIMIT 0,1 \
    ', {userId: userId, stopDate: stopDate, startDate: startDate}, function(err, rows){
      connection.end();
      return done(err, rows[0]);
    })
  }
}

