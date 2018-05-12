const express = require('express');
const passport = require('passport');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
const router = express.Router();
const sanitize = require('js-string-escape');


function handleError(err) {
  console.error(err);
  process.exit(1);
}

// Pin model.
const Pin = require('../models/Pin');

/* GET pins. */
router.get('/', function(req, res, next) {
  //   Returns all the pins.
  Pin.find({}, function(err, pins) {
    if (err) {
      return handleError(err);
    }
    else {
      res.json({ data: pins });
    }
  });
});

/* POST pin. */
router.post('/new', ensureLoggedIn, function(req, res) {
  // Get username.
  const username = req.user.displayName;
  if (username) {
    // Create pin.
    const pin = {
      imageUrl: sanitize(req.body.url),
      createdBy: username,
      website: sanitize(req.body.website),
      description: sanitize(req.body.description)
    };
    // Save pin to the pins.
    Pin.create(pin, function(err, newDoc) {
      if (err) {
        return handleError(err);
      }
      // Redirect to /user/:username.
      res.redirect('/user/' + username);
    });
  }
  else {
    // Redirect to user.
    res.redirect('/user');
  }
});

/* DELETE pin. */
router.get('/:pinId/delete', ensureLoggedIn, function(req, res) {
  // Get username.
  const pinId = req.params.pinId;
  Pin.remove({ _id: pinId }, function(err) {
    if (err) {
      return handleError(err);
    }
    res.redirect('/user/' + req.user.displayName);
  });
});

/* UPDATE pin */
router.get('/:pinId/update', ensureLoggedIn, function(req, res) {
  Pin.findOne({ _id: req.params.pinId }, function(err, pin) {
    if (err) {
      return handleError(err);
    }
    res.render('update', { pin: pin });
  });
});

/* POST pin. */
router.post('/update', ensureLoggedIn, function(req, res) {
  // Get username.
  const id = sanitize(req.body.id);
  // Sanitize values.
  const pin = {
    imageUrl: sanitize(req.body.url),
    website: sanitize(req.body.website),
    description: sanitize(req.body.description),
  };
  // Update pin.
  Pin.update({ _id: id }, { $set: pin }, function(err) {
    if (err) {
      return handleError(err);
    }
    res.redirect('/user/' + req.user.displayName);
  });
});
module.exports = router;