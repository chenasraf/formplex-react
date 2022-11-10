// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')

const isProduction = process.env.NODE_ENV == 'production'

/** @type {import('webpack').WebpackOptionsNormalized} */
const config = {
  mode: isProduction ? 'production' : 'development',
  entry: {
    index: './src/index.ts',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    library: {
      type: 'commonjs2',
    },
  },
  plugins: [
    // Add your plugins here
    // Learn more about plugins from https://webpack.js.org/configuration/plugins/
    new CopyPlugin({
      patterns: [{ from: 'package.json', to: '.' }],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: 'ts-loader',
        exclude: ['/node_modules/'],
      },
      // {
      //   test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
      //   type: "asset",
      // },

      // Add your rules for custom modules here
      // Learn more about loaders from https://webpack.js.org/loaders/
    ],
  },
  externals: {
    react: 'commonjs react',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
  },
}

module.exports = config
