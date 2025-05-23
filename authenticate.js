const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const User = require('./models/user.js');
const config = require('./config.js');

// Local Strategy for username/password authentication
exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// JWT Token Generation
exports.getToken = function(user) {
    return jwt.sign(user, config.secretKey, {expiresIn: 3600});
};

// JWT Strategy Configuration
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(
    new JwtStrategy(
        opts,
        (jwt_payload, done) => {
            console.log('JWT payload:', jwt_payload);

            User.findOne({ _id: jwt_payload._id })
            .then((user) => {
              if (user) {
                return done(null, user);
              } else {
                return done(null, false);
              }
            }).catch((err) => done(err, false));
        }
    )
);

// JWT Authentication Middleware
exports.verifyUser = passport.authenticate('jwt', {session: false});

// Admin verification middleware
exports.verifyAdmin = (req, res, next) => {
    if (req.user.admin) {
        return next();
    } else {
        const err = new Error("You are not authorized to perform this operation!");
        err.status = 403;
        return next(err);
    }
};