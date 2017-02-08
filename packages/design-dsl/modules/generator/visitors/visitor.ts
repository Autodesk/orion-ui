import {IWalker} from '../walker';

export interface IVisitor {
  tagName: string;
  visit(walker: IWalker): void;
}

