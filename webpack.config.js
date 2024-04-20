const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const webpack = require('webpack');

const is_prod = process.env.NODE_ENV == "production";

// console.log("the value of process.env.NODE_ENV is: " , process.env.NODE_ENV)

const babelOpts = {
  presets: [
    ['@babel/preset-env', {
      "targets": "defaults" 
    }],
    '@babel/preset-react'
  ]
};

module.exports = {
  mode: "development",
  devtool: "cheap-module-source-map",
  entry: path.resolve(__dirname, 'src', 'index'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.[contenthash].js'
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
    alias: {
      "@assets": path.resolve(__dirname, 'assets')
    }
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
    }),
    ...(is_prod ? [new CompressionPlugin({
      test: /\.js(\?.*)?$/i,
    })] : [])
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true,
    open: true,
    hot: true,
    client: {
      logging: 'error',
      overlay: false,
    },
    port: 9000
  },
  // only for production
  // 转换代码，如使用更简单的命名，从而减少代码体积
  optimization: is_prod ? {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        test: /\.js(\?.*)?$/i,
      }),
    ],
  } : {},
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.tsx?$/,
        use: [{
          loader: 'babel-loader',
          options: babelOpts
        },
        {
          loader: 'ts-loader',
          options: {
            // enable this option for hmr
            // https://github.com/TypeStrong/ts-loader?tab=readme-ov-file#hot-module-replacement
            transpileOnly: true
          }
        }],
        exclude: /node_modules/,
      },
      {
        test: /\.(jsx|js)$/,
        include: path.resolve(__dirname, 'src'),
        exclude: /node_modules/,
        use: [{
          loader: 'babel-loader',
          options: babelOpts
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
          },
          'postcss-loader',
        ]
      },
      {
        test: /\.s[ac]ss$/i,
        include: path.resolve(__dirname, 'src'),
        exclude: /node_modules/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
          },
          'postcss-loader',
          'sass-loader'
        ]
      }
    ]
  }
}
