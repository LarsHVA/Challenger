// NPM, add db connection and models
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// Port to listen
const port = process.env.PORT || 8000;

// Connection
require('dotenv').config();
const mongoose = require('mongoose');
const DBConnection = require('./connection.js');
const {
  SSL_OP_NO_TICKET
} = require('constants');
DBConnection(mongoose);

// Models
const users = require('./models/users.js');

// Use
const flash = require('express-flash');
const nodemailer = require('nodemailer');
const date = require('date-fns');
const axios = require('axios');

// Packages for chatting
const socketio = require('socket.io');
// const Redis = require('ioredis');
// const redisClient = new Redis();

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

// files uploaden
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./static/public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname);
  },
});
// Geuploade bestanden naam toekennen.
const upload = multer({
  storage: storage
});

// Setting up socket.io
const server = require('http').createServer(app);
const io = socketio(server);
// , {
//   adapter: require('socket.io-redis')({
//     pubClient: redisClient,
//     subClient: redisClient.duplicate()
//   })
// })

express();

// setup server
server.listen(port);
// EJS
app.set('view engine', 'ejs');
// Express body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
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
app.use('*', saveLocal);
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
      to: req.body.email,
      subject: 'U bent uitgedaagt',
      text: text
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    res.render('challenge');

  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

// Games data
const getData = axios({
  url: "https://api.igdb.com/v4/games",
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Client-ID': process.env.TWITCH_CLIENT_ID,
    'Authorization': process.env.TWITCH_APP_ACCESS_TOKEN,
  },
  data: 'fields name, id, cover.url; where rating > 67 & rating_count > 100 & aggregated_rating > 70 & aggregated_rating_count > 7  & release_dates.date > 1579822403; sort name asc; limit 100;'
})

app.get('/games', (req, res) => {
  getData
    .then(response => {
      res.send({
        gameNames: response.data
      });
    })
    .catch(err => {
      console.error(err);
    });
});

// Register account
app.get('/register', checkNotAuthenticated, (req, res) => {
  // **DEIVER**
  getData
    .then(igDb => {
      let igdbData = igDb.data;
      res.render('register', {
        gameNames: igdbData
      });
    })
    .catch(err => {
      console.error(err);
    });
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
      gameName: req.body.gameName,
      info: req.body.info,
      password: hash
    });
    await user.save()
      .then(() => {
        res.redirect('login');
      });
  } catch (err) {
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
    const filter = {
      username: req.user.username
    };
    const hash = await bcrypt.hashSync(req.body.password, 10);
    let user = await users.findOne({
      username: req.user.username
    });
    await users.updateOne(filter, {
      password: hash
    });
    await user.save()
      .then(() => {
        res.redirect('account');
      });
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

// Display users with same console on one page and show filter results
app.get('/console/:console', async (req, res) => {
  const system = capitalizeFirstLetter(req.params.console)
  const data = await users.find({
    console: system
  });
  req.flash('info', 'Je filtert op', req.params.console);
  res.render('match', {
    data
  });

});

// Delete user
app.post('/delete', checkAuthenticated, async (req, res) => {
  try {
    await users.findOneAndDelete({
      username: req.user.username
    }).exec();
    res.redirect('login');
  } catch (err) {
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
    io.emit('message', formatMsg('user', msg))
  })
});

// Save logged in user to session
function saveLocal(req, res, next) {
  res.locals.user = req.user || null;
  next();
}

// Chatpage
app.get('/:username/chat', checkAuthenticated, async (req, res) => {
  const dataUser = await users.find({
    _id: {
      $nin: res.locals.user.id
    }
  });
  res.render('chat', {
    data: dataUser
  });
});

function formatMsg(username, message) {
  return {
    username: username,
    message: message,
    time: date.format(new Date(), "kk:mm")
  }
}

// Error 404 **
app.get('*', (req, res) => {
  res.status(404).render('not-found.ejs');
});

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
