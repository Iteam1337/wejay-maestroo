var express = require('express');
var db = require('../lib/db');
var router = express.Router();

/* GET users listing. */
router.get('/import', function(req, res) {
  if (req.query.sure) {
    db.setup(function(){
      res.send('Database cleaned and imported from scratch.');
    })
  } else {
    res.send('Please add ?sure=true to clean and import database from scratch')
  }
});

module.exports = router;
