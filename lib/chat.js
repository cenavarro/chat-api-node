var socketio = require('socket.io'),
    socketioJwt = require("socketio-jwt");

var Chat = function(server) {
  var io = socketio.listen(server.server);

  var start = function() {
    io.use(socketioJwt.authorize({
      secret: process.env.TOKEN_SECRET,
      handshake: true
    }));

    io.on('connection', function(socket) {
      socket.broadcast.emit('user connected', socket.decoded_token.username);

      socket.on('chat message', function(msg){
        io.emit('chat message', msg);
      });

      socket.on('disconnect', function(){
        socket.broadcast.emit('user disconnected', socket.decoded_token.username);
      });
    });
  };

  return {
    start: start
  };
};

module.exports = Chat;
