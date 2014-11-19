var mysql      = require('mysql');

module.exports = {
  connect : function(done){
    var connection = mysql.createConnection({
      host     : '192.168.59.103',
      user     : 'maestroo',
      database : 'maestroo',
      password : 'changeme'
    });
    if (done) return connection.connect(done);
    return connection;
  }
}
