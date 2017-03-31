/**
Copyright 2016 Autodesk,Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/
import { PropTypes } from 'react';

import HIG from './HIG.Web';
import higify from './higify';

export const OrionHIG = higify({
  displayName: 'HIG',

  childContext: PropTypes.shape({
    addMenu: PropTypes.func.isRequired
  }),

  createContext() {
    return new HIG();
  },

  mountContext(instance, mountPoint, anchorPoint) {
    instance.mount(mountPoint, anchorPoint);
  },

  update(instance, props) {
    // nothing to update
  }
});

export const Menu = higify({
  displayName: 'Menu',

  parentContext: {
    type: 'HIG',
    shape: PropTypes.shape({
      addMenu: PropTypes.func.isRequired
    })
  },

  childContext: PropTypes.shape({
    addSidebar: PropTypes.func.isRequired
  }),

  create(props, { parent }) {
    return parent.addMenu({});
  },

  update(instance, props) {
    // nothing to update
  }
});

export const Sidebar = higify({
  displayName: 'Sidebar',

  parentContext: {
    type: 'Menu',
    shape: PropTypes.shape({
      addSidebar: PropTypes.func.isRequired
    })
  },

  childContext: PropTypes.shape({
    addGroup: PropTypes.func.isRequired
  }),

  create(props, { parent }) {
    return parent.addSidebar({
      open: props.open
    });
  },

  update(instance, props) {
    instance.setOpen(props.open);
  }
});

Sidebar.Group = higify({
  displayName: 'Sidebar.Group',

  parentContext: {
    type: 'Sidebar',
    shape: PropTypes.shape({
      addGroup: PropTypes.func.isRequired
    })
  },

  childContext: PropTypes.shape({
    addGroupItem: PropTypes.func.isRequired
  }),

  create(props, { parent }) {
    let size = '';

    if (props.small) {
      size = 'small';
    } else {
      size = 'large';
    }

    return parent.addGroup({
      size: size
    });
  },

  update(instance, props) {
    let size = '';

    if (props.small) {
      size = 'small';
    } else {
      size = 'large';
    }

    instance.setSize(size)
  }
})

Sidebar.Item = higify({
  displayName: 'Sidebar.Item',

  parentContext: {
    type: 'Sidebar.Group',
    shape: PropTypes.shape({
      addGroupItem: PropTypes.func.isRequired
    })
  },

  create(props, { parent }) {
    return parent.addGroupItem({
      title: props.children,
      onClick: props.onClick
    });
  },

  update(instance, props) {
    instance.setTitle(props.children);
    instance.setOnClick(props.onClick);
  }
});