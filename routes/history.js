var express = require('express');
var router = express.Router();
var db = require('../lib/db');

/* GET users listing. */
router.get('/', function(req, res) {
  var connection = db.connect();
  connection.query('SELECT * FROM history', function(err, rows, fields){
    if (err) throw err;
    res.json(rows, fields);
    connection.end();
  });
});

module.exports = router;
