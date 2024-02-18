const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  mode: "development",
  entry: path.resolve(__dirname, 'src', 'index.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.[contenthash].js'
  },
  plugins: [
    new ESLintPlugin({
      fix: true,
    }),
    new MiniCssExtractPlugin({
        filename: '[name].bundle.css',
        chunkFilename: '[id].css'
    }),
    new webpack.HotModuleReplacementPlugin({
    // Options...
    }),
    new HtmlWebpackPlugin({
      template: "public/index.html",
      filename: "index.html"
    })
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true,
    open: true,
    hot: true,
    client: {
      logging: 'info'
    },
    port: 9000
  },
  module: {
    rules: [
      {
        test: /\.(jsx|js)$/,
        include: path.resolve(__dirname, 'src'),
        exclude: /node_modules/,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                "targets": "defaults" 
              }],
              '@babel/preset-react'
            ]
            
          }
        }]
      },
      {
          test: /\.css$/i,
          include: path.resolve(__dirname, 'src'),
          exclude: /node_modules/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1 
              }
            },
            'postcss-loader'
          ]
        }

    ]
  }
}
