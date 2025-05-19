const express = require('express');
const User = require('../models/user');
const passport = require('passport');
const authenticate = require('../authenticate');

const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.post('/signup', (req, res) => {
    const user = new User({ username: req.body.username });

    User.register(user, req.body.password)
        .then(registeredUser => {
            if (req.body.firstname) {
                registeredUser.firstname = req.body.firstname;
            }
            if (req.body.lastname) {
                registeredUser.lastname = req.body.lastname;
            }
            return registeredUser.save();
        })
        .then(registeredUser => {
            passport.authenticate('local', { session: false })(req, res, () => {
                const token = authenticate.getToken({ _id: registeredUser._id });
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({ success: true, token: token, status: 'Registration Successful!' });
            });
        })
        .catch(err => {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({ err: err });
        });
});

router.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
    const token = authenticate.getToken({ _id: req.user._id });
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({ success: true, token: token, status: 'You are successfully logged in!' });
});

router.get('/logout', (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({ success: true, status: 'Logged out successfully. Please discard your JWT.' });
});

module.exports = router;