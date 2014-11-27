var express = require('express');
var moment = require('moment');
var router = express.Router();
var Room = require('../lib/room');

/* GET users listing. */
router.get('/', function(req, res) {
  console.log('connect');
  var room = Room.connect(req.query.room, function(){
    room.activeUsers = room.users.filter(function(user){
      moment(user.lastPlayDate) > moment().subtract(1, 'hour');
    });
    res.render('room', { room: room, title: room.roomName });
  });
});

module.exports = router;
