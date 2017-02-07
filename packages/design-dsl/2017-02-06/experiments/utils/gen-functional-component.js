"use strict";
const cloneDeep = require("clone-deep");
function primitiveToComponent(p, registry = {}) {
    return (props) => flattenPrimitive(p, props, registry);
}
exports.primitiveToComponent = primitiveToComponent;
function flattenPrimitive(p, props, registry) {
    visit(p, (container, node) => {
        switch (node.type) {
            case 'map':
                if (container) {
                    const prevIndex = container.children.indexOf(node);
                    // remove node and splice in new children
                    const newChildren = mapPrimitive(node, props);
                    container.children.splice(prevIndex, 1, ...newChildren);
                }
                else {
                    throw new Error('need a container for map');
                }
                break;
            case 'component':
                // Guard not registered
                if (!registry[node.component.type]) {
                    throw new Error(`${node.component.type} must be in the Component Registry`);
                }
                if (container) {
                    // get the template from the registry
                    const template = registry[node.component.type];
                    // create a primitive out of item
                    const primitive = flattenPrimitive(template, node.component.props, registry);
                    // slice it into place
                    const prevIndex = container.children.indexOf(node);
                    container.children.splice(prevIndex, 1, primitive);
                }
                else {
                    throw new Error('need a container for components');
                }
            default:
        }
    });
    return p;
}
exports.flattenPrimitive = flattenPrimitive;
function visit(root, callbackFn) {
    let lastContainer;
    function recur(node) {
        const newNode = callbackFn(lastContainer, node);
        if (node.type === 'container') {
            lastContainer = node;
            const newChildren = lastContainer.children.forEach(recur);
        }
        else {
        }
    }
    return recur(root);
}
exports.visit = visit;
/**
 * Given image.props.width => ['image', 'props', 'width]
 * Given children[0].props.width => ['children', 0, 'props', 'width']
 */
function convertToKeypath(str) {
    const basicPath = str.split('.');
    return basicPath.map(part => {
        const v = part.match(/(.+)\[(.)\]/);
        if (v) {
            return [v[1], v[2]];
        }
        else {
            return [part];
        }
    }).reduce((acc, memo) => {
        return acc.concat(memo);
    }, []);
}
function mapPrimitive(p, props) {
    const collection = props[p.collection];
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
                const obj = newPath.reduce((spot, key) => {
                    // Create a new object if that key doesn't exist
                    if (!spot[key]) {
                        spot[key] = {};
                        return spot[key];
                    }
                    else {
                        return spot[key];
                    }
                }, clone);
                obj[propertyName] = propertyValue;
            }
            else {
                // new path is minus the last bit
                const newPath = path.slice(1, path.length - 1);
                // Start at the clone and move inwards until we find the Object
                // containing the property we want to modify
                const obj = newPath.reduce((spot, key) => {
                    // Create a new object if that key doesn't exist
                    if (!spot[key]) {
                        return {};
                    }
                    else {
                        return spot[key];
                    }
                }, clone);
                obj[propertyName] = propertyValue;
            }
        });
        return clone;
    });
}
//# sourceMappingURL=gen-functional-component.js.map