module.exports = function (api) {
  api.cache(true);

  return {
    presets: [
      'module:metro-react-native-babel-preset',
      'module:react-native-dotenv',
    ],
    plugins: [
      [
        'react-intl-auto',
        {
          removePrefix: 'src/',
          extractComments: true,
          filebase: false,
        },
      ],
    ],
  };
};
