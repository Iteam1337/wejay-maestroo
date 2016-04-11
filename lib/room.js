var history = require('./history')
var suggestion = require('./suggestion')
var moment = require('moment')
var io = require('socket.io-client')
var apiUrl = process.env.apiUrl || 'http://api.wejay.org'
var maestrooFacebookId = process.env.maestrooFacebookId || '154112144637878'

var rooms = {}

var self = module.exports = {
  suggest: function (room) {
    // TODO: switch to three months when we have a new history that is sufficient
    suggestion.next(room.users, moment().subtract(10, 'years'), moment().subtract(3, 'days'), function (err, song) {
      if (err) return console.error(err)
      if (!song) return console.log('No inspiration for new songs..')

      room.socket.emit('addSong', {
        spotifyId: song.SongId,
        user: {
          id: maestrooFacebookId,
          originalUser: song.FacebookId,
          duration: song.songLength * 1000
        }
      })
    })
  },
  connect: function (roomName, done) {
    var room = rooms[roomName] = rooms[roomName] || {roomName: roomName}
    if (!room.socket) {
      room.socket = io.connect(apiUrl)
      console.log('connecting to', apiUrl)
    }
    console.log('room.socket')

    room.socket.on('connect_error', function () {
      console.log('error', arguments)
    })

    room.socket.emit('join', {
      roomName: roomName,
      user: {
        name: 'Maestroo',
        first_name: 'Mae',
        last_name: 'stroo',
        id: maestrooFacebookId
      }
    }, function (updatedRoom) {
      console.log('updatedRoom', updatedRoom)
      room.users = updatedRoom.users
      room.userSongs = updatedRoom.userSongs
      room.currentSong = updatedRoom.currentSong
      room.queue = updatedRoom.queue
      room.history = updatedRoom.history

      if (!room.queue.length) {
        self.suggest(room)
      }

      done(room)
    })

    room.socket.on('nextSong', function (song) {
      if (!song) {
        self.suggest(room)
      } else {
        var played = { room: room, song: song, user: song.user }
        history.add(played)
      }
    })

    room.socket.on('userJoined', function (users) {
      room.users = users
    })

    room.socket.on('queue', function (song) {
      console.log('queue', song)
    })

    return room
  }
}
