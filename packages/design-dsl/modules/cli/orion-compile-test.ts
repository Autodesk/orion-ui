import { cd, exec, cat, ls } from 'shelljs';
import { expect } from 'chai';

import version from '../version';

describe('compile HelloWorld.oml', () => {
  ls('examples/*.oml').forEach(file => {
    it(`compiles ${file} to ${file}.js`, () => {
      const { stdout } = exec(`node ${version} compile ${file}`);
      expect(stdout.toString()).to.equal( cat(`${file}.js`).toString());
    });
  });
});