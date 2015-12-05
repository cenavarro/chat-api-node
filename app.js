// ================
// Project packages
// ================

var restify = require('restify'),
    Logger = require('bunyan'),
    restifyBunyanLogger = require('restify-bunyan-logger'),
    mongoose = require('mongoose'),
    dotenv = require('dotenv'),
    jwt = require('jsonwebtoken'),
    bcrypt = require('bcrypt');

var server = restify.createServer({
  name: 'Chat API',
  version: '1.0.0',
  log: new Logger.createLogger({
    name: "Chat API"
  })
})

// =============
// Configuration
// =============

dotenv.config({ silent: true });
dotenv.load();

var dbURL = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || process.env.MONGO_URL;
var User = require('./models/user');
var Message = require('./models/message');
var usersController = require('./controllers/usersController')(User);
var sessionsController = require('./controllers/sessionsController')(User);
var messagesController = require('./controllers/messagesController')(Message);
var routesAuthenticator = require('./middlewares/routesAuthenticator');
var chat = require('./lib/chat')(server);

mongoose.connect(dbURL);
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(routesAuthenticator);
server.pre(function (request, response, next) {
  if(process.env.NODE_ENV != 'test'){
    request.log.info({ req: {
      method: request.method,
      url: request.url,
      headers: {
        host: request.headers.host,
        token: request.headers["access-token"]
      }
    }}, 'REQUEST');
  }
  next();
});
chat.start();

// ======
// Routes
// ======
server.post('/api/authenticate', sessionsController.authenticate);
server.get('/api/admin/users', usersController.list);
server.post('/api/admin/users', usersController.create);
server.del('/api/admin/users/:id', usersController.remove);
server.get('/api/messages', messagesController.list);
server.post('/api/setup', usersController.setup);

server.listen(process.env.PORT, function () {
  console.log('%s listening at %s', server.name, server.url);
});

module.exports = server;
