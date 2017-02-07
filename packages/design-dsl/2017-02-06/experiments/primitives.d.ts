export declare type Color = 'black' | 'white' | 'grey';
export declare type Display = 'inline' | 'flex';
export declare type FontFamily = 'san-serif' | 'serif' | 'monospace';
export declare type FontSize = 'f1' | 'f2' | 'f3' | 'f4' | 'f5';
export declare type FontStyle = 'normal' | 'italic';
export declare type FontWeight = 'normal' | 'bold' | '100' | '200';
export declare type Layout = 'column' | 'row';
export declare type LineHeight = 'solid' | 'title' | 'copy';
export declare type Measure = 'measure' | 'wide' | 'narrow';
export declare type Spacing = 'small' | 'medium' | 'large';
export declare type TextAlign = 'left' | 'right' | 'center';
export declare type TextDecoration = 'strike' | 'underline' | 'no-underline';
export declare type TextTransform = 'capitalize' | 'lowercase' | 'uppercase';
export declare type Tracking = 'tracked' | 'tight' | 'mega';
export declare type Primitive = OContainer | OText | OImage | OComponent | OMapper;
export interface OContainer {
    type: 'container';
    props?: {
        background?: Color;
        color?: Color;
        display?: Display;
        gap?: Spacing;
        layout?: Layout;
        marginAll?: Spacing;
        paddingAll?: Spacing;
    };
    children: Primitive[];
}
export interface OText {
    type: 'text';
    props?: {
        color?: Color;
        fontFamily?: FontFamily;
        fontSize?: FontSize;
        fontStyle?: FontStyle;
        fontWeight?: FontWeight;
        lineHeight?: LineHeight;
        measure?: Measure;
        textAlign?: TextAlign;
        textDecoration?: TextDecoration;
        textTransform?: TextTransform;
        tracking?: Tracking;
    };
    textContent?: string;
}
export interface OImage {
    type: 'image';
    props?: {
        width?: number;
        height?: number;
    };
    src?: string;
}
export interface OComponent {
    type: 'component';
    component: {
        type: string;
        props: {};
        children?: any[];
    };
}
export interface Mapping {
    source: string;
    destination: string;
}
export interface OMapper {
    type: 'map';
    collection: string;
    refs: {
        [key: string]: string;
    };
    mappings: Mapping[];
    template: Primitive;
}
