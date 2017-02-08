import {Node, IVisitor, IOutput} from '../types';

import OrionVisitor from './visitors/orion';
import ComponentVisitor from './visitors/component';
import TextVisitor from './visitors/text';

const visitors: IVisitor[] = [
  new OrionVisitor(),
  new ComponentVisitor(),
  new TextVisitor()
];

// Platform specific APIs
// TODO should be injected
import Host from '../host';

class Output implements IOutput {
  private filename: string;
  private _source: string[];

  constructor(filename: string) {
    this.filename = filename;
    this._source = [];
  }

  /**
   * Returns the base file name without the extension
   */
  getBaseName(): string {
    return Host.basename(this.filename);
  }

  /**
   * Writes a string to the source immediately
   */
  save(source: string): void {
    this._source.push(source);
  }

  saveDeferred(reqs: string[], cb: (deps: Function[]) => string) {

  }

  /**
   * Component stuff
   */
  getInitial(): string {
    return 'initial';
  }

  getMount(): string {
    return 'mount';
  }

  getUpdate(): string {
    return 'update';
  }

  getTeardown(): string {
    return 'teardown';
  }

  /**
   * Element stuff
   */
  getIdentifier(): string {
    return 'someVar';
  }

  getProps(): any {
    return {};
  }

  get source(): string {
    return this._source.join('');
  }
}

export default class Generator {
  generate(filename: string, node: Node): string {
    const output = new Output(filename);

    this.visit(node, node => {
      const visitor = visitors.find(visitor => visitor.tagName === node.tagName);

      if (!visitor) {
        throw new Error(`could not parse ${node.tagName}`);
      }

      visitor.visit(output);
    });

    return output.source;
  }

  visit(node: Node, fn: (node: Node) => void): void {
    fn(node);

    if (node.children) {
      node.children.forEach(node => this.visit(node, fn))
    }
  }
}