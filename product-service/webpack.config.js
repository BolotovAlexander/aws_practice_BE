const path = require('path');

module.exports = {
  mode: 'development', 
  entry: {
    getProductsList: './handlers/getProductsList.js',
    getProductsById: './handlers/getProductsById.js',
  },
  output: {
    filename: '[name].js',
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, '.webpack'),
  },
  target: 'node',
};