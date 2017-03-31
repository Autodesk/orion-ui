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