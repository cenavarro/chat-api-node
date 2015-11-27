process.env.NODE_ENV = 'test';
process.env.TEST_ENV = 'test';
process.env.MONGO_URL = 'mongodb://localhost/chatAPI_test';
process.env.PORT = 5001;
process.env.TOKEN_SECRET = "testtoken";

var exit = process.exit;

process.exit = function (code) {
  setTimeout(function () {
    exit();
  }, 200);
};

require('../node_modules/mocha/bin/_mocha');
