var merge = require('merge');

describe('Chat', function() {
  var client1, client2,
      io = require('socket.io-client'),
      options = { transports: ['websocket'], 'force new connection': true },
      optionsClient1 = merge(true, options, { query: { token: utils.adminToken } }),
      optionsClient2 = merge(true, options, { query: { token: utils.userToken("user@example.com") } });

  afterEach(function(done) {
    if(client1) client1.disconnect();
    if(client2) client2.disconnect();
    done();
  });

  describe("when user token is not valid", function() {
    it("notifies the correct error", function(done) {
      badTokenOption = merge(true, options, { query: { token: 'invalid' } });
      client1 = io(serverPath, badTokenOption)

      client1.on('error', function(error){
        expect(error).not.to.be.null;
        done();
      });
    });
  });

  describe("when user token is valid", function() {
    it("broadcasts new user connection", function (done) {
      client1 = io(serverPath, optionsClient1),

      client1.on('user connected', function(username) {
        expect(username).to.equal("user1");
        done();
      });

      client2 = io(serverPath, optionsClient2);
    });

    it("emits chat messages to all users", function (done) {
      client1 = io(serverPath, optionsClient1);

      client1.on('chat message', function(message) {
        expect(message).to.equal("New chat message");
        done();
      });

      client2 = io(serverPath, optionsClient2);
      client2.emit("chat message", "New chat message");
    });

    it("notifies when user is disconnected", function(done) {
      client1 = io(serverPath, optionsClient1);
      client2 = io(serverPath, optionsClient2);

      client1.on('user disconnected', function(username) {
        expect(username).to.equal("user1");
        done();
      });

      client2.disconnect();
    });
  });
});
