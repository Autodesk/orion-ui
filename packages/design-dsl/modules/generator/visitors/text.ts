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
import { IWalker } from '../walker';
import { IVisitor } from './visitor';

export interface Props {
  size: number;
  content: string;
}

export default class TextVisitor implements IVisitor {
  public tagName: string = 'text';

  private prefix: string;
  private props: Props;

  private walker: IWalker;

  visit(walker: IWalker): void {
    this.walker = walker;
    this.prefix = this.walker.getIdentifier();
    this.props = this.walker.getProps<Props>();
  }

  getInitial(): string {
    return `
      const ${this.prefix} = document.createElement('span');

      ${this.prefix}.classList = '${this._getClassList()}'

      ${this._getContentSetup()}
    `
  }

  getMount(): string {
    return `
      // mount text
      target.appendChild(${this.prefix});
    `;
  }

  getUpdate(): string {
    if (!this.props.content) {
      return '';
    } else {
      return `
        // update content
        ${this.prefix}Content.data = ${this.prefix}ContentMessage.format(props);
      `;
    }
  }

  getTeardown(): string {
    return `
      // unmount text
      ${this.prefix}.parentNode.removeChild(${this.prefix});
    `;
  }

  getDependencies(): string {
    // TODO: figure out how to de-dupe these imports
    return `
      import IntlMessageFormat from 'intl-messageformat';
    `
  }

  _getContentSetup(): string {
    if (!this.props.content) {
      return '';
    } else {
      return `
        // create message
        const ${this.prefix}ContentMessage = new IntlMessageFormat("${this.props.content}", "en-US");

        // create text node
        const ${this.prefix}Content = document.createTextNode();

        // update text node
        ${this.prefix}Content.data = ${this.prefix}ContentMessage.format(props);

        // mount text node
        ${this.prefix}.appendChild(${this.prefix}Content);
      `;
    }
  }
  _getClassList(): string {
    return 'size-3';
  }
}