module.exports = {
  entry: "./js/app.js",
  output: {
    filename: "public/bundle.js"
  },
  module: {
    loaders: [
      {test: /\.js$/, loader: 'jsx-loader'}
    ]
  },
  node: {
    fs: "empty"
  }
};