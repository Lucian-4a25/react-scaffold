const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const webpack = require('webpack');
const PreloadOptimizePlugin = require('./webpack_plugin/preload-image-plugin');

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
    filename: 'index.[contenthash].js',
    assetModuleFilename: '[name].[hash][ext][query]',
    // publicPath: 'cdn.example.com/static/',
    clean: true,
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
      filename: "index.html",
    }),
    new PreloadOptimizePlugin({
      staticLinkTags: [
        {
          rel: 'dns-prefetch',
          href: 'https://cdn.example.com'
        },
        {
          rel: 'preconnect',
          href: 'https://cdn.example.com',
        },
        {
          rel: 'preload',
          href: "https://cdn.example.com/banner.ed60f30fd9b7a524caac.png",
          attributes: { as: "image", /* crossorigin: true, */ fetchPriority: "high", media: "(min-width: 601px)",  type: "image/png" }
        },
        {
          rel: 'preload',
          href: "https://cdn.example.com/banner-mb.09ca77717d85a2da841d.png",
          attributes: { as: "image", /* crossorigin: true,  */fetchPriority: "high", media: "(max-width: 600px)", type: "image/png" }
        }
      ],
      // 匹配要预加载的资源类型及相关属性，crossorigin 必须保持一致才会使用预加载的资源
      preloadPatterns: [
        { pattern: /screenshot1.*\.(png|jpg|jpeg|gif)$/i, as: 'image', attributes: { /* crossorigin: true */ type: "image/png", fetchPriority: "high", media: "(min-width: 601px)", }},
        { pattern: /\.(woff|woff2|ttf|eot)$/i, as: 'font', attributes: { crossorigin: 'anonymous' }}
      ],
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
