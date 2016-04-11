var express = require('express');
var db = require('../lib/db');
var router = express.Router();

/* GET import initial setup. */
router.get('/', function(req, res, next) {
  if (req.query.sure) {
    db.setup(function(err){
      if (err){
        return next(err);
      } else {
        res.send('Database cleaned and imported from scratch.');
      }
    })
  } else {
    res.send('Please add ?sure=true to clean and import database from scratch')
  }
});

module.exports = router;
