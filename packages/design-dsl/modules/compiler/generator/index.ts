import { Node, IVisitor, IOutput } from '../types';

import OrionVisitor from './visitors/orion';
import ComponentVisitor from './visitors/component';
import TextVisitor from './visitors/text';

import AtomRegistry from '../atom-registry';

const visitors: IVisitor[] = [
  new OrionVisitor(),
  new ComponentVisitor(),
  new TextVisitor()
];

// Platform specific APIs
// TODO should be injected
import Host from '../host';

interface ReqRegistration {
  /**
   * The depth of the scope when the registration was created
   */
  depth: number;
  /**
   * The index that we should insert the source to when it's fullfilled
   */
  sourceInsertionIndex: number;

  /**
   * The list of requirements for child nodes
   */
  reqs: string[];

  /**
   * The callback which returns source once the child sources are available
   */
  deffered: (deps: string[]) => string;

  /**
   * The source that child nodes fullfill for a given requirement
   */
  fullfillments: { req: string, source: string }[]
}

function findRegistrationsByDepth(registrations: ReqRegistration[], depth: number): ReqRegistration[] {
  return registrations
    .filter(value => value.depth === depth);
}

function findReqsByDepth(registrations: ReqRegistration[], depth: number): string[] {
  return findRegistrationsByDepth(registrations, depth)
    .reduce((acc: string[], memo: ReqRegistration) => {
      return [...acc, ...memo.reqs];
    }, []);
}

class Output implements IOutput {
  private filename: string;
  private _source: string[];
  private _imports: string[];
  private _currentDepth: number;
  private _currentNode: Node | undefined;

  private _atomRegistry: AtomRegistry;

  /**
   * Used to generate valid identifiers for each visit of a tagName
   *
   * Key = tagName
   * Value = counter to keep track of how many tags have been specified
   */
  private _idCounters: { [key: string]: number };

  private _reqRegistrations: ReqRegistration[];

  constructor(filename: string) {
    this.filename = filename;
    this._source = [];
    this._imports = [];

    this._currentDepth = 0;
    this._reqRegistrations = [];
    this._idCounters = {};

    this._atomRegistry = new AtomRegistry(Host.getAtomDb());
  }

  setDepth(depth: number): void {
    // if transitioning UP we should check for deferred source and process it
    // make sure to remove the deferred registration afterwards
    if (depth < this._currentDepth) {
      this._resolveDeferreds(depth);
    }

    this._currentDepth = depth;
  }

  setCurrentNode(node: Node): void {
    this._currentNode = node;
  }

  // Find all deferred registrations at this depth
  _resolveDeferreds(depth: number): void {
    // Remove registrations at this depth
    const removeIndexes: number[] = [];

    findRegistrationsByDepth(this._reqRegistrations, depth).forEach((value, index) => {
      removeIndexes.push(index);

      // deps are resolved in the order they are requested
      const deps: string[] = [];

      // for each requirement
      value.reqs.forEach(req => {
        let concatSource = '';

        // combine the source for all fullfillments for a given requirement
        value.fullfillments.filter(fullfillment => fullfillment.req === req).forEach(fullfillment => {
          concatSource += fullfillment.source;
        });

        // And store it in the dep
        deps.push(concatSource);
      });

      // After all deps are resolved, call the deferred callback to get the source
      const source = value.deffered(deps);

      // Insert the source into the insertion index
      this._source.splice(value.sourceInsertionIndex, 0, source);
    });

    removeIndexes.forEach(removalIndex => {
      this._reqRegistrations.splice(removalIndex, 1);
    });
  }

  /**
   * Transition from current depth to 0 to account for dangling state
   */
  unwind(): void {
    while (this._currentDepth !== 0) {
      this.setDepth(this._currentDepth - 1);
    }
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

  saveImport(importString: string): void {
    // TODO: figure out how to de-dupe these to prevent
    // naming collisions
    this._imports.push(importString);
  }

  saveDeferred(reqs: string[], cb: (deps: string[]) => string) {
    const registration: ReqRegistration = {
      depth: this._currentDepth,
      sourceInsertionIndex: this._source.length,
      reqs,
      deffered: cb,
      fullfillments: []
    };

    this._reqRegistrations.push(registration);
  }

  getRequirements(): string[] {
    return findReqsByDepth(this._reqRegistrations, this._currentDepth - 1);
  }

  fullFillReq(req: string, source: string): void {
    // find the parent registrations
    findRegistrationsByDepth(this._reqRegistrations, this._currentDepth - 1)
      .forEach(value => {
        value.fullfillments.push({ req, source });
      });
  }

  /**
   * Element stuff
   */

  /**
   * Returns a unique valid ES2015 identifier
   */
  getIdentifier(): string {
    if (!this._currentNode) {
      throw new Error('no current node');
    }

    const count = this._incCounterForTag(this._currentNode.name);

    // avoid using 0 as suffix for vanity
    let suffix = (count == 0) ? '' : count;

    return `${this._currentNode.name}${suffix}`;
  }

  /**
   * Given a tagName it returns a number which increments each time this counter is called
   */
  _incCounterForTag(tagName: string): number {

    // if the tag name doesn't exist, register it starting at 0
    if (!this._idCounters[tagName]) {
      this._idCounters[tagName] = 0;
    } else {
      // otherwise increment it by one
      this._idCounters[tagName] = this._idCounters[tagName] + 1;
    }

    return this._idCounters[tagName];
  }

  /**
   * Returns map of node attributes
   */
  getAttributes(): any {
    if (!this._currentNode) {
      return {};
    }

    if (!this._currentNode.attribs) {
      return {};
    }

    const tagName = this._currentNode.name;
    const attribs = this._currentNode.attribs;

    return Object.keys(attribs)
      // go through each attribute and convert JSON strings to JavaScript objects
      // flatten attributes array into a single keyed object
      .reduce((acc: any, name: string) => {
        const value = attribs[name];

        // TODO - move to validation
        // Atom's take priority...
        const validation = this._atomRegistry.validate(tagName, name, value);
        if (!validation.isAtomicAttribute) {
          acc[name] = value;
        } else if (validation.isAtomicAttribute && !validation.isElementAllowedAttribute) {
          console.error(`${tagName} is not allowed to use ${name}. Ignoring`);
        } else if (validation.isValidAtomValue) {
          acc[name] = value;
        } else {
          if (!validation.validValues) {
            console.error(`${value} is not a valid value for ${name}`);
          } else {
            console.error(`${value} is not a valid value for ${name}. Valid values: ${validation.validValues.join(', ')}`)
          }
        }

        return acc;
      }, {});
  }

  get source(): string {
    return Host.format(
      `
        ${this._imports.join('')}
        ${this._source.join('')}
      `
    );
  }
}

export default class Generator {
  generate(filename: string, node: Node): string {
    const output = new Output(filename);

    this.visit(node, 0, (node, depth) => {
      output.setDepth(depth);
      output.setCurrentNode(node);

      const visitor = visitors.find(visitor => visitor.tagName === node.name);

      if (!visitor) {
        throw new Error(`could not parse ${node.name}`);
      }

      visitor.visit(output);
    });

    output.unwind();

    return output.source;
  }

  visit(node: Node, depth: number, fn: (node: Node, depth: number) => void): void {
    fn(node, depth);

    if (node.children) {
      node.children.forEach(node => this.visit(node, depth + 1, fn))
    }
  }
}