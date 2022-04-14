module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        extensions: ['.ts', '.tsx', '.jsx', '.js', '.json'],
        alias: {
          '@assets': './public/assets',
          '@components': './src/components',
          '@hooks': './src/hooks',
          '@styles': './src/styles',
          '@services': './src/services',
          '@routes': './src/routes',
          '@interfaces': './src/interfaces',
          '@screens': './src/screens',
          '@utils': './src/utils',
        },
      },
    ],
  ],
};
