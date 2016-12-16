export type Color = 'black' | 'white' | 'grey';
export type Display = 'inline' | 'flex';
export type FontFamily = 'san-serif' | 'serif' | 'monospace';
export type FontSize = 'f1' | 'f2' | 'f3' | 'f4' | 'f5';
export type FontStyle = 'normal' | 'italic';
export type FontWeight = 'normal' | 'bold' | 'fw1' | 'fw2'
export type Layout = 'column' | 'row';
export type LineHeight = 'solid' | 'title' | 'copy';
export type Measure = 'measure' | 'wide' | 'narrow';
export type Spacing = 'small' | 'medium' | 'large';
export type TextAlign = 'left' | 'right' | 'center';
export type TextDecoration = 'strike' | 'underline' | 'no-underline';
export type TextTransform = 'capitalize' | 'lowercase' | 'uppercase';
export type Tracking = 'tracked' | 'tight' | 'mega';

export type Primitive = OContainer | OText | OImage;

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
  },

  src?: string;

}