module.exports = {
    env: {
      browser: true,
      es2021: true,
      node: true, // Enable Node.js environment for server files
    },
    extends: [
      'eslint:recommended',
      'plugin:react/recommended',
    ],
    parserOptions: {
      ecmaVersion: 12,
      sourceType: 'module',
    },
    rules: {
      'no-undef': 'off', // Temporarily disable to allow require and __dirname
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    overrides: [
      {
        files: ['server/**/*.js'],
        env: {
          node: true,
          commonjs: true, // Explicitly enable CommonJS for server files
        },
        rules: {
          'no-undef': 'off', // Allow require and __dirname in server files
        },
      },
    ],
  };