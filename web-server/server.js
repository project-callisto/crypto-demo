const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');

const app = express();
const DEFAULT_PORT = 8080

// TODO: change this 
const sK = 'Project Callisto Super Secret Key';


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const sodium = require('libsodium-wrappers');


// automatically run webpack, unless running on production
if (process.env.NODE_ENV !== 'production') {
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');

  const config = require(path.join(__dirname, 'webpack.config.js'))();
  const compiler = webpack(config);

  app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath
  }));
}

app.listen(process.env.PORT || DEFAULT_PORT, function () {
  console.log('Listening on port %d', this.address().port)
});

// KEY SERVER
app.post('/postPerpId', function(req,res) {

  let perpId = req.body.perpId;
  let sodium_promise = sodium.ready;

  sodium_promise.then(function() {
    var rid = sodium.to_base64(sodium.crypto_hash(perpId+sK));

    res.send({rid});
    console.log('sent rid: ', rid);
  });
});

// Point static path to dist
app.use(express.static(path.join(__dirname, '/../dist')));

// Catch all other routes and return the index file
// IMPORTANT: this route needs to come last
const server = app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/../dist/index.html'));
});
