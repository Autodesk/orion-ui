#!/usr/bin/env node
"use strict";
const program = require("commander");
const fs = require("fs");
const path = require("path");
const tokenizer_1 = require("../parser/tokenizer");
function cli(argv) {
    program
        .command('compile <file>')
        .description('compiles an OML file to JavaScript')
        .action((file) => {
        const source = path.join(process.cwd(), file);
        const stream = fs.createReadStream(source);
        let start = tokenizer_1.initWorld();
        stream.on('data', (chunk) => {
            start = tokenizer_1.getTokens(chunk.toString(), start);
        });
        stream.on('end', () => {
            console.log('done');
        });
        stream.on('error', (err) => {
            console.error(err);
        });
    });
    program.parse(process.argv);
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = cli;
//# sourceMappingURL=orion.js.map