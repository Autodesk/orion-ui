export declare type Attribute = Binding | JSObject | Lambda;
export declare const WHITESPACE: RegExp;
export interface Lambda {
    type: 'lambda';
    bindings: string[];
    children: ASTNode[];
}
export interface JSObject {
    type: 'jsobject';
    identifier: string;
    value: any;
}
export interface Binding {
    type: 'binding';
    identifier: string;
    value: string;
}
export interface ASTNode {
    tagName: string;
    attributes: Attribute[];
    children: ASTNode[];
}
/**
 * Read source in and return ASTNode
 */
export declare function parse(source: string): ASTNode;
