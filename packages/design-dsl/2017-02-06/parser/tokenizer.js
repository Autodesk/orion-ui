"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
const ASCII = /[a-zA-Z]/;
const DIGIT = /[0-9]/;
const WHITESPACE = /\s/;
exports.EOF_CHARACTER = '@@EOF@@';
/**
 * Replace an item in the collection and return a new collection
 */
function replaceItem(collection, prev, next) {
    const index = collection.indexOf(prev);
    return [
        ...collection.slice(0, index),
        next,
        ...collection.slice(index + 1, collection.length)
    ];
}
/**
 * Replace an attribute in the StartTag and return a new StartTag
 */
function replaceAttribute(token, prev, next) {
    const index = token.attributes.indexOf(prev);
    return __assign({}, token, { attributes: replaceItem(token.attributes, prev, next) });
}
function appendAttribute(token, next) {
    return __assign({}, token, { attributes: [
            ...token.attributes,
            next
        ] });
}
function createBlockParameter(token, parameter) {
    return __assign({}, token, { hasBlock: true, blockParameters: [
            ...token.blockParameters,
            parameter
        ] });
}
function replaceBlockParameter(token, prev, next) {
    const index = token.blockParameters.indexOf(prev);
    return __assign({}, token, { blockParameters: replaceItem(token.blockParameters, prev, next) });
}
function jsonAttr(name, value = '') {
    return {
        type: 'json',
        name,
        value
    };
}
exports.jsonAttr = jsonAttr;
function expressionAttr(name, value = '') {
    return {
        type: 'expression',
        name,
        value
    };
}
exports.expressionAttr = expressionAttr;
/**
 * Convert OML source to an array of tokens
 *
 * - Split a source string into individual characters
 * - Start from an initial world state (initWorld()) and
 *   reduce over each character over the following transformations:
 *   - getNextToken(world, char)
 *   - getNextLocation(world, char)
 */
