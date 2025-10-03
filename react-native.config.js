/**
 * react-native.config.js
 * This file helps React Native Autolinking detect your Android package name.
 */

module.exports = {
    project: {
      android: {
        packageName: "com.kalindu2003.myapp", // <- must match app.json "android.package"
      },
      ios: {},
    },
  };
  