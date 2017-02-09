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
import { IOutput, IVisitor } from '../../types';


export default class TextVisitor implements IVisitor {
  public tagName: string = 'text';

  private identifier: string;

  private content: string;
  private atoms: {[key: string]: string};

  visit(output: IOutput): void {
    this.identifier = output.getIdentifier();

    const attributes = output.getAttributes();

    // Split text specific attribute from atoms
    const { content, ...atoms } = attributes;
    this.content = content;
    this.atoms = atoms;

    if (this.content) {
      output.saveImport(`
        import IntlMessageFormat from 'intl-messageformat';
      `)
    }

    // get any deferred requirements
    const requirements = output.getRequirements();

    requirements.forEach(req => {
      switch (req) {
        case 'initial':
          output.fullFillReq(req, this.getInitial())
          break;
        case 'mount':
          output.fullFillReq(req, this.getMount());
          break;
        case 'update':
          output.fullFillReq(req, this.getUpdate());
          break;
        case 'teardown':
          output.fullFillReq(req, this.getTeardown())
          break;
        default:
          // do not handle
      }
    });
  }

  getInitial(): string {
    return `
      const ${this.identifier} = document.createElement('span');

      ${this.identifier}.classList = '${this._getClassList()}'

      ${this._getContentSetup()}
    `
  }

  getMount(): string {
    return `
      // mount text
      target.appendChild(${this.identifier});
    `;
  }

  getUpdate(): string {
    if (!this.content) {
      return '';
    } else {
      return `
        // update content
        ${this.identifier}Content.data = ${this.identifier}ContentMessage.format(props);
      `;
    }
  }

  getTeardown(): string {
    return `
      // unmount text
      ${this.identifier}.parentNode.removeChild(${this.identifier});
    `;
  }

  getDependencies(): string {
    // TODO: figure out how to de-dupe these imports
    return `
      import IntlMessageFormat from 'intl-messageformat';
    `
  }

  _getContentSetup(): string {
    if (!this.content) {
      return '';
    } else {
      return `
        // create message
        const ${this.identifier}ContentMessage = new IntlMessageFormat("${this.content}", "en-US");

        // create text node
        const ${this.identifier}Content = document.createTextNode();

        // update text node
        ${this.identifier}Content.data = ${this.identifier}ContentMessage.format(props);

        // mount text node
        ${this.identifier}.appendChild(${this.identifier}Content);
      `;
    }
  }
  _getClassList(): string {
    return Object.keys(this.atoms).reduce((classList: string, key: string) => {
      const value = this.atoms[key];
      classList += `${key}-${value}`;
      return classList;
    }, '');
  }
}