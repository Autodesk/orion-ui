export declare const EOF_CHARACTER = "@@EOF@@";
export interface Attribute {
    type: 'json' | 'expression';
    name: string;
    value: string;
}
export declare function jsonAttr(name: string, value?: string): Attribute;
export declare function expressionAttr(name: string, value?: string): Attribute;
export interface Location {
    start: {
        line: number;
        column: number;
    };
    end: {
        line: number;
        column: number;
    };
}
export interface World {
    buffer: string;
    state: TokenizerState;
    currentToken: Token | null;
    currentAttribute: Attribute | null;
    currentLine: number;
    currentColumn: number;
    tokens: Token[];
}
/**
 * Convert OML source to an array of tokens
 *
 * - Split a source string into individual characters
 * - Start from an initial world state (initWorld()) and
 *   reduce over each character over the following transformations:
 *   - getNextToken(world, char)
 *   - getNextLocation(world, char)
 */
export declare function getTokens(source: string, existing?: World): World;
export declare function initWorld(): World;
export interface StartTag {
    type: 'start-tag';
    tagName: string;
    selfClosing: boolean;
    hasBlock: boolean;
    attributes: Attribute[];
    blockParameters: string[];
    location: Location;
}
export interface EndTag {
    type: 'end-tag';
    tagName: string;
    location: Location;
}
export interface Expression {
    type: 'expression';
    value: string;
    location: Location;
}
/**
 * Comments
 */
export interface Comment {
    type: 'comment';
    data: string;
    location: Location;
}
export declare type CommentState = 'comment-start' | 'comment-start-dash' | 'comment-end-dash' | 'comment' | 'comment-end';
export interface CreateComment {
    type: 'create-comment';
}
export interface AppendComment {
    type: 'append-comment';
    payload: string;
}
export interface EmitComment {
    type: 'emit-comment';
}
export declare type CommentAction = CreateComment | AppendComment | EmitComment;
export interface Character {
    type: 'character';
    location: Location;
    data: string;
}
export interface EOF {
    type: 'eof';
    location: Location;
}
export declare type TagToken = StartTag | EndTag;
export declare type Token = TagToken | Comment | Character | Expression | EOF;
export declare type TokenizerState = 'data' | 'expression' | 'tag-open' | 'markup-declaration-open' | 'end-tag-open' | 'tag-name' | 'before-attribute-name' | 'attribute-name' | 'after-attribute-name' | 'before-attribute-value' | 'attribute-value-string' | 'attribute-value-number' | 'attribute-value-array' | 'attribute-value-object-or-expression' | 'attribute-value-object' | 'attribute-value-expression' | 'after-attribute-value' | 'self-closing-start-tag' | 'before-block' | 'before-block-parameter' | 'block-parameter' | CommentState;
export interface OtherAction {
    type: '';
}
export declare function getNextToken(world: World, char: string): World;
export declare function getNextLocation(world: World, char: string): World;
export declare function character(data: string, line?: number, column?: number): Character;
export declare function spaces(count: number, startLine?: number, startColumn?: number): Character[];
export declare function word(word: string): Character[];
export declare function EOF(line?: number, column?: number): EOF;
export interface StartTagOptions {
    attributes: Attribute[];
    selfClosing: boolean;
    blockParameters: string[];
    location: Location;
}
export declare function startTag(tagName: string, options?: Partial<StartTagOptions>): StartTag;
export declare function expression(value: string, startLine?: number, startColumn?: number, endLine?: number, endColumn?: number): Expression;
export declare function endTag(tagName: string, location?: Location): EndTag;
export declare function comment(data?: string, startLine?: number, startColumn?: number, endLine?: number, endColumn?: number): Comment;
export declare class SyntaxError {
    message: string;
    location: {
        line: number;
        column: number;
    };
    constructor(message: string, world: World);
}
