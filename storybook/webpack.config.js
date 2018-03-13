const genDefaultConfig = require('@storybook/angular/dist/server/config/defaults/webpack.config.js');

module.exports = (baseConfig, env) => {
  const config = genDefaultConfig(baseConfig, env);

  // Overwrite .css rule
  const cssRule = config.module.rules.find(rule => rule.test && rule.test.toString() === '/\\.css$/');
  if (cssRule) {
    cssRule.exclude = /\.component\.css$/;
  }

  // Add .scss rule
  config.module.rules.unshift({
    test: /\.scss$/,
    loaders: ['raw-loader', 'sass-loader'],
  });

  return config;
};