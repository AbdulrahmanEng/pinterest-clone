const express = require('express');
const passport = require('passport');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
const router = express.Router();

function handleError(err) {
  console.error(err);
  process.exit(1);
}

// User model.
const User = require('../models/User');
// Pin model.
const Pin = require('../models/Pin');

/* GET user profile. */
router.get('/', ensureLoggedIn, function(req, res, next) {
  // Get username from Auth0 session object.
  const username = req.user.displayName;
  // If user is not in the database — save user to the database then render /user view.
  User.findOne({ username: username }, function(err, user) {
    if (err) {
      return handleError(err);
    }
    else {
      // If the user exists render the /user view.
      if (user) {
        // Merge session user object with MongoDB user doc.
        const userData = Object.assign(req.user, user);
        // Render view with userData.
        res.render('user', {
          user: userData
        });
      }
      else {
        // Save user to the database and render /user view.
        const user = {
          username: username,
          pins: []
        };

        // Save the user to the database.
        User.create(user, function(err, newDoc) {
          if (err) {
            return handleError(err);
          }
          // New user.
          const newUser = newDoc;
          // Merge session user object with MongoDB user doc.
          const userData = Object.assign(req.user, newUser);
          // Render view with merged data.
          res.render('user', {
            user: userData
          });
        });
      }
    }
  });
});

/* GET user/:username profile. */
router.get('/:username', function(req, res) {
  User.findOne({ username: req.params.username }, function(err, user) {
    if (err) {
      return handleError(err);
    }
    if (user) {
      // Get session username.
      const sessionUsername = req.session.passport?req.session.passport.user.displayName:null;
      // Get pins.
      Pin.find({ createdBy: user.username }, function(err, pins) {
        if (err) {
          return handleError(err);
        }
        // Merge user doc with pin search result.
        const userData = Object.assign(user, { pins: pins });
        
        // Render profile.
        res.render('profile', { user: userData, sessionUser: sessionUsername });
      });
    }
    else {
      res.send('User does not exist.');
    }
  });
});

module.exports = router;
