// NPM, add db connection and models
const express = require('express');
const bodyParser = require('body-parser');

// Use
const flash = require('express-flash');

// Models
const users = require('./models/users.js');

// Security
const bcrypt = require('bcrypt');
const passport = require('passport');
const session = require('express-session');
const initializePassport = require('./passport-config')
initializePassport(
  passport,
  username => users.find(user => user.username === username),
  id => users.find(user => user.id === id)
);
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  next();
}

// Connection
require('dotenv').config();
const mongoose = require('mongoose');
const DBConnection = require('./connection.js');
DBConnection(mongoose);

const app = express();

express();
  // EJS
  app.set('view engine', 'ejs');
  // Express body parser
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));
  // Static > public folder
  app.use(express.static('./static/public'));
  // output JSON
  app.use(express.json());
  // View map
  app.set('views', 'view');
  // Security
  app.use(flash())
  app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  }));
  app.use(passport.initialize());
  app.use(passport.session());
   // Port to listen
  const port = process.env.PORT || 8000;
  app.listen(port);
  // app.listen(8000);

  // Show matching accounts
  app.get('/', checkAuthenticated, async (req, res) => {
    const dataUser = await users.find();
    res.render('match', {data: dataUser});
  });

  // Login
  app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login');
  });

  app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
  }));

  // Register account
  app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register');
  });

  // Add account to DB en redirect to login
  app.post('/add', checkNotAuthenticated, async (req, res) => {
    try {
        const hash = await bcrypt.hashSync(req.body.password, 10);
        const user = new users({
            email: req.body.email,
            username: req.body.username,
            console: req.body.console,
            game: req.body.game,
            tell: req.body.tell,
            info: req.body.info,
            password: hash
        });
        await user.save()
          .then(() => {res.redirect('login');});
    } catch(err) {
        console.log(err);
        res.status(500).send();
    }
  });

   // Register account
   app.get('/account', checkAuthenticated, (req, res) => {
    res.render('account');
  });

  // Add account to DB en redirect to login
  app.post('/update', checkAuthenticated, async (req, res) => {
    try {
        const filter = { username: req.user.username };
        const hash = await bcrypt.hashSync(req.body.password, 10);
        let user = await users.findOne({
          username: req.user.username
        });
        await users.updateOne(filter, {
          password: hash
        });
        await user.save()
          .then(() => {res.redirect('account');});
    } catch(err) {
        console.log(err);
        res.status(500).send();
    }
  });

  // Display users with console nintendo on one page
app.get('/nintendo' , async (req , res) => {
  const dataNintendo = await users.find({console: 'nintendo'});
  res.render('match', {data: dataNintendo});
});




  // Delete user
  app.post('/delete', checkAuthenticated, async (req, res) => {
    try {
      const user = await users.findOneAndDelete({
        username: req.user.username
      }).exec();
      res.redirect('login');
    } catch(err) {
      console.log(err);
      res.status(500).send();
    }
  });

  // Logout
  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('login');
  })

  // Error 404
  app.get('*', (req, res) => {
    res.status(404).render('not-found.ejs');
  });
