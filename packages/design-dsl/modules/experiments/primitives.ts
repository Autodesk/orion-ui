/**
Copyright 2016 Autodesk,Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/
export type Color = 'black' | 'white' | 'grey';
export type Display = 'inline' | 'flex';
export type FontFamily = 'san-serif' | 'serif' | 'monospace';
export type FontSize = 'f1' | 'f2' | 'f3' | 'f4' | 'f5';
export type FontStyle = 'normal' | 'italic';
export type FontWeight = 'normal' | 'bold' | '100' | '200'
export type Layout = 'column' | 'row';
export type LineHeight = 'solid' | 'title' | 'copy';
export type Measure = 'measure' | 'wide' | 'narrow';
export type Spacing = 'small' | 'medium' | 'large';
export type TextAlign = 'left' | 'right' | 'center';
export type TextDecoration = 'strike' | 'underline' | 'no-underline';
export type TextTransform = 'capitalize' | 'lowercase' | 'uppercase';
export type Tracking = 'tracked' | 'tight' | 'mega';

export type Primitive = OContainer | OText | OImage | OComponent | OMapper;

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

export interface OComponent {
  type: 'component',
  component: {
    type: string;
    props: {},
    children?: any[];
  }
}


export interface Mapping {
  source: string;
  destination: string;
}

export interface OMapper {
  type: 'map',
  collection: string;
  refs: {
    [key: string]: string;
  }
  mappings: Mapping[];
  template: Primitive;
}
