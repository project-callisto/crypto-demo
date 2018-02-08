const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const sjcl = require('sjcl');

const app = express();
const DEFAULT_PORT = 8080


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


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

var server = app.listen(process.env.PORT || DEFAULT_PORT, function() {
  console.log('Listening on port %d', server.address().port)
});

// Point static path to dist
app.use(express.static(path.join(__dirname, '/../dist')));

// Catch all other routes and return the index file
// IMPORTANT: this route needs to come last
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/../dist/index.html'));
});


// KEY SERVER
app.post('/postPerpId', function(req,res) {
  var pid = req.body.pid;

  var key = sjcl.codec.utf8String.toBits("Pr0j3cT c@lL!$T0");
  // TODO: switch HMAC out for OPRF
  var prfOut = (new sjcl.misc.hmac(key, sjcl.hash.sha256)).mac(pid);
  var rid = sjcl.codec.hex.fromBits(prfOut)
  console.log('sending random id: ', rid);
  res.send({'rid': rid})
});


// DATABASE
var data = [];

// CALLISTO SERVER
app.post('/postData', function(req, res) {

    var y = req.body.y;
    var x = req.body.x;

    data.push({x: x, y: y});
    if (data.length >= 2) {
        res.send(data);
    } else {
        res.sendStatus(200);
    }
});