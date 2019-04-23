const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base.config.js');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = merge(webpackBaseConfig, {
  // eval-source-map is faster for development
  // devtool: '#source-map',
  devtool: '#eval-source-map',
  output: {
    publicPath: '/',
    filename: '[name].js',
    chunkFilename: '[name].chunk.js'
  },
  devServer: {
    historyApiFallback: true,
    contentBase: './src',
    host: '0.0.0.0',
    port: 8812,
    hot: true,
    open: false,
    overlay: {
      warnings: true,
      errors: true
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      __DEV__: true
    }),
    new ExtractTextPlugin({
      filename: '[name].css',
      allChunks: true
    }),
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'vendors',
    //   minChunks: Infinity,
    // }),
    new HtmlWebpackPlugin({
      template: './src/index.ejs',
      href: '/',
      inject: true,
      favicon: './src/images/favicon.png'
    }),
    new webpack.HotModuleReplacementPlugin(),
    // new BundleAnalyzerPlugin({
    //   openAnalyzer: false,
    //   analyzerPort: 8822
    // }),
  ]
})
