var mysql      = require('mysql');
var async = require('async');
var fs = require('fs');

module.exports = {
  connect : function(done){
    var connection = mysql.createConnection({
      host     : '192.168.59.103',
      user     : 'maestroo',
      database : 'maestroo',
      password : 'changeme',
      multipleStatements : true
    });

    connection.config.queryFormat = function (query, values) {
      if (!values) return query;
      return query.replace(/\@(\w+)/g, function (txt, key) {
        if (values.hasOwnProperty(key)) {
          return this.escape(values[key]);
        }
        return txt;
      }.bind(this));
    };

    if (done) return connection.connect(done);
    return connection;
  },
  setup : function(done){
    var connection = this.connect();
    async.series({
      clean: function(next){
        var sql = fs.readFileSync('./db/clean.sql').toString();
        connection.query(sql, next);
      },
      setup: function(next){
        var sql = fs.readFileSync('./db/createdb.sql').toString();
        connection.query(sql, next);
      },
      import : function(next){
        var sql = fs.readFileSync('./db/import.sql').toString();
        connection.query(sql, next);
      }
    }, done);
  }
}
