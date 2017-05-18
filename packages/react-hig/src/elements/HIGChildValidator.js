import React from 'react';

const HIGChildValidator = validChildren =>
  (props, propName, componentName) => {
    const prop = props[propName];

    let error = null;
    React.Children.forEach(prop, function(child) {
      const getDisplayName = Component =>
        Component.displayName ||
        Component.name ||
        (typeof Component === 'string' ? Component : 'Component');

      const childDisplayName = getDisplayName(child.type || child);

      if (validChildren.indexOf(child.type) === -1) {
        error = new Error(
          `'${childDisplayName}' is not a valid child of ${componentName}. Children should be of type '${validChildren
            .map(c => c.displayName)
            .join(', ')}'.`
        );
      }
    });
    return error;
  };

export default HIGChildValidator;
