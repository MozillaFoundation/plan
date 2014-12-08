var habitat = require('habitat');
habitat.load('.env');
habitat.load('config/production.env');
var env = new habitat('plan');

module.exports = {

  db: process.env.MONGOLAB_URI || process.env.MONGODB || 'mongodb://localhost:27017/intake',

  sessionSecret: process.env.SESSION_SECRET || env.get('session_secret'),

  github: {
    clientID: process.env.GITHUB_ID || env.get('GITHUB_CLIENTID'),
    clientSecret: process.env.GITHUB_SECRET || env.get('GITHUB_CLIENTSECRET'),
    callbackURL: '/auth/github/callback',
    passReqToCallback: true
  }
};

