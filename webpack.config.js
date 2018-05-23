module.exports = {
  entry: "./src/index.js",
  externals: /^[^.]/,
  target: "node",
  output: {
      path: __dirname + "/dist",
      filename: "bundle.js"
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"}
    ]
  },
  node: {crypto: true, stream: true, fs: 'empty', net: 'empty', tls: 'empty'}
};
