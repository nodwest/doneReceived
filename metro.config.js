// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, {
  input: './app.css', // путь к твоему CSS (ты указал app.css)
  inlineRem: 16, // опционально, как советуют Reusables
});
