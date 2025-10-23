const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true,
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true,
    port: 3000,
    open: false,
    hot: true,
    host: '0.0.0.0', // Allow external connections
    allowedHosts: 'all', // Allow all hosts (including through nginx proxy)
    historyApiFallback: {
      // Send all requests to index.html for SPA routing
      index: '/index.html'
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
  mode: 'development',
};