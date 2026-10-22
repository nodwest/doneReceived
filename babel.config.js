// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Плагин Reanimated должен быть последним
      'react-native-reanimated/plugin',
    ],
  };
};
