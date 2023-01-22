// Hack to workaround jasmine-karma issues: https://stackoverflow.com/questions/68630040/jasmine-karma-fails-with-referenceerror-process-is-not-defined
const process = {
    env: {
      NODE_ENV :'production'
    }
  };