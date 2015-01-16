var request = require('supertest');
var app = require('../app.js');

describe('GET /', function() {
  it('should return 200 OK', function(done) {
    request(app)
      .get('/')
      .expect(200, done);
  });
});

describe('GET /add', function() {
  it('should return 200 OK', function(done) {
    request(app)
      .get('/add')
      .expect(200, done);
  });
});

// describe('GET /now', function() {
//   it('should return 200 OK', function(done) {
//     request(app)
//       .get('/now')
//       .expect(200, done);
//   });
// });

// describe('GET /next', function() {
//   it('should return 200 OK', function(done) {
//     request(app)
//       .get('/next')
//       .expect(200, done);
//   });
// });

// describe('GET /upcoming', function() {
//   it('should return 200 OK', function(done) {
//     request(app)
//       .get('/upcoming')
//       .expect(200, done);
//   });
// });

describe('GET /random-url', function() {
  it('should return 404', function(done) {
    request(app)
      .get('/reset')
      .expect(404, done);
  });
});
