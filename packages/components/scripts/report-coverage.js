/* eslint-env shelljs */
require('shelljs/global');

const path = require('path');

cd(path.join(__dirname, '..'));

['jest', 'wct'].forEach((dir) => {
  console.log(`Sending coverage for ${dir}`);
  cat(path.join(__dirname, '..', 'coverage', dir, 'lcov.info')).exec('./node_modules/.bin/codacy-coverage');
});
