## build.webmaker.org

[![Build Status](https://travis-ci.org/MozillaFoundation/plan.svg?branch=master)](https://travis-ci.org/MozillaFoundation/plan)

Build is a site that we use to track what we are working on now and in the future. It provides a central resource for staff and contributors who are interested in the who, what, and how we build product for Webmaker.

## Getting Started

#### Clone & Install
```bash
git clone git@github.com:MozillaFoundation/plan.git
cd plan
cp env.sample .env
npm install
```

#### Edit .env
* `PLAN_SESSION_SECRET` should be whatever you want it to be.
* `PLAN_GITHUB_CLIENTID` and `PLAN_GITHUB_CLIENTSECRET` should be obtained by creating a new Developer Application in Github (https://github.com/settings/applications). For __Authorization callback URL__, make sure you use `/auth/github/callback` prefixed by the address of the host you use for the app.
* `PLAN_GITHUB_TOKEN` is optional but will help avoid rate limiting, and is a Personal Access Token generated on the same page.

#### Run
Before attempting to start the server, make sure that you have [MongoDB](http://www.mongodb.org/) installed and running. If you have [nodemon](https://github.com/remy/nodemon) installed, you can start the server by running:

```bash
nodemon app.js
```

Otherwise, you can start the server by simply running (note, you will have to restart the process to see changes):
```bash
node app.js
```

Once running you can view the local server by navigating to: 'http://localhost:3000'. If you prefer a different port, you can add a `PORT` variable to `.env`.

## Testing
```bash
npm test
```
