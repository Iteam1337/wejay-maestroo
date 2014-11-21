var express = require('express');
var router = express.Router();
var Room = require('../lib/room');

/* GET users listing. */
router.get('/', function(req, res) {
  console.log('connect');
  var room = Room.connect(req.query.room, function(){
    res.render('room', { room: room, title: room.roomName });
  });
});

module.exports = router;
