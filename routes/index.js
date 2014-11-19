var express = require('express');
var router = express.Router();

var history = require('../lib/history.js');

/* GET home page. */
router.get('/', function(req, res) {
  history.all(function (err, rows) {
    res.render('index', { title: 'Maestroo', latest: rows });
  });
});

module.exports = router;
