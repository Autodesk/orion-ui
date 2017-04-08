/* eslint-env shelljs */
require('shelljs/global');

const path = require('path');

cd(path.join(__dirname, '..'));

mkdir('-p', 'build');
exec('NODE_ENV=development ./node_modules/.bin/browserify test/bundle.js -t [ babelify ] -o build/bundle.js --debug');
