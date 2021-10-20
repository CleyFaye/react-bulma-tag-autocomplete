const {resolve} = require("path");
const loadGruntTasks = require("load-grunt-tasks");
const ESLintPlugin = require("eslint-webpack-plugin");

/**
 * Babel options; shared between build and webpack test build
 */
const babelOptions = {
  sourceMap: true,
  presets: [
    [
      "@babel/preset-env",
      {
        targets: "last 2 versions, not dead",
        modules: false,
        useBuiltIns: "usage",
        corejs: 3,
      },
    ],
    "@babel/preset-react",
  ],
};

/**
 * Grunt babel config
 */
const babelConfig = {
  options: babelOptions,
  dist: {
    files: [
      {
        expand: true,
        cwd: "src",
        src: [
          "**/*.js",
          "!test_loader.js",
        ],
        dest: "lib",
      },
    ],
  },
};

/**
 * Grunt webpack test config
 */
const webpackConfig = {
  test: {
    mode: "development",
    entry: "./src/test_loader.js",
    output: {
      filename: "loader.js",
      path: resolve("test"),
    },
    externals: {
      "react": "React",
      "react-dom": "ReactDOM",
    },
    module: {
      rules: [
        {
          test: /\.js$/u,
          exclude: /node_modules/u,
          loader: "babel-loader",
          options: babelOptions,
        },
      ],
    },
    plugins: [new ESLintPlugin()],
  },
};

module.exports = grunt => {
  loadGruntTasks(grunt);

  grunt.initConfig(
    {
      babel: babelConfig,
      webpack: webpackConfig,
    },
  );

  grunt.registerTask(
    "build",
    "Build the library",
    [
      "babel:dist",
    ],
  );

  grunt.registerTask(
    "test",
    "Build the test file",
    [
      "webpack:test",
    ],
  );

  grunt.registerTask(
    "default",
    [
      "build",
    ],
  );
};
