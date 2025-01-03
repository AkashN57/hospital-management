module.exports = {
    testEnvironment: 'node',
    moduleFileExtensions: ['js', 'jsx', 'json'],
    transform: {
      '^.+\\.jsx?$': 'babel-jest'
    },
    testMatch: [
      '**/__tests__/**/*.test.js',
      '**/?(*.)+(spec|test).js'
    ],
    moduleNameMapper: {
      '^(\\.{1,2}/.*)\\.js$': '$1'
    },
    transformIgnorePatterns: [
      'node_modules/(?!(module-that-needs-to-be-transformed)/)'
    ]
  };