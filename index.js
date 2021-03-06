// NPM, add db connection and models
const express = require('express');
const bodyParser = require('body-parser');

// Use?
const slug = require('slug');
// const multer = require('multer');
const assert = require('assert');
// const upload = multer({dest: 'static/upload/'});
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

// Connection
require('dotenv').config();
const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;
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
  app.listen(8000);

  // Login
  app.get('/login', (req, res) => {
    res.render('login');
  });

  app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/test',
    failureRedirect: '/login',
    failureFlash: true,
  }));
 
  // Register account
  app.get('/register', (req, res) => {
    res.render('register');
  });

  // Add account to DB en redirect to login
  app.post('/add', async (req, res) => {
    try {
        const hash = await bcrypt.hashSync(req.body.password, 10);
        const user = new users({
            email: req.body.email,
            username: req.body.username,
            password: hash 
        });
        await user.save() 
          .then(() => {res.redirect('login');});
    } catch {
        res.status(500).send();
    }
  });

  // Show matching accounts
  app.get('/match', async (req, res) => {
    const dataUser = await users.find();
    // console.log(dataUser);
    res.render('match', {data: dataUser});
  });

  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('login');
  })

  // Error 404
  app.get('*', (req, res) => {
    res.status(404).render('not-found.ejs');
  });

  function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }

    res.redirect('/login')
  }
  
  function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/')
    }
    next()
  }
 



 
