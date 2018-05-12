const express = require('express');
const passport = require('passport');
const router = express.Router();

function handleError(err) {
  console.error(err);
  process.exit(1);
}

// Pin model.
const Pin = require('../models/Pin');

const env = {
  AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
  AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
  AUTH0_CALLBACK_URL: process.env.AUTH0_CALLBACK_URL || 'http://localhost:3000/callback'
};

/* GET home page. */
router.get('/', function(req, res, next) {
  // Search for pins, send then to the view if any exist.
  Pin.find({}, function(err, pins) {
    if (err) {
      return handleError(err);
    }
    if (pins) {
        // Render index with pins.
      res.render('index', { pins: pins });
    }
    else {
      // Render index without pins.
      res.render('index', { pins: [] });
    }
  });
});

router.get('/login', passport.authenticate('auth0', {
    clientID: env.AUTH0_CLIENT_ID,
    domain: env.AUTH0_DOMAIN,
    redirectUri: env.AUTH0_CALLBACK_URL,
    responseType: 'code',
    audience: 'https://' + env.AUTH0_DOMAIN + '/userinfo',
    scope: 'openid profile'
  }),
  function(req, res) {
    res.redirect("/");
  });

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

router.get('/callback',
  passport.authenticate('auth0', {
    failureRedirect: '/failure'
  }),
  function(req, res) {
    res.redirect(req.session.returnTo || '/user');
  }
);

router.get('/failure', function(req, res) {
  var error = req.flash("error");
  var error_description = req.flash("error_description");
  req.logout();
  res.render('failure', {
    error: error[0],
    error_description: error_description[0],
  });
});

/* GET pin. */
router.get('/pin/:pinId', function(req, res) {
  // Assign true if passport session exists.
  const passportSession = req.session.passport;
  // Get pin by id.
  const pinId = req.params.pinId;
  Pin.findOne({ _id: pinId }, function(err, pin) {
    if (err) {
      return handleError(err);
    }
    if (pin) {
      if (passportSession) {
        const username = passportSession.user.displayName;
        res.render('pin', { pin: pin, user: username });
      }
      else {
        res.render('pin', { pin: pin, user: null });
      }
    }
    else {
      res.redirect('/');
    }
  });
});

module.exports = router;
