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
import { Primitive, OContainer, OText, OImage } from '../primitives';

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
export function primitiveToHtml(primitive: Primitive): OHTMLElement {
  switch (primitive.type) {
    case 'container':
      return containerToHtml(primitive);
    case 'text':
      return textToHtml(primitive);
    case 'image':
      return imageToHtml(primitive);
    default:
      throw new Error('unknown type. maybe use primitiveToComponent');
  }
}

function containerToHtml(container: OContainer): OContainerElement {
  const type = 'div';
  const classList = [];

  if (container.props) {
    if (container.props.background) {
      classList.push(`bg-${container.props.background}`);
    }

    if (container.props.color) {
      classList.push(container.props.color);
    }

    if (container.props.display) {
      classList.push(container.props.display);
    }

    if (container.props.gap) {
      const direction = container.props.layout ? container.props.layout : 'column';
      classList.push(`gap-${direction}-${container.props.gap}`)
    }

    if (container.props.layout) {
      classList.push(`flex-direction-${container.props.layout}`);
    }

    if (container.props.marginAll) {
      classList.push(`margin-all-${container.props.marginAll}`);
    }

    if (container.props.paddingAll) {
      classList.push(`padding-all-${container.props.paddingAll}`);
    }
  }

  const children = container.children.map(primitiveToHtml);

  return { type, classList, children }
}

function textToHtml(text: OText): OTextElement {
  const type = 'span';
  const classList = [];

  if (text.props) {
    if (text.props.color) {
      classList.push(text.props.color);
    }

    if (text.props.fontFamily) {
      classList.push(text.props.fontFamily);
    }

    if (text.props.fontSize) {
      classList.push(text.props.fontSize);
    }

    if (text.props.fontStyle) {
      classList.push(`font-style-${text.props.fontStyle}`);
    }

    if (text.props.fontWeight) {
      classList.push(`font-weight-${text.props.fontWeight}`);
    }

    if (text.props.lineHeight) {
      classList.push(`lh-${text.props.lineHeight}`);
    }

    if (text.props.measure) {
      if (text.props.measure === 'measure') {
        classList.push('measure');
      } else {
        classList.push(`measure-${text.props.measure}`);
      }
    }

    if (text.props.textAlign) {
      classList.push(`text-align-${text.props.textAlign}`);
    }

    if (text.props.textDecoration) {
      classList.push(text.props.textDecoration);
    }

    if (text.props.textTransform) {
      classList.push(`text-transform-${text.props.textTransform}`);
    }

    if (text.props.textDecoration) {
      classList.push(`text-decoration-${text.props.textDecoration}`);
    }

    if (text.props.tracking) {
      if (text.props.tracking === 'tracked') {
        classList.push('tracked');
      } else {
        classList.push(`tracked-${text.props.tracking}`);
      }
    }
  }

  const textContent = (text.textContent) ? text.textContent : '';

  return { type, classList, textContent };
}

function imageToHtml(image: OImage): OImageElement {
  const type = 'image';

  const src = (image.src) ? image.src : '';

  let height, width;

  if (image.props) {
    if (image.props.height) {
      height = image.props.height;
    }

    if (image.props.width) {
      width = image.props.width;
    }
  }

  return {type, src, height, width};
}