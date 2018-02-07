const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');

const sjcl = require('sjcl');



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(__dirname))

var server = app.listen(8080, function() {
    console.log('Listening on port %d', server.address().port)
});

app.get('/', function(req,res) {
    res.sendFile((path.join(__dirname + '/index.html')));
});

app.post('/postPID', function(req,res) {
    var pid = req.body.pid;

    var key = sjcl.codec.utf8String.toBits("Pr0j3cT c@lL!$T0");
    // TODO: switch HMAC out for OPRF
    var out = (new sjcl.misc.hmac(key, sjcl.hash.sha256)).mac(pid);
    var rid = sjcl.codec.hex.fromBits(out)
    console.log('sending random id: ', rid);
    res.send({'rid': rid});
});


var data = [];

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
