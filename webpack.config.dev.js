module.exports = {
  entry: "./src/Index.tsx",
  output: {
    filename: "./dist/bundle.js"
  },

  devtool: "source-map",

  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
	},

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {loader: "ts-loader"}
        ]
      }
    ]
  },
  performance: {
    hints:false
  }
};
