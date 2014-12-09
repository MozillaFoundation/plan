var habitat = require('habitat');
habitat.load('.env');
habitat.load('config/production.env');
var env = new habitat('plan');

module.exports = {

  db: process.env.MONGOLAB_URI || process.env.MONGODB || 'mongodb://localhost:27017/intake',

  sessionSecret: process.env.SESSION_SECRET || env.get('session_secret'),

  github: {
    clientID: env.get('GITHUB_CLIENTID'),
    clientSecret: env.get('GITHUB_CLIENTSECRET'),
    token: env.get('GITHUB_TOKEN'),
    callbackURL: '/auth/github/callback',
    passReqToCallback: true
  }
};

