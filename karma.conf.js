// Coverage reporting breaks breakpoints
const coverage = process.argv.includes("--coverage");
if (!coverage) {
  console.warn(`--coverage not specified: code coverage will be disabled`);
}

const webpackConfig = require("./webpack.config.js");
webpackConfig.entry = undefined;
webpackConfig.module.rules = [
  {
    test: /\.tsx?$/,
    use: [...(coverage ? ["coverage-istanbul-loader"] : []), "ts-loader"],
  },
];
webpackConfig.output = {
  // Outputs absolute file paths instead of webpack:///path/to/file.extension
  // This makes stacktrace paths clickable in a shell (e.g. VS Code)
  devtoolModuleFilenameTemplate: function (info) {
    return info.absoluteResourcePath;
  },
};

// Bugfix for Webpack 5
webpackConfig.optimization = { splitChunks: false };

module.exports = (config) => {
  config.set({
    browsers: ["ChromeHeadlessDebug"],
    customLaunchers: {
      ChromeHeadlessDebug: {
        base: "ChromeHeadless",
        flags: ["--remote-debugging-port=9333"],
      },
    },
    frameworks: ["jasmine", "webpack"],
    reporters: ["progress", ...(coverage ? ["coverage-istanbul"] : [])],

    files: [
      "test/global-variables.js",
      { pattern: "./test/**/*.ts" },
      { pattern: "./src/**/*.spec.ts" },
    ],

    preprocessors: {
      "**/*.ts": ["webpack", "sourcemap"],
    },

    webpack: {
      devtool: "inline-source-map",
      mode: "development",
      resolve: {
        extensions: [".js", ".ts", ".tsx", ".json"],
        fallback: {
          fs: false,
          path: false,
          util: false,
          assert: false,
          os: false,
        },
      },
      module: {
        rules: [
          {
            test: /\.tsx?$/,
            use: [
              ...(coverage ? ["coverage-istanbul-loader"] : []),
              "ts-loader",
            ],
          },
        ],
      },
      output: {
        // Outputs absolute file paths instead of webpack:///path/to/file.extension
        // This makes stacktrace paths clickable in a shell (e.g. VS Code)
        devtoolModuleFilenameTemplate: function (info) {
          return info.absoluteResourcePath;
        },
      },
    },
    webpackMiddleware: { stats: "errors-only" },

    coverageIstanbulReporter: {
      dir: "coverage",
      reports: ["html", "text-summary", "lcovonly"],
      "report-config": {
        html: { subdir: "html" },
      },
      // Don't run coverage on test/
      instrumentation: {
        excludes: ["**/test/**", "**/*.spec.ts"],
      },
    },
  });
};
