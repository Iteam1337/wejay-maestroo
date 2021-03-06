var mysql = require('mysql')
var async = require('async')
var fs = require('fs')

module.exports = {
  connect: function (options, done) {
    var connection = mysql.createConnection({
      host: process.env.DB_HOST || 'local.docker',
      user: process.env.DB_USER || 'maestroo',
      password: process.env.DB_PASS || 'changeme',
      database: process.env.DB_NAME || 'maestroo',
      port: process.env.DB_PORT,
      multipleStatements: options && options.multipleStatements
    })

    connection.config.queryFormat = function (query, values) {
      if (!values) return query
      return query.replace(/\@(\w+)/g, function (txt, key) {
        if (values.hasOwnProperty(key)) {
          return this.escape(values[key])
        }
        return txt
      }.bind(this))
    }

    if (done) return connection.connect(done)
    return connection
  },
  setup: function (done) {
    var connection = this.connect({ multipleStatements: true })
    async.series({
      clean: function (next) {
        console.log('clean...')
        var sql = fs.readFileSync('./db/clean.sql').toString()
        connection.query(sql, next)
      },
      setup: function (next) {
        console.log('setup...')
        var sql = fs.readFileSync('./db/createdb.sql').toString()
        connection.query(sql, next)
      },
      createUsers: function (next) {
        console.log('createUsers...')
        var sql = fs.readFileSync('./db/createUsers.sql').toString()
        connection.query(sql, next)
      },
      users: function (next) {
        console.log('users...')
        var sql = fs.readFileSync('./db/importUsers.sql').toString()
        connection.query(sql, next)
      },
      songs: function (next) {
        console.log('songs...')
        var sql = fs.readFileSync('./db/importHistory.sql').toString()
        connection.query(sql, next)
      }
    }, done)
  }
}
