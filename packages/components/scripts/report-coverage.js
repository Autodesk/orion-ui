/* eslint-env shelljs */
require('shelljs/global');

const path = require('path');

cd(path.join(__dirname, '..'));

cat('coverage/lcov.info').exec('./node_modules/.bin/codacy-coverage');

