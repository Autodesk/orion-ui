import { Primitive, OContainer, OText, OImage } from './primitives';

export interface Mapping {
  source: string;
  destination: string;
}

export interface Mapper {
  type: 'map',
  collection: string;
  refs: {
    [key: string]: string;
  }
  mappings: Mapping[];
  template: Primitive;
}

export type Transformation = Mapper;

export interface Component<T> {
  type: 'component';
  transformation: Transformation;
}
