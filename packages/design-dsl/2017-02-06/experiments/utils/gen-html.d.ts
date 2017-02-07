import { Primitive } from '../primitives';
export interface OHTMLElement {
    type: string;
    classList?: string[];
    children?: OHTMLElement[];
}
export interface OContainerElement extends OHTMLElement {
    type: 'div';
}
export interface OTextElement extends OHTMLElement {
    type: 'span';
    textContent: string;
}
export interface OImageElement extends OHTMLElement {
    type: 'image';
    src: string;
    height?: number;
    width?: number;
}
/**
 * Transforms a primitive into HTML
 */
export declare function primitiveToHtml(primitive: Primitive): OHTMLElement;
