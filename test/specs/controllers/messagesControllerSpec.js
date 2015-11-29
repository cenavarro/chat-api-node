describe('Messages Controller', function() {
  afterEach(function(done) {
    Message.remove({}, function(){
      done();
    });
  });

  describe("GET #list", function() {
    var sender;

    beforeEach(function(done) {
      sender = new User({ email: "user@email.com", password: "password" });
      done();
    });

    describe("when non authorized", function() {
      it('returns correct status code', function(done) {
        agent.get('/api/messages')
          .expect(403)
          .end(done);
      });
    });

    describe("when authorized", function() {
      it("returns all messages", function(done) {
        message = new Message({ content: "Just a content", sender_id: sender._id });
        message.save();

        agent.get('/api/messages')
          .set('access-token', utils.adminToken)
          .end(function(err, res){
            expect(err).to.not.exist;
            expect(res.statusCode).to.equal(200);
            expect(res.body[0].content).to.equal("Just a content");
            expect(res.body[0].sender_id).to.equal(sender._id.toString());
            done();
          });
      });
    });
  });
});

