// NPM, add db connection and models
const express = require('express');
const bodyParser = require('body-parser');


// IGDB games API // by Deiver
const axios = require('axios');

//bring in socket.io
const socketio = require('socket.io');

// Port to listen
const port = process.env.PORT || 8000;


// Use
const flash = require('express-flash');
const nodemailer = require('nodemailer');
<<<<<<< Updated upstream
=======
const date = require('date-fns');
const axios = require('axios');
const cookieParser = require('cookie-parser');
>>>>>>> Stashed changes

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

// files uploaden // by Deiver
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
const { SSL_OP_NO_TICKET } = require('constants');
DBConnection(mongoose);

const app = express();

// Setting up socket.io
const server = require('http').createServer(app);
const io = socketio(server)

express();

// setup server
server.listen(port);
// EJS
app.set('view engine', 'ejs');
// Express body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// Static > public folder
app.use(express.static('./static/public'));
// output JSON
app.use(express.json());
// cookie-parser for flash messages
app.use(cookieParser());
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

// Mail when challenged user
app.post('/challenge', async (req, res) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL,
        pass: process.env.PASSWOORDMAIL
      }
    });

    const text = "U bent uitgedaagt door " + req.user.username;

    const mailOptions = {
      from: process.env.MAIL,
      to: req.user.email,
      subject: 'U bent uitgedaagt',
      text: text
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    res.redirect('../login');
  } catch(err) {
    console.log(err);
    res.status(500).send();
  }
});

<<<<<<< Updated upstream
  // **DEIVER**
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
});

=======
// Game names
const getData = axios({
  url: "https://api.igdb.com/v4/games",
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Client-ID': process.env.TWITCH_CLIENT_ID,
    'Authorization': process.env.TWITCH_APP_ACCESS_TOKEN,
  },
  data:'fields name, id, cover; where rating > 67 & rating_count > 100 & aggregated_rating > 70 & aggregated_rating_count > 7  & release_dates.date > 1579822403; sort name asc; limit 100;'
})
>>>>>>> Stashed changes


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
<<<<<<< Updated upstream
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
=======
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
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
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
=======
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
>>>>>>> Stashed changes
  } catch(err) {
      console.log(err);
      res.status(500).send();
  }
});

<<<<<<< Updated upstream
 // Display users with same console on one page
app.get('/nintendo' , async (req , res) => {
  const dataNintendo = await users.find({console: 'nintendo'});
  res.render('match', {data: dataNintendo});
});

app.get('/playstation' , async (req , res) => {
  const dataPlaystation = await users.find({console: 'playstation'});
  res.render('match', {data: dataPlaystation});
});

app.get('/xbox' , async (req , res) => {
  const dataXbox = await users.find({console: 'xbox'});
  res.render('match', {data: dataXbox});
=======
// Display users with same console on one page
app.get('/console/:console', async (req, res) => {
  const system = capitalizeFirstLetter(req.params.console)
  const data = await users.find({console: system });
  // const count = results.length;
  // console.log(count);
  const countQuery = users.where({console: system }).countDocuments();
  console.log(countQuery)
  req.flash('info', 'Je filtert op', req.params.console);
  res.render('match', {data});
>>>>>>> Stashed changes
});

app.get('/wii' , async (req , res) => {
  const dataWii = await users.find({console: 'nintendo wii'});
  res.render('match', {data: dataWii});
});

app.get('/switch' , async (req , res) => {
  const dataSwitch = await users.find({console: 'nintendo switch'});
  res.render('match', {data: dataSwitch});
});

app.get('/gamecube' , async (req , res) => {
  const dataGamecube = await users.find({console: 'nintendo game cube'});
  res.render('match', {data: dataGamecube});
});

// // route parameters with matching ids
// app.get('/:id', (req, res) => {
//   console.log(req.params)
// })


// Delete user
app.post('/delete', checkAuthenticated, async (req, res) => {
  try {
<<<<<<< Updated upstream
    const user = await users.findOneAndDelete({ 
      username: req.user.username 
=======
    await users.findOneAndDelete({
      username: req.user.username
>>>>>>> Stashed changes
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



// Socket.io integration
io.on('connection', socket => {
	socket.on('Chat', (msg) => {
		io.emit('message', msg)
	})
});

// Chatpage
app.get('/chat', async (req, res) => {
	const dataUser = await users.find();
	res.render('chat', {data: dataUser});
});

// Error 404
app.get('*', (req, res) => {
	res.status(404).render('not-found.ejs');
});
<<<<<<< Updated upstream
=======

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
>>>>>>> Stashed changes
