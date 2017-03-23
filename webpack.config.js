const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const extractSass = new ExtractTextPlugin({
    filename: "project.scss",
    disable: process.env.NODE_ENV === "development"
});

module.exports = {
  entry: './src/js/project.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build')
  },
  devtool: "cheap-eval-source-map",
  module: {
      rules: [{
        test: /\.scss$/,
        use: extractSass.extract({
            use: [{
                loader: "css-loader"
            }, {
                loader: "sass-loader"
            }],
            // use style-loader in development
            fallback: "style-loader"
        })
      }]
    },
    plugins: [
        extractSass
    ]
};
