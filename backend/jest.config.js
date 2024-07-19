module.exports = {
  testEnvironment: 'node',
  globalTeardown: './tests/Jest/teardown.js',
  testMatch: ['**/tests/Jest/**/*.test.js'],
  //testMatch: ['**/tests/Jest/**/db.test.js'],
  //testMatch: ['**/tests/Jest/**/users.test.js'],
  //testMatch: ['**/tests/Jest/**/notifications.test.js'],
  //testMatch: ['**/tests/Jest/**/signin.test.js'],
  //testMatch: ['**/tests/Jest/**/signup.test.js'],
  testPathIgnorePatterns: ['/node_modules/']
}