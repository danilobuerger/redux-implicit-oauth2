var webpack = require('webpack')

var config = {
  externals: {
    'react': {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react'
    },
    'redux': {
      root: 'Redux',
      commonjs2: 'redux',
      commonjs: 'redux',
      amd: 'redux'
    },
    'react-redux': {
      root: 'ReactRedux',
      commonjs2: 'react-redux',
      commonjs: 'react-redux',
      amd: 'react-redux'
    }
  },
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
