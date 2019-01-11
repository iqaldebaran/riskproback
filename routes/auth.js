require('dotenv').config();


var passport = require('passport');
var User = require('../models/User');
// var config = require('./auth');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
// var LocalStrategy = require('passport-local').Strategy;

// var localOptions = {
//     usernameField: 'email'
// };

// var localLogin = new LocalStrategy(localOptions, function(email, password, done) {

//     User.findOne({
//         email: email
//     }, function(err, user) {
//         if (err) {
//             return done(err);
//         }
//         if (!user) {
//             return done(null, false, { error: 'Login failed. Please try again' });
//         }

//         user.comparePassword(password, function(err, isMatch) {
//             if (err) {
//                 return done(err);
//             }
//             if (!isMatch) {
//                 return done(null, false, { error: 'Login Failed. Please try again.' });
//             }

//             user.status = 'online';
//             user.save(function(err, user) {
//                 if (err) {
//                     return done(err);
//                 }
//             });

//             return done(null, user);
//         });
//     });
// });

var jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
    secretOrKey: process.env.SECRETORKEY
};


var jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
    // console.log(payload);
    User.findOne(payload._id, function(err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
             done(null, user)
        } else {
            done(null, false);
        }
    });
});

// passport.use(localLogin);
passport.use(jwtLogin);

module.exports = {
    initialize: () => passport.initialize(),
    authenticateJWT: passport.authenticate('jwt', { session: false }),
    // authenticateCredentials: passport.authenticate('local', { session: false }),
};
