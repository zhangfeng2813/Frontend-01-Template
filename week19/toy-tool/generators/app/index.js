var Generator = require('yeoman-generator');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
  }

  // 收集信息
  collecting() {
    this.log('collecting');
  }

  creating() {
    this.fs.copyTpl(
      this.templatePath('package.json'),
      this.destinationPath('package.json'),
      { title: 'yeoman' }
    );

    this.fs.copyTpl(
      this.templatePath('webpack.config.js'),
      this.destinationPath('webpack.config.js')
    );

    this.fs.copyTpl(
      this.templatePath('createElement.js'),
      this.destinationPath('lib/createElement.js')
    );

    this.fs.copyTpl(
      this.templatePath('animation.js'),
      this.destinationPath('lib/animation.js')
    );

    this.fs.copyTpl(
      this.templatePath('gesture.js'),
      this.destinationPath('lib/gesture.js')
    );

    this.fs.copyTpl(
      this.templatePath('cubicBezier.js'),
      this.destinationPath('lib/cubicBezier.js')
    );

    this.fs.copyTpl(
      this.templatePath('main.js'),
      this.destinationPath('src/main.js')
    );

    this.fs.copyTpl(
      this.templatePath('.babelrc'),
      this.destinationPath('.babelrc')
    );

    this.fs.copyTpl(
      this.templatePath('.nycrc'),
      this.destinationPath('.nycrc')
    );

    this.fs.copyTpl(
      this.templatePath('main.test.js'),
      this.destinationPath('texts/main.test.js')
    );

    this.fs.copyTpl(
      this.templatePath('index.html'),
      this.destinationPath('src/index.html'),
      {
        title: 'title',
      }
    );

    // this.npmInstall(
    //   [
    //     'webpack-cli',
    //     'webpack',
    //     'webpack-dev-server',
    //     'babel-loader',
    //     '@babel/core',
    //     '@babel/preset-env',
    //     '@babel/plugin-transform-react-jsx',
    //     // 测试工具
    //     'mocha',
    //     'nyc',
    //     '@istanbuljs/nyc-config-babel',
    //     'babel-plugin-istanbul',

    //     // html
    //     'html-webpack-plugin'
    //   ],
    //   {
    //     'save-dev': true,
    //   }
    // );
    this.npmInstall();
  }
};
