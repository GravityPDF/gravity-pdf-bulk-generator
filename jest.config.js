module.exports = {
  "clearMocks": true,
  "collectCoverageFrom": [
    "assets/react/**/*.{js,jsx}",
    "!assets/react/api/*.{js,jsx}",
  ],
  "roots": [
    "./tests/js-unit/"
  ],
  "transform": {
    "^.+\\.js?$": "babel-jest"
  },
  "coverageThreshold": {
    "global": {
      "branches": 78,
      "functions": 90,
      "lines": 90,
      "statements": 90
    }
  },
  "setupFiles": [
    "./tests/js-unit/setupTests.js"
  ]
}
