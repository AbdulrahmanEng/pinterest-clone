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

/* GET user profile. */
router.get('/', ensureLoggedIn, function(req, res, next) {
  // Get username from Auth0 session object.
  const username = req.user.displayName;
  // If user is not in the database — save user to the database then render /user view.
  User.find({ username: username }, function(err, docs) {
    if (err) {
      return handleError(err);
    }
    else {
      // Assign match.
      const dbUser = docs[0];
      // If the user exists render the /user view.
      if (dbUser) {
        // Merge session user object with MongoDB user doc.
        const userData = Object.assign(req.user, dbUser);
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
  res.send('show user pins');
});

module.exports = router;
