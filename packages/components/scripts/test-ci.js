/* eslint-env shelljs */
require('shelljs/global');

const path = require('path');

cd(path.join(__dirname, '..'));

const codes = [
  'npm run coverage',
  'npm run browserify',
  'npm run wct-sauce',
  'npm run report-coverage',
].map((command) => {
  return exec(command).code;
});

if (codes.filter(c => c === 0).length !== codes.length) {
  process.exit(1);
}
