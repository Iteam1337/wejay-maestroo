var mysql      = require('mysql');
var async = require('async');
var fs = require('fs');

module.exports = {
  connect : function(options, done){
    var connection = mysql.createConnection({
      host     : process.env.DB_HOST || '192.168.59.103',
      user     : process.env.DB_USER || 'maestroo',
      password : process.env.DB_PASS || 'changeme',
      database : process.env.DB_NAME || 'maestroo',
      port : process.env.DB_PORT,
      multipleStatements : options && options.multipleStatements
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
    var connection = this.connect({ multipleStatements:true });
    async.series({
      clean: function(next){
        var sql = fs.readFileSync('./db/clean.sql').toString();
        connection.query(sql, next);
      },
      setup: function(next){
        var sql = fs.readFileSync('./db/createdb.sql').toString();
        connection.query(sql, next);
      },
      createUsers: function(next){
        var sql = fs.readFileSync('./db/createUsers.sql').toString();
        connection.query(sql, next);
      },
      users : function(next){
        var sql = fs.readFileSync('./db/importUsers.sql').toString();
        connection.query(sql, next);
      },
      songs : function(next){
        var sql = fs.readFileSync('./db/importHistory.sql').toString();
        connection.query(sql, next);
      }
    }, done);
  }
}
