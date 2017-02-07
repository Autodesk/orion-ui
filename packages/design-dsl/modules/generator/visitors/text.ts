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
interface TextOptions {
  prefix: string;
  props: Props;
}

interface Props {
  size: number;
  content: string;
}

class TextVisitor {
  private prefix: string;
  private props: Props;

  constructor({ props, prefix }: TextOptions) {
    this.prefix = prefix;
    this.props = props;
  }

  getInitial(): string {
    return `
    const ${this.prefix} = document.createElement('span');
    text1.classList = '${this._getClassList()}'
    ${this._getContentSetup()}
    `
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
        const ${this.prefix}ContentMessage = new IntlMessageFormat()

        // create text node

        // update text node
      `
    }
  }
  _getClassList(): string {
    return '';
  }
}