const express = require('express');
const app = express();

express();
  app.use(express.static('./static/public'));
  app.set('view engine', 'ejs');
  app.set('views', 'view');
  app.listen(3000)
 
  app.get('/', (req, res) => {
    res.render('index')
});

app.get('/about', (req, res) => {
  res.render('about')
});

app.get('/login', (req, res) => {
  res.render('login')
});

  app.get('*', (req, res) => {
    res.status(404).render('not-found.ejs');
});

// app.get('*', function(req, res) => {
//   res.status(404).send('what???');
// });
 
