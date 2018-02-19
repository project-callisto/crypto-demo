const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const sjcl = require('sjcl');

const app = express();
const DEFAULT_PORT = 8080

// TODO: change this 
const sK = 'Project Callisto Super Secret Key';


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


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

var server = app.listen(process.env.PORT || DEFAULT_PORT, function() {
  console.log('Listening on port %d', server.address().port)
});

// Point static path to dist
app.use(express.static(path.join(__dirname, '/../dist')));



// KEY SERVER
app.post('/postPerpId', function(req,res) {
  var pid = req.body.pid;

  let sodium_promise = sodium.ready;
  
  sodium_promise.then(function() {
    // TODO: choose adequately safe key that is static
    
    // current substitute for OPRF
    var rid = sodium.crypto_hash(pid+sK).toString();

    res.send({rid});
  });
});


// DATABASE
var encryptedSubmissions = [];

// CALLISTO SERVER

// Receiving a EncryptedData object
app.post('/postData', function(req, res) {
  
  var encryptedSubmission = {
    hashedRid: req.body.hashedRid,
    encryptedRecordKey: req.body.encryptedRecordKey,
    encryptedRecord: req.body.encryptedRecord,
    userPubKey: req.body.userPubKey,
    cX: req.body.cX,
    cY: req.body.cY,
    kId: req.body.kId
  }

  console.log('received new encryptedSubmission: ', encryptedSubmission);

  encryptedSubmissions.push(encryptedSubmission);
  res.sendStatus(200);
});

// TODO: move this to client side
app.get('/getEncryptedData', function (req, res) {
  console.log('received data request. returning: ', encryptedSubmissions)
  // TODO: check that rid's match 
  res.send(encryptedSubmissions);

  // clearing submissions for demo
  encryptedSubmissions = [];
});


// Catch all other routes and return the index file
// IMPORTANT: this route needs to come last
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/../dist/index.html'));
});
