const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const sjcl = require('sjcl');

const app = express();
const DEFAULT_PORT = 8080


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


const sodium = require('libsodium-wrappers');



//   await _sodium.ready;
//   const sodium = _sodium;
// })();

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

  let sodium_promise = sodium.ready;
  
  sodium_promise.then(function() {
    var sK = sodium.crypto_secretbox_keygen().toString();

    // current substitute for OPRF
    var rid = sodium.crypto_hash(pid+sK).toString();

    res.send({rid});
  });

  

  // var key = sjcl.codec.utf8String.toBits("Pr0j3cT c@lL!$T0");
  // TODO: switch HMAC out for OPRF
  // var prfOut = (new sjcl.misc.hmac(key, sjcl.hash.sha256)).mac(pid);
  // var rid = sjcl.codec.hex.fromBits(prfOut)
  // console.log('sending random id: ', rid);
 
});



// DATABASE
var data = [];

// CALLISTO SERVER
app.post('/postData', function(req, res) {

  console.log(req.body);

  var submission = {
    x: req.body.x,
    y: req.body.y,
    hashedPerpId: req.body.hashedPerpId,
    encryptedRecordKey: req.body.encryptedRecordKey,
    encryptedRecord: req.body.encryptedRecord,
    userPubKey: req.body.userPubKey
  }
  console.log('received new submission: ', submission);

  data.push(submission);

  if (data.length >= 2) {
      res.send(data);
      // NOTE: counting 2 submissions as a session
      data = [];
  } else {
      res.sendStatus(200);
  }
});
