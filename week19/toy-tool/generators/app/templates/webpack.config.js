const path = require('path');

module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, './src/main.js'),
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: {
          loader: 'css-loader',
          // loader: path.resolve('./cssloader.js')
        },
      },
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            // pragma 影响函数名
            plugins: [
              [
                '@babel/plugin-transform-react-jsx',
                { pragma: 'createElement' },
              ],
            ],
          },
        },
      },
    ],
  },
  plugins: [new (require('html-webpack-plugin'))()],
  optimization: {
    minimize: false,
  },
  devServer: {
    open: true,
    compress: false,
    contentBase: './src',
  },
};
