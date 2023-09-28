module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "react-native-reanimated/plugin",
      "module:react-native-dotenv",
      "module-resolver",
      {
        alias: {
          assets: "./src/assets",
          components: "./src/components",
          pages: "./src/pages",
          recoil: "./src/recoil",
          styles: "./src/styles",
          types: "./src/types",
          utils: "./src/utils",
        },
      },
    ],
  };
};
