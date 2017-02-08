export interface IWalker {
  /**
   * Return the basename of the input file
   */
  getBaseName(): string;


  /**
   * Save some source code
   */
  save(source: string): void


  /**
   * Component stuff
   */


  getInitial(): string;

  getMount(): string;

  getUpdate(): string;

  getTeardown(): string;


  /**
   * Element stuff
   */

  getIdentifier(): string;


  getProps<T>(): T;
}