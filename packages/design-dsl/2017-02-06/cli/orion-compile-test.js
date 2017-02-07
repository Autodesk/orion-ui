"use strict";
const shelljs_1 = require("shelljs");
const chai_1 = require("chai");
const version_1 = require("../version");
describe('compile HelloWorld.oml', () => {
    shelljs_1.ls('examples/*.oml').forEach(file => {
        it(`compiles ${file} to ${file}.js`, () => {
            const { stdout } = shelljs_1.exec(`node ${version_1.default} compile ${file}`);
            chai_1.expect(stdout.toString()).to.equal(shelljs_1.cat(`${file}.js`).toString());
        });
    });
});
//# sourceMappingURL=orion-compile-test.js.map