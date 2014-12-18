var Habitat = require('habitat');
Habitat.load('.env');
Habitat.load('config/production.env');

var env = new Habitat('plan');

module.exports = {
  sessionSecret: process.env.SESSION_SECRET || env.get('session_secret'),

  github: {
    clientID: env.get('GITHUB_CLIENTID'),
    clientSecret: env.get('GITHUB_CLIENTSECRET'),
    token: env.get('GITHUB_TOKEN'),
    host: env.get('GITHUB_HOST') || 'https://build.webmaker.org',
    callbackURL: '/auth/github/callback',
    passReqToCallback: true
  }
};
