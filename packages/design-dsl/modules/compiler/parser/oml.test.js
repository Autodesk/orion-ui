require('shelljs/global');

const path = require('path');

const compiler = `./node_modules/.bin/nearleyc`;

const grammarSource = path.join(__dirname, 'oml.ne');
const grammarDest = path.join(__dirname, 'oml.js');

console.log(`${compiler} ${grammarSource} -o ${grammarDest}`);

exec(`${compiler} ${grammarSource} -o ${grammarDest}`);

var grammar = require("./oml.js");
var nearley = require("nearley");

var p = new nearley.Parser(grammar.ParserRules, grammar.ParserStart);

p.feed("<orion></orion>");

console.log(p.results);


