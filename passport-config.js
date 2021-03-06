const LocalStrategy = require('passport-local').Strategy
const bcrypt = require ('bcrypt');
const mongoose = require ('mongoose');
const passport = require ('passport');
const users = require ('./models/users.js');

module.exports = (passport) => {
    passport.use(
        new LocalStrategy({ usernameField: 'username'}, (username, password, done) => {
        users.findOne({ username: username}).then(users => {
            bcrypt.compare(password, users.password, (err, isMatch) => {
                if (isMatch) {return done(null, users);}
            });
        }).catch(err => console.log(err));
    }));
}

passport.serializeUser((users, done) => {done(null, users.id);});

passport.deserializeUser((id, done) => {
  users.findById(id, (err, users) => {
    done(err, users);
  });
});