const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 8080

var server = app.listen(PORT, () => {
  console.log('Listening on port %d', server.address().port)
});

app.use(cookieParser());

// app.use('/.application', (req, res, next) => {
//   res.cookie('appType', 'main');
//   res.redirect('/');
//   next();
// });

// app.use('/.storybook', (req, res, next) => {
//   res.cookie('appType', 'storybook');
//   res.redirect('/');
//   next();
// });

app.use((req, res, next) => {
  if (req.cookies.appType === 'storybook') {
    express.static(path.join(__dirname, '/storybook-dist'));
  } else {
    express.static(path.join(__dirname, '/dist'));
  }
  next();
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/dist/index.html'));
  // if (req.cookies.appType === 'storybook') {
  //   return res.sendFile(path.join(__dirname, '/storybook-dist/index.html'));
  // } else {
  //   return res.sendFile(path.join(__dirname, '/dist/index.html'));
  // }
});
