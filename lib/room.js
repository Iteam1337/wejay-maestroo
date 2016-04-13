var history = require('./history')
var suggestion = require('./suggestion')
var moment = require('moment')
var io = require('socket.io-client')
var apiUrl = process.env.apiUrl || 'http://api.wejay.org'
var maestrooFacebookId = process.env.maestrooFacebookId || '154112144637878'
var request = require('request')

var rooms = {}

var self = module.exports = {
  suggest: function (room) {
    // TODO: switch to three months when we have a new history that is sufficient
    suggestion.next(room.users, moment().subtract(10, 'years'), moment().subtract(3, 'days'), function (err, song) {
      if (err) return console.error(err)
      if (!song) return console.log('No inspiration for new songs..')
      var spotifyId = song.SongId.split(':').pop()
      request({url: `https://api.spotify.com/v1/tracks/${spotifyId}`, json: true}, (err, res, spotifySong) => {
        if (err) return console.error(err)
        console.log('spotify', spotifySong)
        spotifySong.spotifyId = song.SongId
        spotifySong.duration = spotifySong.duration_ms
        spotifySong.user = {
          id: maestrooFacebookId,
          name: 'Maestroo',
          originalUser: song.FacebookId
        }

        room.socket.emit('addSong', spotifySong)
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
