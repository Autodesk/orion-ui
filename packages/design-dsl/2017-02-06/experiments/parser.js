"use strict";
const es6_identifier_regex_1 = require("./utils/es6-identifier-regex");
exports.WHITESPACE = /\s/;
const NOOP = () => { };
/**
 * Read source in and return ASTNode
 */
function parse(source) {
    const transitions = {
        tagName: {
            enter: enterTagName,
            exit: exitTagName,
            handleChar: handleTagNameChar
        },
        attributes: {
            enter: enterAttributes,
            exit: exitAttributes,
            handleChar: handleAttributesChar
        },
        children: {
            enter: enterChildren,
            exit: exitChildren,
            handleChar: handleChildrenChar
        },
        lambda: {
            enter: enterLambda,
            exit: exitLambda,
            handleChar: handleLambdaChar
        }
    };
    const rootScope = {
        currentNode: null,
        currentLambda: null,
        children: [],
        astBuffer: [],
        parent: null
    };
    // env starts at root scope
    const env = {
        line: 0,
        column: 0,
        state: 'children',
        attrState: 'name',
        attrValueTerminator: null,
        attrValueMaybeBinding: false,
        attrValueIsBinding: false,
        attributeNameBuffer: '',
        attributeValueBuffer: '',
        closingNode: false,
        selfClosing: false,
        tagNameBuffer: '',
        currentScope: rootScope,
        rootScope,
        maybeLambda: false,
        lambdaBindingBuffer: '',
        handleChar: transitions['children'].handleChar
    };
    function transition(next) {
        if (transitions[env.state]) {
            transitions[env.state].exit();
        }
        if (transitions[next]) {
            transitions[next].enter();
            env.handleChar = transitions[next].handleChar;
        }
        env.state = next;
    }
    function enterTagName() {
        env.tagNameBuffer = '';
    }
    function exitTagName() {
        // Only save nodes for opening tags
        if (!env.closingNode) {
            saveNodeToScope();
        }
    }
    function handleTagNameChar(char) {
        if (char === '>') {
            transition('children');
        }
        else if (char.match(exports.WHITESPACE)) {
            transition('attributes');
        }
        else if (char === '/') {
            env.closingNode = true;
        }
        else {
            bufferTagNameChar(char);
        }
    }
    function enterAttributes() {
        // console.log('enter attributes');
    }
    function exitAttributes() {
        // console.log('exit attributes');
    }
    function handleAttributesChar(char) {
        if (env.attrState === 'value') {
            bufferAttributeChar(char);
        }
        else {
            if (char === '>') {
                if (env.maybeLambda) {
                    transition('lambda');
                    env.maybeLambda = false;
                }
                else {
                    transition('children');
                }
            }
            else if (char === '/') {
                env.selfClosing = true;
                env.closingNode = true;
            }
            else if (char.match(exports.WHITESPACE)) {
                if (env.attrValueTerminator && ' '.match(env.attrValueTerminator)) {
                    saveBufferedAttribute();
                }
                else {
                }
            }
            else if (char === '=') {
                // If there is no attribute name, it may be a lambda
                // The next scan will confirm if the > is also passed
                if (env.attributeNameBuffer == '') {
                    env.maybeLambda = true;
                }
                else {
                    env.attrState = 'value';
                }
            }
            else {
                bufferAttributeChar(char);
            }
        }
    }
    /**
     * Entering children does the following:
     *
     * - creates the ASTNode for the tagName which was just defined
     * - adds attributes
     * - creates a new scope which is nested on the current scope
     */
    function enterChildren() {
        // If the last node is a closing node, go up a scope
        // Otherwise create a child scope
        if (env.closingNode) {
            testClosingTag();
            setCurrentScopeToParent();
        }
        else {
            createChildScope();
        }
        // Entering children resets closingNode state
        env.closingNode = false;
        env.selfClosing = false;
    }
    function testClosingTag() {
        if (env.currentScope.parent) {
            const testNode = env.selfClosing
                ? env.currentScope.astBuffer[env.currentScope.astBuffer.length - 1]
                : env.currentScope.parent.astBuffer[env.currentScope.parent.astBuffer.length - 1];
            if (testNode.tagName !== env.tagNameBuffer) {
                throw new SyntaxError('unbalanced tags');
            }
        }
        else {
        }
    }
    function setCurrentScopeToParent() {
        const parentScope = env.currentScope.parent;
        if (!env.currentScope.parent) {
            // we must be at the root scope already
            return;
        }
        env.currentScope = env.currentScope.parent;
    }
    function createChildScope() {
        const newScope = {
            currentNode: null,
            currentLambda: null,
            children: [],
            astBuffer: [],
            parent: env.currentScope
        };
        env.currentScope.children.push(newScope);
        env.currentScope = newScope;
    }
    function exitChildren() {
        // console.log('exit children');
    }
    function handleChildrenChar(char) {
        if (char === '<') {
            transition('tagName');
        }
    }
    function saveBufferedAttribute() {
        if (!env.attributeValueBuffer) {
            throw new SyntaxError('no value for attribute');
        }
        if (env.attrValueIsBinding) {
            saveAttributeBinding();
            resetAttributeState();
        }
        else {
            // Try parsing the json and if it throws an exception that is a JSON unexpected
            // end of input, we should continue buffering... if we get to the end of the buffer then we error out
            try {
                saveAttributeJSObject();
                resetAttributeState();
            }
            catch (e) {
                // TODO this might be flaky way to catch JSON errors
                if (e.message !== 'Unexpected end of JSON input') {
                    throw e;
                }
            }
        }
    }
    function saveAttributeBinding() {
        if (env.currentScope.currentNode) {
            env.currentScope.currentNode.attributes.push({
                type: 'binding',
                identifier: env.attributeNameBuffer,
                // strip the start and ending curly braces
                value: env.attributeValueBuffer.slice(1, env.attributeValueBuffer.length - 1)
            });
        }
    }
    function saveAttributeJSObject() {
        const json = JSON.parse(env.attributeValueBuffer);
        if (env.currentScope.currentNode) {
            env.currentScope.currentNode.attributes.push({
                type: 'jsobject',
                identifier: env.attributeNameBuffer,
                value: json
            });
        }
        else {
            throw new SyntaxError('currentNode should not be null');
        }
    }
    // Reset and get ready for next attribute
    function resetAttributeState() {
        env.attrValueIsBinding = false;
        env.attrValueMaybeBinding = false;
        env.attributeNameBuffer = '';
        env.attributeValueBuffer = '';
        env.attrState = 'name';
        env.attrValueTerminator = null;
    }
    function saveNodeToScope() {
        const newNode = {
            tagName: env.tagNameBuffer,
            attributes: [],
            children: []
        };
        // Store reference in astBuffer
        env.currentScope.astBuffer.push(newNode);
        // Set the currentNode to this node so attributes get added correctly
        env.currentScope.currentNode = newNode;
        // Associate with the parent node
        if (env.currentScope.parent) {
            if (env.currentScope.parent.currentNode) {
                // If the parent scope has a lambda, add this node to the lambdas children
                if (env.currentScope.parent.currentLambda) {
                    env.currentScope.parent.currentLambda.children.push(newNode);
                }
                else {
                    env.currentScope.parent.currentNode.children.push(newNode);
                }
            }
            else {
                throw new SyntaxError('how did we get into this state?');
            }
        }
        else {
        }
    }
    function bufferTagNameChar(char) {
        env.tagNameBuffer += char;
    }
    function isNumber(char) {
        return !isNaN(char);
    }
    function setAttrValueTerminator(char) {
        if (env.attrValueMaybeBinding) {
            if (!char.match(exports.WHITESPACE)) {
                // JSON objects always have a double quote as the next characters
                // After the opening object, bindings never do
                if (char !== '"') {
                    env.attrValueIsBinding = true;
                }
                // Both objects and bindings have the same terminator
                env.attrValueTerminator = /}/;
            }
            else {
            }
        }
        else {
            // Numbers, true, or false are whitespace terminated
            if (isNumber(char) || char === 't' || char === 'f') {
                env.attrValueTerminator = exports.WHITESPACE;
            }
            else if (char === '"') {
                env.attrValueTerminator = /"/;
            }
            else if (char === "{") {
                // Defer deciding terminator until later
                env.attrValueMaybeBinding = true;
            }
            else if (char === '[') {
                env.attrValueTerminator = /]/;
            }
            else {
                throw new SyntaxError(`${env.attributeNameBuffer} must be a valid JSON value`);
            }
        }
    }
    function bufferAttributeChar(char) {
        if (env.attrState === 'name') {
            env.attributeNameBuffer += char;
        }
        else {
            env.attributeValueBuffer += char;
            // If this hasn't been set yet then set it here
            if (!env.attrValueTerminator) {
                setAttrValueTerminator(char);
            }
            else {
                if (char.match(env.attrValueTerminator)) {
                    saveBufferedAttribute();
                }
            }
        }
    }
    function testForBadJson() {
        if (env.state === 'attributes' && env.attrState === 'value') {
            throw new SyntaxError(`${env.attributeNameBuffer} has a bad value.`);
        }
    }
    function enterLambda() {
        // Create lambda node
        const newNode = {
            type: 'lambda',
            bindings: [],
            children: []
        };
        if (env.currentScope.currentNode) {
            env.currentScope.currentNode.attributes.push(newNode);
        }
        env.currentScope.currentLambda = newNode;
        env.lambdaBindingBuffer = '';
    }
    function exitLambda() {
        // console.log('exit lambda');
    }
    function handleLambdaChar(char) {
        if (char === ',') {
            saveLambdaBinding();
        }
        else if (char === '>') {
            saveLambdaBinding();
            transition('children');
        }
        else if (char.match(exports.WHITESPACE)) {
        }
        else {
            env.lambdaBindingBuffer += char;
        }
    }
    function saveLambdaBinding() {
        if (env.lambdaBindingBuffer.match(es6_identifier_regex_1.ES2015_IDENTIFIER)) {
            if (env.currentScope.currentLambda) {
                env.currentScope.currentLambda.bindings.push(env.lambdaBindingBuffer);
            }
            else {
                throw new SyntaxError('lambda not defined');
            }
        }
        else {
            throw new SyntaxError(`${env.lambdaBindingBuffer} is not an ES2015 compatible identifier.`);
        }
        env.lambdaBindingBuffer = '';
    }
    function scan(source) {
        for (var i = 0; i < source.length; i++) {
            const char = source.charAt(i);
            // increment column count
            env.column += 1;
            // TODO: windows newlines?
            if (char === '\n') {
                env.line += 1;
                env.column = 0;
            }
            env.handleChar(char);
        }
    }
    scan(source);
    testForBadJson();
    if (env.rootScope.astBuffer.length === 0) {
        throw new SyntaxError('no nodes defined');
    }
    // Return first node
    return env.rootScope.astBuffer[0];
}
exports.parse = parse;
//# sourceMappingURL=parser.js.map