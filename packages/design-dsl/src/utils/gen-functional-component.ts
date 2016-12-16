import { Primitive, OMapper, OContainer } from '../primitives';
import * as cloneDeep from 'clone-deep';

export function primitiveToComponent<T>(p: Primitive): (obj: T) => Primitive {
  return (props: any) => {
    visit(p, (container, node) => {
      switch (node.type) {
        case 'map':
          if (container) {
            // remove node
            container.children.splice(container.children.indexOf(node), 1);

            // Merge mapped primitives into other children
            container.children = [
              ...container.children,
              ...mapPrimitive(node, props)
            ];
          }
        default:
        /* no-op */
      }
    });

    return p;
  }
}

export function visit<T extends Primitive>(root: T, callbackFn: (container: OContainer | null, node: T) => void): void {
  let lastContainer: OContainer | null;

  function recur(node: T): void {
    const newNode = callbackFn(lastContainer, node);

    if (node.type === 'container') {
      lastContainer = node as OContainer;
      const newChildren = lastContainer.children.forEach(recur);
    } else {
      lastContainer = null;
    }
  }

  return recur(root);
}

/**
 * Given image.props.width => ['image', 'props', 'width]
 * Given children[0].props.width => ['children', 0, 'props', 'width']
 */
function convertToKeypath(str: string): string[] {
  const basicPath = str.split('.');

  return basicPath.map(part => {
    const v = part.match(/(.+)\[(.)\]/);

    if (v) {
      return [v[1], v[2]];
    } else {
      return [part];
    }
  }).reduce((acc, memo) => {
    return acc.concat(memo);
  }, []);
}

function mapPrimitive(p: OMapper, props: any): Primitive[] {
  const collection = props[p.collection] as any[];
  const template = p.template;

  return collection.map(item => {
    const clone = cloneDeep(template);

    p.mappings.forEach(mapping => {
      const propertyValue = item[mapping.source];

      // Convert to path for easier traversal
      const path = convertToKeypath(mapping.destination);

      // get last key for property name
      const propertyName = path[path.length - 1];

      // look up the path in refs first
      // refs only work for the first part of a key path
      if (p.refs[path[0]]) {
        // prefix is the location in the template
        const prefix = convertToKeypath(p.refs[path[0]]);
        // new path is the prefix minus the last bit
        const newPath = [...prefix, ...path.slice(1, path.length - 1)];

        // Start at the clone and move inwards until we find the Object
        // containing the property we want to modify
        const obj = newPath.reduce((spot: any, key: string) => {
          // Create a new object if that key doesn't exist
          if (!spot[key]) {
            spot[key] = {};
            return spot[key];
          } else {
            return spot[key];
          }
        }, clone);

        obj[propertyName] = propertyValue;
      } else {
        // new path is minus the last bit
        const newPath = path.slice(1, path.length - 1);
        // Start at the clone and move inwards until we find the Object
        // containing the property we want to modify
        const obj = newPath.reduce((spot: any, key: string) => {
          // Create a new object if that key doesn't exist
          if (!spot[key]) {
            return {};
          } else {
            return spot[key];
          }
        }, clone);

        obj[propertyName] = propertyValue;
      }
    });

    return clone as Primitive;
  });
}
