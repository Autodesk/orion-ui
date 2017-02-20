import * as assert from 'assert';
import * as nearley from 'nearley';

import { getTokens } from './tokenizer';
import { Node } from '../types';
import * as grammar from './oml';

export default class Parser {
  parse(source: string): Node {
    const p = new nearley.Parser(grammar.ParserRules, grammar.ParserStart);
    const { tokens } = getTokens(source);

    p.feed(tokens);

    assert.equal(p.results.length, 1);

    return p.results[0];
  }
}