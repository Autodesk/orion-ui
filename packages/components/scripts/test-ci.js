/* eslint-env shelljs */
require('shelljs/global');

const path = require('path');

cd(path.join(__dirname, '..'));

const codes = [
  'npm run browserify',
  'npm run wct-sauce',
  'node scripts/remap-wct-coverage.js',
  'npm run jest-coverage',
  'node scripts/report-coverage.js',
].map((command) => {
  return exec(command).code;
});

if (codes.filter(c => c === 0).length !== codes.length) {
  process.exit(1);
}
