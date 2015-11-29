describe('Users Controller', function() {

  afterEach(function(done) {
    User.remove({}, function(){
      done();
    });
  });

  describe("GET #list", function() {
    describe("when non authorized", function() {
      it('returns correct status code', function(done) {
        agent.get('/api/admin/users')
          .expect(403)
          .end(done);
      });
    });

    describe("when authorized", function() {
      it("returns all users", function(done) {
        user = new User({ email: "user@email.com", password: "password" });
        user.save();

        agent.get('/api/admin/users')
          .set('access-token', utils.adminToken)
          .end(function(err, res){
            expect(err).to.not.exist;
            expect(res.statusCode).to.equal(200);
            expect(res.body[0].email).to.equal(user.email);
            done();
          });
      });
    });
  });

  describe("POST #create", function() {
    describe("when attributes are not valid", function() {
      it("returns correct status code", function(done) {
        agent.post('/api/admin/users')
          .set('access-token', utils.adminToken)
          .field("otherField", "value")
          .expect(422)
          .end(done);
      });
    });

    describe("when user exists", function() {
      it("returns correct status code", function(done) {
        user = new User({ email: "user@email.com", password: "password" });
        user.save();

        agent.post('/api/admin/users')
          .set('access-token', utils.adminToken)
          .field("email", user.email)
          .expect(500)
          .end(done);
      });
    });

    describe("when user doesn't exist", function() {
      var newUser = { email: "test@example.com", password: "password" };

      it("returns correct status code", function(done) {
        agent.post('/api/admin/users')
          .set('access-token', utils.adminToken)
          .field('email', newUser.email)
          .field('password', newUser.password)
          .expect(201)
          .end(done);
      });

      it("returns the created user", function(done) {
        agent.post('/api/admin/users')
          .set('access-token', utils.adminToken)
          .field('email', newUser.email)
          .field('password', newUser.password)
          .end(function(err, res) {
            expect(err).to.not.exist;
            expect(res.body.email).to.equal(newUser.email);
            done();
          });
      });
    });
  });

  describe("PUT #update", function() {
    var user;

    beforeEach(function(done) {
      user = new User({ email: "user@email.com", password: "password" });
      user.save();
      done();
    });

    describe("when user exists", function() {
      it("deletes the user", function(done){
        agent.del('/api/admin/users/' + user._id)
          .set('access-token', utils.adminToken)
          .end(function(err, res) {
            User.find({}, function(err, users) {
              expect(res.status).to.equal(200);
              expect(users).to.be.empty;
              done();
            });
          });
      })
    });

    describe("when user doesn't exist", function() {
      it("return correct status code", function(done) {
        agent.del('/api/admin/users/4')
          .set('access-token', utils.adminToken)
          .expect(500)
          .end(done);
      })
    });
  });
});
