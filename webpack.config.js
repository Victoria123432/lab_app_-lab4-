import path from 'path';
import CopyWebpackPlugin from 'copy-webpack-plugin';

module.exports = {
  mode: 'development',
  entry: './src/app.ts',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/i,
        type: 'asset/resource',
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    // new HtmlWebpackPlugin({
    //   Template:'./src/index.html',
    //   filename: '../index.html'
    // }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'node_modules/bootstrap/dist/css/bootstrap.min.css',
          to: path.resolve(__dirname, 'libs/bootstrap.min.css'),
        },
        {
          from: 'node_modules/bootstrap/dist/js/bootstrap.bundle.min.js',
          to: path.resolve(__dirname, 'libs/bootstrap.bundle.min.js'),
        },
      ],
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname),
    },
    compress: true,
    port: 9000,
  },
};
