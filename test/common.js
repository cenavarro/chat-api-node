global.chai = require('chai');
global.expect = global.chai.expect;
global.utils = require('./utils');
global.request = require('supertest');
global.app = require('../app');
global.agent = request.agent(app);
global.User = require('../models/user');
