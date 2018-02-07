var path = require('path');
var angularClient = path.join(__dirname, '/../angular-client/main.ts');

module.exports = {
  entry: {
    angularClient: [angularClient]
  },
  output: {
    filename: "[name].js",
    path: path.join(__dirname, '/../dist')
  },
  watch: true,
};
