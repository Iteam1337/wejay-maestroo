var mysql      = require('mysql');

module.exports = {
  connect : function(){
    var connection = mysql.createConnection({
      host     : 'mysql',
      user     : 'root',
      password : 'changeme'
    });
    return connection.connect();
  }
}
