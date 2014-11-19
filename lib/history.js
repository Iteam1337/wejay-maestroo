var db = require('./db');

module.exports = {
  all : function(done){
    var connection = db.connect();
    connection.query('SELECT * FROM history', function(err, rows){
      connection.end();
      return done(err, rows);
    })
  }
}