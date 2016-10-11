var webpack = require('webpack')

var config = {
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel', exclude: /node_modules/ }
    ]
  },
  output: {
    library: 'ReduxImplicitOAuth2',
    libraryTarget: 'umd'
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV) })
  ]
}

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({ compressor: { warnings: false } })
  )
}

module.exports = config
