// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      // Expo preset + указание jsxImportSource
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    plugins: [
      // Reanimated ниже, если уже используешь
      'react-native-reanimated/plugin',
    ],
  };
};
