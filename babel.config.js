module.exports = {
  presets: [
    "next/babel",
    [
      "@babel/preset-env",
      {
        targets: {
          browsers: ["> 0.25%", "not dead", "ie 11"],
        },
        useBuiltIns: "entry",
        corejs: 3,
      },
    ],
  ],
  plugins: [],
};