function getTokens(source, existing = initWorld()) {
    const world = source
        .split('')
        .reduce((world, char) => getNextLocation(getNextToken(world, char), char), existing);
    return getNextToken(world, exports.EOF_CHARACTER);
}
exports.getTokens = getTokens;
function initWorld() {
    return {
        buffer: '',
        state: 'data',
        currentToken: null,
        currentAttribute: null,
        currentLine: 1,
        currentColumn: 1,
        tokens: []
    };
}
exports.initWorld = initWorld;
function isExpression(token) {
    return token.type === 'expression';
}
;
function createTransition(payload) {
    return { type: 'transition', payload };
}
function getNextToken(world, char) {
    return getActions(char, world).reduce(mutateWorld, world);
}
exports.getNextToken = getNextToken;
function getNextLocation(world, char) {
    if (char === '\n') {
        return __assign({}, world, { currentLine: world.currentLine + 1, currentColumn: 1 });
    }
    else {
        return __assign({}, world, { currentColumn: world.currentColumn + 1 });
    }
}
exports.getNextLocation = getNextLocation;
function getActions(char, world) {
    switch (world.state) {
        case 'data':
            return handleData(char);
        case 'expression':
            return handleExpression(char, world);
        case 'tag-open':
            return handleTagOpen(char, world);
        case 'tag-name':
            return handleTagName(char, world);
        case 'end-tag-open':
            return handleEndTagOpen(char, world);
        case 'self-closing-start-tag':
            return handleSelfClosingStartTag(char, world);
        case 'before-attribute-name':
            return handleBeforeAttributeName(char, world);
        case 'attribute-name':
            return handleAttributeName(char, world);
        case 'after-attribute-name':
            return handleAfterAttributeName(char, world);
        case 'before-attribute-value':
            return handleBeforeAttributeValue(char, world);
        case 'attribute-value-string':
            return handleAttributeValueString(char, world);
        case 'attribute-value-number':
            return handleAttributeValueNumber(char, world);
        case 'attribute-value-array':
            return handleAttributeValueArray(char, world);
        case 'attribute-value-object-or-expression':
            return handleAttributeValueObjectOrExpression(char, world);
        case 'attribute-value-object':
            return handleAttributeValueObject(char, world);
        case 'attribute-value-expression':
            return handleAttributeValueExpression(char, world);
        case 'after-attribute-value':
            return handleAfterAttributeValue(char, world);
        case 'markup-declaration-open':
            return handleMarkupDeclarationOpen(char, world);
        case 'comment-start':
            return handleCommentStart(char, world);
        case 'comment':
            return handleComment(char, world);
        case 'comment-start-dash':
            return handleCommentStartDash(char, world);
        case 'comment-end-dash':
            return handleCommentEndDash(char, world);
        case 'comment-end':
            return handleCommentEnd(char, world);
        case 'before-block':
            return handleBeforeBlock(char, world);
        case 'before-block-parameter':
            return handleBeforeBlockParameter(char, world);
        case 'block-parameter':
            return handleBlockParameter(char, world);
        default:
            throw new SyntaxError('unknown state', world);
    }
}
function mutateWorld(world, action) {
    switch (action.type) {
        case 'emit-character':
            return __assign({}, world, { tokens: [
                    ...world.tokens,
                    character(action.payload, world.currentLine, world.currentColumn)
                ] });
        case 'emit-eof':
            return __assign({}, world, { tokens: [
                    ...world.tokens,
                    EOF(world.currentLine, world.currentColumn)
                ] });
        case 'transition':
            return __assign({}, world, { state: action.payload });
        case 'create-start-tag': {
            // Prefix is <
            const START_TAG_PREFIX_LENGTH = 1;
            const startColumn = world.currentColumn - START_TAG_PREFIX_LENGTH;
            return __assign({}, world, { currentToken: startTag(action.payload, {
                    location: {
                        start: { line: world.currentLine, column: startColumn },
                        end: { line: 1, column: 1 }
                    }
                }) });
        }
        case 'create-expression':
            return __assign({}, world, { currentToken: expression('', world.currentLine, world.currentColumn) });
        case 'create-end-tag': {
            // Prefix is </
            const END_TAG_PREFIX_LENGTH = 2;
            const startColumn = world.currentColumn - END_TAG_PREFIX_LENGTH;
            return __assign({}, world, { currentToken: endTag(action.payload, {
                    start: { line: world.currentLine, column: startColumn },
                    end: { line: 1, column: 1 }
                }) });
        }
        case 'create-attribute':
            if (!world.currentToken) {
                throw new SyntaxError('no current token', world);
            }
            if (world.currentToken.type !== 'start-tag') {
                throw new SyntaxError('only start tags can have attributes', world);
            }
            const newAttribute = jsonAttr(action.payload);
            return __assign({}, world, { currentToken: appendAttribute(world.currentToken, newAttribute), currentAttribute: newAttribute });
        case 'create-block-parameter':
            if (!world.currentToken) {
                throw new SyntaxError('no current token', world);
            }
            if (world.currentToken.type !== 'start-tag') {
                throw new SyntaxError('current token is not start tag', world);
            }
            return __assign({}, world, { currentToken: createBlockParameter(world.currentToken, action.payload) });
        case 'create-comment':
            // Prefix is <!-- (minus the current dash)
            const COMMENT_PREFIX_LENGTH = 3;
            const startColumn = world.currentColumn - COMMENT_PREFIX_LENGTH;
            return __assign({}, world, { currentToken: comment('', world.currentLine, startColumn) });
        case 'append-tag-name':
            if (!world.currentToken) {
                throw new SyntaxError('no current token', world);
            }
            if (!isTagToken(world.currentToken)) {
                throw new SyntaxError('only start-tag and end-tag have tagName', world);
            }
            return __assign({}, world, { currentToken: __assign({}, world.currentToken, { tagName: `${world.currentToken.tagName}${action.payload}` }) });
        case 'append-expression':
            if (!world.currentToken) {
                throw new SyntaxError('no current token', world);
            }
            if (world.currentToken.type !== 'expression') {
                throw new SyntaxError('current token is not an expression', world);
            }
            return __assign({}, world, { currentToken: __assign({}, world.currentToken, { value: `${world.currentToken.value}${action.payload}` }) });
        case 'append-buffer':
            return __assign({}, world, { buffer: `${world.buffer}${action.payload}` });
        case 'append-comment':
            if (!world.currentToken) {
                throw new SyntaxError('no current token', world);
            }
            if (world.currentToken.type !== 'comment') {
                throw new Error('current token is not comment');
            }
            return __assign({}, world, { currentToken: __assign({}, world.currentToken, { data: `${world.currentToken.data}${action.payload}` }) });
        case 'clear-buffer':
            return __assign({}, world, { buffer: '' });
        case 'emit-current-token':
            if (!world.currentToken) {
                throw new SyntaxError('no tag token to emit', world);
            }
            // Add end location to new token
            const newToken = __assign({}, world.currentToken, { location: __assign({}, world.currentToken.location, { end: {
                        line: world.currentLine,
                        column: world.currentColumn
                    } }) });
            return __assign({}, world, { currentToken: null, currentAttribute: null, tokens: [
                    ...world.tokens,
                    newToken
                ] });
        case 'emit-comment':
            if (!world.currentToken) {
                throw new Error('no current token');
            }
            if (world.currentToken.type !== 'comment') {
                throw new Error('current token is not comment');
            }
            return __assign({}, world, { currentToken: null, tokens: [
                    ...world.tokens,
                    __assign({}, world.currentToken, { location: __assign({}, world.currentToken.location, { end: {
                                line: world.currentLine,
                                column: world.currentColumn
                            } }) })
                ] });
        case 'set-self-closing':
            if (!world.currentToken) {
                throw new Error('no current token');
            }
            if (world.currentToken.type !== 'start-tag') {
                throw new Error('only start-tag can be made self closing');
            }
            return __assign({}, world, { currentToken: __assign({}, world.currentToken, { selfClosing: true }) });
        case 'append-attribute-name': {
            if (!world.currentAttribute) {
                throw new SyntaxError('no current attribute', world);
            }
            if (!world.currentToken) {
                throw new SyntaxError('no current token', world);
            }
            if (world.currentToken.type !== 'start-tag') {
                throw new SyntaxError('only start tags can have attributes', world);
            }
            const prev = world.currentAttribute;
            const next = __assign({}, prev, { name: `${prev.name}${action.payload}` });
            return __assign({}, world, { currentAttribute: next, currentToken: replaceAttribute(world.currentToken, prev, next) });
        }
        case 'append-attribute-value': {
            if (!world.currentAttribute) {
                throw new SyntaxError('no current attribute', world);
            }
            if (!world.currentToken) {
                throw new SyntaxError('no current token', world);
            }
            if (world.currentToken.type !== 'start-tag') {
                throw new SyntaxError('only start tags can have attributes', world);
            }
            const prev = world.currentAttribute;
            const next = __assign({}, prev, { value: `${prev.value}${action.payload}` });
            return __assign({}, world, { currentAttribute: next, currentToken: replaceAttribute(world.currentToken, prev, next) });
        }
        case 'append-block-parameter':
            if (!world.currentToken) {
                throw new SyntaxError('no current token', world);
            }
            if (world.currentToken.type !== 'start-tag') {
                throw new SyntaxError('current token is not start tag', world);
            }
            const prev = world.currentToken.blockParameters[world.currentToken.blockParameters.length - 1];
            const next = `${prev}${action.payload}`;
            return __assign({}, world, { currentToken: replaceBlockParameter(world.currentToken, prev, next) });
        case 'change-attr-to-expression': {
            if (!world.currentAttribute) {
                throw new SyntaxError('no current attribute', world);
            }
            if (!world.currentToken) {
                throw new SyntaxError('no current token', world);
            }
            if (world.currentToken.type !== 'start-tag') {
                throw new SyntaxError('only start tags can have attributes', world);
            }
            const prev = world.currentAttribute;
            const next = __assign({}, prev, { type: 'expression' });
            return __assign({}, world, { currentAttribute: next, currentToken: replaceAttribute(world.currentToken, prev, next) });
        }
        default:
            throw new SyntaxError('unknown action', world);
    }
}
function isTagToken(token) {
    return (token.type === 'start-tag' || token.type === 'end-tag');
}
function isStartTag(token) {
    return token.type === 'start-tag';
}
function isEndTag(token) {
    return token.type === 'end-tag';
}
function character(data, line = 1, column = 1) {
    const lc = { line, column };
    return {
        type: 'character',
        data,
        location: {
            start: lc,
            end: lc
        }
    };
}
exports.character = character;
function spaces(count, startLine = 1, startColumn = 1) {
    const chars = [];
    for (let i = 0; i < count; i++) {
        chars.push(character(' ', startLine, startColumn + i));
    }
    return chars;
}
exports.spaces = spaces;
function word(word) {
    return word.split('').map(char => character(char));
}
exports.word = word;
function EOF(line = 1, column = 1) {
    return {
        type: 'eof', location: {
            start: { line, column },
            end: { line, column }
        }
    };
}
exports.EOF = EOF;
function startTag(tagName, options = {}) {
    // Set up the defaults
    const { attributes, selfClosing, blockParameters, location } = __assign({ attributes: [], selfClosing: false, blockParameters: [], location: {
            start: { line: 1, column: 1 },
            end: { line: 1, column: 1 },
        } }, options);
    const hasBlock = (blockParameters.length) ? true : false;
    return {
        type: 'start-tag',
        tagName,
        selfClosing,
        hasBlock,
        attributes,
        blockParameters,
        location
    };
}
exports.startTag = startTag;
function expression(value, startLine = 1, startColumn = 1, endLine = 1, endColumn = 1) {
    return {
        type: 'expression',
        value,
        location: {
            start: { line: startLine, column: startColumn },
            end: { line: endLine, column: endColumn }
        }
    };
}
exports.expression = expression;
function endTag(tagName, location = {
        start: { line: 1, column: 1 },
        end: { line: 1, column: 1 }
    }) {
    return {
        type: 'end-tag',
        tagName,
        location
    };
}
exports.endTag = endTag;
function comment(data = '', startLine = 1, startColumn = 1, endLine = 1, endColumn = 1) {
    return {
        type: 'comment',
        data,
        location: {
            start: { line: startLine, column: startColumn },
            end: { line: endLine, column: endColumn }
        }
    };
}
exports.comment = comment;
function handleData(char) {
    switch (char) {
        case '<':
            return [createTransition('tag-open')];
        case '{':
            return [
                createTransition('expression'),
                { type: 'create-expression' }
            ];
        case exports.EOF_CHARACTER:
            return [{ type: 'emit-eof' }];
        default:
            return [{ type: 'emit-character', payload: char }];
    }
}
function handleExpression(char, world) {
    handleEOF(char, world);
    if (char === '}') {
        return [
            { type: 'emit-current-token' },
            createTransition('data')
        ];
    }
    else {
        return [
            { type: 'append-expression', payload: char }
        ];
    }
}
function handleEOF(char, world) {
    if (char === exports.EOF_CHARACTER) {
        throw unexpectedEndOfFile(world);
    }
}
function handleTagOpen(char, world) {
    handleEOF(char, world);
    if (char === '/') {
        return [
            createTransition('end-tag-open')
        ];
    }
    else if (char === '!') {
        return [
            createTransition('markup-declaration-open')
        ];
    }
    else if (char.match(ASCII)) {
        return [
            { type: 'create-start-tag', payload: char.toLowerCase() },
            createTransition('tag-name')
        ];
    }
    else {
        throw new SyntaxError('unknown character', world);
    }
}
function handleTagName(char, world) {
    handleEOF(char, world);
    if (char.match(WHITESPACE)) {
        // Guard whitespace in tagname for end tags
        if (world.currentToken && isEndTag(world.currentToken)) {
            throw new SyntaxError(`Expected '>'`, world);
        }
        return [
            createTransition('before-attribute-name')
        ];
    }
    else if (char === '/') {
        return [
            createTransition('self-closing-start-tag')
        ];
    }
    else if (char === '>') {
        return [
            createTransition('data'),
            { type: 'emit-current-token' }
        ];
    }
    else {
        return [
            { type: 'append-tag-name', payload: char.toLowerCase() }
        ];
    }
}
function handleEndTagOpen(char, world) {
    handleEOF(char, world);
    if (char.match(ASCII)) {
        return [
            { type: 'create-end-tag', payload: char.toLowerCase() },
            createTransition('tag-name')
        ];
    }
    else {
        throw unknownCharacter(world);
    }
}
function handleSelfClosingStartTag(char, world) {
    handleEOF(char, world);
    if (char === '>') {
        return [
            { type: 'set-self-closing' },
            createTransition('data'),
            { type: 'emit-current-token' }
        ];
    }
    else {
        throw unknownCharacter(world);
    }
}
function handleBeforeAttributeName(char, world) {
    handleEOF(char, world);
    if (char.match(WHITESPACE)) {
        return [];
    }
    else if (char === '/') {
        return [
            createTransition('self-closing-start-tag')
        ];
    }
    else if (char === '>') {
        return [
            { type: 'emit-current-token' },
            createTransition('data')
        ];
    }
    else if (char === '=') {
        return [
            createTransition('before-block')
        ];
    }
    else if ([`"`, `'`, '<'].indexOf(char) !== -1) {
        throw unknownCharacter(world);
    }
    else {
        return [
            { type: 'create-attribute', payload: char.toLowerCase() },
            createTransition('attribute-name')
        ];
    }
}
function handleAttributeName(char, world) {
    handleEOF(char, world);
    if (char.match(WHITESPACE)) {
        return [
            createTransition('after-attribute-name')
        ];
    }
    else if (char === '/') {
        return [
            createTransition('self-closing-start-tag')
        ];
    }
    else if (char === '=') {
        return [
            createTransition('before-attribute-value')
        ];
    }
    else if (char === '>') {
        return [
            { type: 'emit-current-token' },
            createTransition('data')
        ];
    }
    else if ([`'`, `"`, `<`].indexOf(char) !== -1) {
        throw unknownCharacter(world);
    }
    else {
        return [
            { type: 'append-attribute-name', payload: char.toLowerCase() }
        ];
    }
}
function handleAfterAttributeName(char, world) {
    handleEOF(char, world);
    if (char.match(WHITESPACE)) {
        return []; // ignore whitespace
    }
    else if (char === '/') {
        return [
            createTransition('self-closing-start-tag')
        ];
    }
    else if (char === '=') {
        return [
            createTransition('before-attribute-value')
        ];
    }
    else if (char === '>') {
        return [
            { type: 'emit-current-token' },
            createTransition('data')
        ];
    }
    else if ([`'`, `"`, `<`].indexOf(char) !== -1) {
        throw unknownCharacter(world);
    }
    else {
        return [
            { type: 'create-attribute', payload: char.toLowerCase() },
            createTransition('attribute-name')
        ];
    }
}
function handleBeforeAttributeValue(char, world) {
    handleEOF(char, world);
    if (char.match(WHITESPACE)) {
        return [];
    }
    else if (char === '"') {
        return [
            { type: 'append-attribute-value', payload: char },
            createTransition('attribute-value-string')
        ];
    }
    else if (char.match(DIGIT)) {
        return [
            { type: 'append-attribute-value', payload: char },
            createTransition('attribute-value-number')
        ];
    }
    else if (char === '[') {
        return [
            { type: 'append-attribute-value', payload: char },
            createTransition('attribute-value-array')
        ];
    }
    else if (char === '{') {
        return [
            createTransition('attribute-value-object-or-expression')
        ];
    }
    else {
        throw unknownCharacter(world);
    }
}
function handleAttributeValueString(char, world) {
    handleEOF(char, world);
    if (char === `"`) {
        return [
            { type: 'append-attribute-value', payload: char },
            createTransition('after-attribute-value')
        ];
    }
    else {
        return [
            { type: 'append-attribute-value', payload: char }
        ];
    }
}
function handleAttributeValueNumber(char, world) {
    handleEOF(char, world);
    if (char.match(WHITESPACE)) {
        return [
            createTransition('before-attribute-name')
        ];
    }
    else if (char === '/') {
        return [
            createTransition('self-closing-start-tag')
        ];
    }
    else if (char === '>') {
        return [
            { type: 'emit-current-token' },
            createTransition('data')
        ];
    }
    else if (char.match(DIGIT)) {
        return [
            { type: 'append-attribute-value', payload: char }
        ];
    }
    else {
        throw unknownCharacter(world);
    }
}
function handleAttributeValueArray(char, world) {
    handleEOF(char, world);
    if (char === ']') {
        if (world.currentAttribute) {
            try {
                JSON.parse(`${world.currentAttribute.value}${char}`);
                // parsable by json so switch to after-attribute-value
                return [
                    { type: 'append-attribute-value', payload: char },
                    createTransition('after-attribute-value')
                ];
            }
            catch (e) {
                // not parsable, just append value
                return [
                    { type: 'append-attribute-value', payload: char },
                ];
            }
        }
        else {
            throw new Error('no current attribute');
        }
    }
    else {
        return [
            { type: 'append-attribute-value', payload: char }
        ];
    }
}
function handleAttributeValueObjectOrExpression(char, world) {
    handleEOF(char, world);
    if (char.match(WHITESPACE)) {
        return [];
    }
    else if (char === '"') {
        return [
            { type: 'append-attribute-value', payload: "{" },
            { type: 'append-attribute-value', payload: char },
            createTransition('attribute-value-object')
        ];
    }
    else {
        return [
            { type: 'append-attribute-value', payload: char },
            { type: 'change-attr-to-expression' },
            createTransition('attribute-value-expression')
        ];
    }
}
function handleAttributeValueObject(char, world) {
    handleEOF(char, world);
    if (char === '}') {
        if (world.currentAttribute) {
            try {
                JSON.parse(`${world.currentAttribute.value}${char}`);
                // parsable by json so switch to after-attribute-value
                return [
                    { type: 'append-attribute-value', payload: char },
                    createTransition('after-attribute-value')
                ];
            }
            catch (e) {
                // not parsable, just append value
                return [
                    { type: 'append-attribute-value', payload: char },
                ];
            }
        }
        else {
            throw new Error('no current attribute');
        }
    }
    else {
        return [
            { type: 'append-attribute-value', payload: char }
        ];
    }
}
function handleAttributeValueExpression(char, world) {
    handleEOF(char, world);
    if (char === '}') {
        return [
            createTransition('after-attribute-value')
        ];
    }
    else {
        return [
            { type: 'append-attribute-value', payload: char }
        ];
    }
}
function handleAfterAttributeValue(char, world) {
    handleEOF(char, world);
    if (char.match(WHITESPACE)) {
        return [
            createTransition('before-attribute-name')
        ];
    }
    else if (char === '/') {
        return [
            createTransition('self-closing-start-tag')
        ];
    }
    else if (char === '>') {
        return [
            { type: 'emit-current-token' },
            createTransition('data')
        ];
    }
    else {
        throw unknownCharacter(world);
    }
}
function handleMarkupDeclarationOpen(char, world) {
    handleEOF(char, world);
    if (char === '-') {
        if (world.buffer === '-') {
            return [
                { type: 'clear-buffer' },
                { type: 'create-comment' },
                createTransition('comment-start')
            ];
        }
        else {
            return [
                { type: 'append-buffer', payload: char }
            ];
        }
    }
    else {
        throw unknownCharacter(world);
    }
}
function handleCommentStart(char, world) {
    handleEOF(char, world);
    if (char === '-') {
        return [
            createTransition('comment-start-dash')
        ];
    }
    else if (char === '>') {
        throw unknownCharacter(world);
    }
    else {
        return [
            createTransition('comment'),
            { type: 'append-comment', payload: char }
        ];
    }
}
function handleComment(char, world) {
    handleEOF(char, world);
    if (char === '-') {
        return [
            createTransition('comment-end-dash')
        ];
    }
    else {
        return [
            { type: 'append-comment', payload: char }
        ];
    }
}
function handleCommentStartDash(char, world) {
    handleEOF(char, world);
    if (char === '-') {
        return [
            createTransition('comment-end')
        ];
    }
    else if (char === '>') {
        throw unknownCharacter(world);
    }
    else {
        return [
            { type: 'append-comment', payload: '-' },
            { type: 'append-comment', payload: char },
            createTransition('comment')
        ];
    }
}
function handleCommentEndDash(char, world) {
    handleEOF(char, world);
    if (char === '-') {
        return [
            createTransition('comment-end')
        ];
    }
    else {
        return [
            { type: 'append-comment', payload: '-' },
            { type: 'append-comment', payload: char },
            createTransition('comment')
        ];
    }
}
function handleCommentEnd(char, world) {
    handleEOF(char, world);
    if (char === '>') {
        return [
            { type: 'emit-comment' },
            createTransition('data')
        ];
    }
    else if (char === '-') {
        return [
            { type: 'append-comment', payload: char }
        ];
    }
    else {
        return [
            { type: 'append-comment', payload: '-' },
            { type: 'append-comment', payload: '-' },
            { type: 'append-comment', payload: char },
            createTransition('comment')
        ];
    }
}
function handleBeforeBlock(char, world) {
    handleEOF(char, world);
    if (char === '>') {
        return [
            createTransition('before-block-parameter')
        ];
    }
    else {
        throw unknownCharacter(world);
    }
}
function handleBeforeBlockParameter(char, world) {
    handleEOF(char, world);
    if (char.match(WHITESPACE)) {
        return [];
    }
    else if (char.match(ASCII)) {
        return [
            { type: 'create-block-parameter', payload: char },
            createTransition('block-parameter')
        ];
    }
    else {
        throw unknownCharacter(world);
    }
}
function handleBlockParameter(char, world) {
    handleEOF(char, world);
    if (char.match(ASCII)) {
        return [
            { type: 'append-block-parameter', payload: char }
        ];
    }
    else if (char === ',') {
        return [
            createTransition('before-block-parameter')
        ];
    }
    else if (char === '>') {
        return [
            createTransition('data'),
            { type: 'emit-current-token' }
        ];
    }
    else {
        throw unknownCharacter(world);
    }
}
function unknownCharacter(world) {
    return new SyntaxError('unknown character', world);
}
function unexpectedEndOfFile(world) {
    return new SyntaxError('unexpected end of file', world);
}
class SyntaxError {
    constructor(message, world) {
        this.message = message;
        this.location = { line: world.currentLine, column: world.currentColumn };
    }
}
exports.SyntaxError = SyntaxError;
//# sourceMappingURL=tokenizer.js.map