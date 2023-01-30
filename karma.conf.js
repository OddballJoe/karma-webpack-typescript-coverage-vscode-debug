// Coverage reporting breaks breakpoints
const debug = process.argv.includes("--debug");
if (debug) {
  console.warn(`Debug mode is enabled - code coverage will be disabled`);
}

module.exports = (config) => {
  config.set({
    browsers: ["ChromeHeadlessDebug"],
    customLaunchers: {
      ChromeHeadlessDebug: {
        base: "ChromeHeadless",
        flags: ["--remote-debugging-port=9333"],
      },
    },

    frameworks: ["jasmine"],
    reporters: ["progress", ...(debug ? [] : ["coverage-istanbul"])],

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
            use: [...(debug ? [] : ["coverage-istanbul-loader"]), "ts-loader"],
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
