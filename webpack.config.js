const path = require('path');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const config = {
  context: path.resolve(__dirname, 'src'),
  extensions: ['js', 'jsx', 'ts', 'tsx'],
};

const commonConfig = {
  entry: {
    main: path.resolve(__dirname, 'src/index.tsx'),
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].[contenthash].js',
    clean: true,
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new ESLintPlugin(config),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public/index.html'),
      filename: 'index.html',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/i,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },
};

const developmentConfig = {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    compress: true,
    port: 9000,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      async: false,
    }),
  ],
};
const productionConfig = {
  mode: 'production',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      async: true,
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
    new CopyPlugin({
      patterns: [
        {
          from: 'public',
          globOptions: {
            ignore: ['**/*.html'],
          },
        },
      ],
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
  },
};

module.exports = (env, args) => {
  switch (args.mode) {
    case 'development':
      return merge(commonConfig, developmentConfig);
    case 'production':
      return merge(commonConfig, productionConfig);
    default:
      throw new Error('No matching configuration was found!');
  }
};
