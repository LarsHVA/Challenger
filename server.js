// NPM, add db connection and models
const express = require('express');
const bodyParser = require('body-parser');

// IGDB games API
const igdb = require('igdb-api-node').default;

const apicalypse = require('apicalypse');

const axios = require('axios');



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
///{ DEIVER }///
const multer = require("multer");

//Hieronder wordt de storage gedefineerd en hoe de naam moet worden gegenereerd
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "./static/public/uploads/");
	},
	filename: function (req, file, cb) {
		cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname);
	},
});

// Met deze variable kan multer gebruiken om de geuploade bestanden een bepaalde naam moet krijgen.
const upload = multer({ storage: storage });

///{ END }///

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
  app.use( express.static('./static/public/'));
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

  // **DEIVER**

  // const client = igdb(process.env.TWITCH_CLIENT_ID, process.env.TWITCH_APP_ACCESS_TOKEN)
  ///GAME NAMES///
  const getData = axios({
    url: "https://api.igdb.com/v4/games",
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Client-ID': process.env.TWITCH_CLIENT_ID,
        'Authorization': process.env.TWITCH_APP_ACCESS_TOKEN,
    },

    data:'fields name, id; where rating > 70 & rating_count > 100 & aggregated_rating > 70 & aggregated_rating_count > 7  & release_dates.date > 1269387203; sort name asc; limit 100;' //1553384003
    
  })

app.get('/games', (req,res)=> {

  // res.send('hello');
    getData
    .then(response => {
        console.log(response.data);
        res.send(response.data);
    })
    .catch(err => {
        console.error(err);
    });

    /// GAME COVERS ///
    // axios({
    //   url: "https://api.igdb.com/v4/covers",
    //   method: 'POST',
    //   headers: {
    //       'Accept': 'application/json',
    //       'Client-ID': process.env.TWITCH_CLIENT_ID,
    //       'Authorization': process.env.TWITCH_APP_ACCESS_TOKEN,
    //   },
    //   // data: "fields age_ratings,aggregated_rating,aggregated_rating_count,alternative_names,artworks,bundles,category,checksum,collection,cover,created_at,dlcs,expanded_games,expansions,external_games,first_release_date,follows,forks,franchise,franchises,game_engines,game_modes,genres,hypes,involved_companies,keywords,multiplayer_modes,name,parent_game,platforms,player_perspectives,ports,rating,rating_count,release_dates,remakes,remasters,screenshots,similar_games,slug,standalone_expansions,status,storyline,summary,tags,themes,total_rating,total_rating_count,updated_at,url,version_parent,version_title,videos,websites;"
    //   data: "fields height, image_id , url , width; limit 5;"
    // })
    //   .then(responseImages => {
    //       console.log(responseImages.data);
    //       res.send(responseImages.data);
    //   })
    //   .catch(err => {
    //       console.error(err);
    //   });


});



// **DEIVER**


  // Register account
  app.get('/register', checkNotAuthenticated, (req, res) => {
    // **DEIVER**
    getData
    .then(igDb => {
      let igdbData = igDb.data;
      res.render('register', {gameNames: igdbData});
    })
    .catch(err => {
        console.error(err);
    });
    // **DEIVER**
  });

  // Add account to DB en redirect to login
  app.post('/add', checkNotAuthenticated, upload.single("gamerAva"), async (req, res) => {
    try {
        const hash = await bcrypt.hashSync(req.body.password, 10);
        const user = new users({
            //file-upload by Deiver
            storedAvaGamer: './uploads/' + req.file.filename,
            email: req.body.email,
            username: req.body.username,
            console: req.body.console,
            game: req.body.game,
            tell: req.body.tell,
            info: req.body.info,
            password: hash 
        });
        await user.save() 
          .then(() => {
            res.redirect('login');
          });
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