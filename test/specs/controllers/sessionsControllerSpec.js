describe('Sessions Controller', function() {
  describe("POST #authenticate", function() {

    describe("when user doesn't exist", function() {
      it("returns correct status code", function(done) {
        agent.post('/api/authenticate')
          .field('email', "user@example.com")
          .field('password', "password")
          .expect(500)
          .end(done);
      });
    });

    describe("when user exists", function() {
      var user;

      beforeEach(function(done) {
        user = new User({ email: "user@email.com", password: utils.generatePassword("password") });
        user.save();
        done();
      });

      describe("when email and password doesn't match", function() {
        it("returns correct status code", function(done) {
          agent.post('/api/authenticate')
            .field('email', "user@email.com")
            .field('password', "password1")
            .expect(500)
            .end(done);
        });
      });

      describe("when email and password matches", function() {
        it("returns correct status code", function(done) {
          agent.post('/api/authenticate')
            .field('email', "user@email.com")
            .field('password', "password")
            .expect(200)
            .end(done);
        });

        it("returns session token", function(done) {
          agent.post('/api/authenticate')
            .field('email', "user@email.com")
            .field('password', "password")
            .end(function(err, res) {
              expect(res.body.token).to.not.be.empty;
              done();
            });
        });
      });
    })
  });
});
