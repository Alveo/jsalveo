module.exports = {
  entry: ["./src/index.js"],
  // entry: ["babel-polyfill", "./src/index.js"],
 
  output: {
    path: __dirname + "/dist",
    filename: "jsalveo.bundle.js"
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
    ]
  },
};
