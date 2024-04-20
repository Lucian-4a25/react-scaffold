const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const ReactRefreshTypeScript = require('react-refresh-typescript');
const webpack = require('webpack');

const is_prod = process.env.NODE_ENV == "production";

const useTsloader = false;
function generate_ts_config(use_ts_loader) {
  const config = [];
  if (!use_ts_loader) {
    config.push({
      test: /\.(jsx|js|ts|tsx)$/,
      include: path.resolve(__dirname, 'src'),
      exclude: /node_modules/,
      use: [{
        loader: 'babel-loader',
        options: generate_babel_opts({ use_ts: true, refresh_react: !is_prod })
      }]
    });
    return config;
  }
  
  config.push({
    test: /\.tsx?$/,
    use: [{
      loader: 'babel-loader',
      options: generate_babel_opts({ use_ts: false, refresh_react: false  })
    },
    {
      loader: 'ts-loader',
      options: {
        // enable this option for hmr
        // https://github.com/TypeStrong/ts-loader?tab=readme-ov-file#hot-module-replacement
        getCustomTransformers: () => ({
            before: [!is_prod && ReactRefreshTypeScript()].filter(Boolean),
        }),
        transpileOnly: true
      }
    }],
    exclude: /node_modules/,
  }, {
    test: /\.(jsx|js)$/,
    include: path.resolve(__dirname, 'src'),
    exclude: /node_modules/,
    use: [{
      loader: 'babel-loader',
      options: generate_babel_opts({ use_ts: false, refresh_react: false })
    }]
  });
  
  return config;
}

function generate_babel_opts({ use_ts, refresh_react }) {
  // need to override: https://github.com/pmmmwh/react-refresh-webpack-plugin/issues/800
  return {
    presets: [
      ['@babel/preset-env', {
        "targets": "defaults" 
      }],
      '@babel/preset-react',
      ...(use_ts ? ["@babel/preset-typescript"] : [])
    ],
    plugins: [...(refresh_react ? [require.resolve('react-refresh/babel')].filter(Boolean) : [])]
  };
}

// console.log("the value of process.env.NODE_ENV is: " , process.env.NODE_ENV)

const basicCssLoaders = [
  {
    loader: MiniCssExtractPlugin.loader,
  },
  {
    loader: 'css-loader',
  },
  'postcss-loader',
];

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
    /* new webpack.HotModuleReplacementPlugin({
      // Options...
    }), */
    new HtmlWebpackPlugin({
      template: "public/index.html",
      filename: "index.html"
    }),
    ...(is_prod ? [new CompressionPlugin({
      test: /\.js(\?.*)?$/i,
    })] : []),
    ...(!is_prod ? [new ReactRefreshWebpackPlugin()] : []),
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
        test: /\.css$/i,
        include: path.resolve(__dirname, 'src'),
        exclude: /node_modules/,
        use: [...basicCssLoaders],
      },
      {
        test: /\.s[ac]ss$/i,
        include: path.resolve(__dirname, 'src'),
        exclude: /node_modules/,
        use: [
          ...basicCssLoaders,
          'sass-loader'
        ]
      },
      ...generate_ts_config(useTsloader),
    ]
  }
}
