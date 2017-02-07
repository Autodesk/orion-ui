import { Primitive, OContainer } from '../primitives';
export declare function primitiveToComponent<T>(p: Primitive, registry?: ComponentRegistry): (obj: T) => Primitive;
export interface ComponentRegistry {
    [key: string]: Primitive;
}
export declare function flattenPrimitive<T>(p: Primitive, props: any, registry: ComponentRegistry): Primitive;
export declare function visit<T extends Primitive>(root: T, callbackFn: (container: OContainer | null, node: T) => void): void;
