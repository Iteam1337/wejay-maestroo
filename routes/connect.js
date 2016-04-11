var express = require('express')
var moment = require('moment')
var router = express.Router()
var Room = require('../lib/room')

/* GET users listing. */
router.get('/', function (req, res) {
  console.log('connect', req.query.room)
  var room = Room.connect(req.query.room, function () {
    room.activeUsers = room.users.filter(function (user) {
      return moment(user.lastPlayDate).valueOf() > moment().subtract(1, 'hour').valueOf()
    })
    console.log('room', room)
    res.render('room', { room: room, title: room.roomName })
  })
})

module.exports = router
