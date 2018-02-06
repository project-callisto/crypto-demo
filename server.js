const express = require('express');
const app = express();
const path = require('path');
const http = require('http');

var server = app.listen(8080, function() {
    console.log('Listening on port %d', server.address().port)
});

app.get('/', function(req,res) {
    res.sendFile((path.join(__dirname, 'dist/index.html')));
});
