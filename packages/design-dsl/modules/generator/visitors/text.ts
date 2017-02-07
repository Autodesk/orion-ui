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