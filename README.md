# plan.webmaker.org

The site we're using to track initiatives. Live at http://mofo-intake.herokuapp.com/

## Setup

* `git clone git@github.com:MozillaFoundation/plan.git`
* `cd plan`
* `cp env.sample .env`
* `npm install`

Edit .env to have real secrets.  `PLAN_SESSION_SECRET` should be whatever you want it to be.
`PLAN_GITHUB_CLIENTID` and `PLAN_GITHUB_CLIENTSECRET` you should obtain by creating a new Developer Application in Github (https://github.com/settings/applications).  `PLAN_GITHUB_TOKEN` is optional but will help avoid rate limiting, and is a Personal Access Token generated on the same page.

I like to run the server using `nodemon app.js` (as it will do autoreload).  It runs by default on port `3000`
