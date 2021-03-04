// NPM, add db connection and models
const express = require('express');
const slug = require('slug');
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer({dest: 'static/upload/'});
const mongoose = require('mongoose');
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const users = require('./models/users.js');
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
  // Port to listen
  app.listen(8000);

  // Login
  app.get('/login', (req, res) => {
    res.render('login');
  });

  // Login check and redirect
  app.post('/login', async (req, res) => {
    const userLogin = await users.findOne({
      email: req.body.email
    });
    if (!userLogin) 
      return res.status(400).send('Email not found');
    const userPassword = await users.findOne({
      password: req.body.password
    });
    if (!userPassword) 
      return res.status(400).send('Password not correct');
    res.redirect('test');
  });

  // Register account
  app.get('/register', (req, res) => {
    res.render('register');
  });

  // Add account to DB en redirect to login
  app.post('/add', async (req, res) => {
    try {
        const user = new users({
            email: req.body.email,
            username: req.body.username,
            password: req.body.password
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

  // Error 404
  app.get('*', (req, res) => {
    res.status(404).render('not-found.ejs');
  });
 



 
