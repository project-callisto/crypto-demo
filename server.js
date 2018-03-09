const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080

var server = app.listen(PORT, () => {
  console.log('Listening on port %d', server.address().port)
});

// Point static path to dist
app.use(express.static(path.join(__dirname, '/dist')));

// Catch all other routes and return the index file
// IMPORTANT: this route needs to come last
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/dist/index.html'));
});
