var history = require('./history');
var io = require('socket.io-client');
var apiUrl = 'http://wejay.itea.md';
var maestrooFacebookId = 154112144637878;

var rooms = {};

var self = module.exports = {
  connect: function(roomName, done){

    var room = rooms[roomName] = rooms[roomName] || {roomName:roomName};
    if (!room.socket) room.socket = io.connect(apiUrl);
    
    room.socket.on('connect_error', function(){
      console.log('error', arguments);
    });

    room.socket.emit('join', {
      roomName: roomName,
      user: {
        name: 'Maestroo',
        id:maestrooFacebookId
      }
    }, function(updatedRoom){
      room.users = updatedRoom.users;
      room.userSongs = updatedRoom.userSongs;
      room.currentSong = updatedRoom.currentSong;
      room.queue = updatedRoom.queue;
      room.history = updatedRoom.history;
      done(room);
    });

    room.socket.on('nextSong', function(song){
      console.log('nextSong', arguments);
      var played = { room: room, song: song, user: song.user };
      history.add(played);
    });

    room.socket.on('userJoined', function(users){
      room.users = users;
    });

    room.socket.on('queue', function(song){
      console.log('queue', arguments);
    });

    return room;
  }
}