module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./src"],
          alias: {
            "~assets": "./src/assets",
            "~components": "./src/components",
            "~pages": "./src/pages",
            "~store": "./src/store",
            "~theme": "./src/theme",
            "~types": "./src/types",
            "~utils": "./src/utils",
          },
        },
      ],
    ],
  };
};
