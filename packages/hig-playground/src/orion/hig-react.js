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
import 'hig.web/dist/hig.css';
import { Button as HIGButton } from 'hig.web';

import { PropTypes } from 'react';

import { Menu as HIGMenu } from '../hig.web';
import higify from './higify';

class ButtonWrapper {
  constructor(props) {
    this._hig = new HIGButton({
      title: props.title,
      link: props.link
    });

    if (props.onClick) {
      this.onClickDispose = this._hig.onClick(props.onClick);
    }
  }

  mount(mountNode, anchorNode) {
    this._hig.mount(mountNode, anchorNode);
  }

  teardown() {
    console.error('still no Button#unmount available');
    this._hig.el.parentNode.removeChild(this._hig.el);
  }

  applyProps(props, prevProps = {}) {
    if (props.title) {
      this._hig.setTitle(props.title);
    }

    if (props.link) {
      this._hig.setLink(props.link);
    }

    if (prevProps.onClick !== props.onClick) {
      this.onClickDispose();
    }

    if (props.onClick) {
      this.onClickDispose = this._hig.onClick(props.onClick);
    }
  }
}

export const Button = higify({
  displayName: 'HIG.Button',

  createContext(props) {
    return new ButtonWrapper(props);
  },

  mountContext(instance, mountNode, anchorNode) {
    instance.mount(mountNode, anchorNode);
  },

  update(instance, props, prevProps) {
    instance.applyProps(props, prevProps);
  }
});

export const Menu = higify({
  displayName: 'HIG.Menu',

  childContext: PropTypes.shape({
    addSidebar: PropTypes.func.isRequired
  }),

  createContext(props) {
    return new HIGMenu(props);
  },

  mountContext(instance, mountNode, anchorNode) {
    instance.mount(mountNode, anchorNode);
  },

  update(instance, props) {
    // nothing to update
  }
});

Menu.Top = higify({
  displayName: 'HIG.Menu.Top',

  parentContext: {
    type: 'HIG.Menu',
    shape: PropTypes.shape({
      addTop: PropTypes.func.isRequired
    })
  },

  create(props, { parent }) {
    if (!parent.addSlot) {
      console.error('Menu.Top must be inside a Menu');
    } else {
      return parent.addTop({
        onToggle: props.onToggle
      });
    }
  },

  update(instance, props) {
    instance.setOnToggle(props.onToggle);
  }
});

export const Slot = higify({
  displayName: 'HIG.Slot',

  type: 'slot',

  parentContext: {
    shape: PropTypes.shape({
      addSlot: PropTypes.func.isRequired
    })
  },

  create(props, { parent }) {
    if (!parent.addSlot) {
      console.error(
        'HIG.Slot must be inside a slottable component (example: Menu)'
      );
    } else {
      return parent.addSlot();
    }
  }
});

Menu.Sidebar = higify({
  displayName: 'HIG.Menu.Sidebar',

  parentContext: {
    type: 'HIG.Menu',
    shape: PropTypes.shape({
      addSidebar: PropTypes.func.isRequired
    })
  },

  childContext: PropTypes.shape({
    addGroup: PropTypes.func.isRequired
  }),

  create(props, { parent }) {
    if (!parent.addSidebar) {
      console.error('Sidebar must be inside a Menu');
    } else {
      return parent.addSidebar({
        open: props.open
      });
    }
  },

  update(instance, props) {
    instance.setOpen(props.open);
  }
});

Menu.Sidebar.Group = higify({
  displayName: 'HIG.Menu.Sidebar.Group',

  parentContext: {
    type: 'HIG.Menu.Sidebar',
    shape: PropTypes.shape({
      addGroup: PropTypes.func.isRequired
    })
  },

  childContext: PropTypes.shape({
    addGroupItem: PropTypes.func.isRequired
  }),

  create(props, { parent }) {
    if (!parent.addGroup) {
      console.error('Sidebar.Group must be inside a Sidebar');
    } else {
      let size = '';

      if (props.small) {
        size = 'small';
      } else {
        size = 'large';
      }

      return parent.addGroup({
        size: size
      });
    }
  },

  update(instance, props) {
    let size = '';

    if (props.small) {
      size = 'small';
    } else {
      size = 'large';
    }

    instance.setSize(size);
  }
});

Menu.Sidebar.Item = higify({
  displayName: 'HIG.Menu.Sidebar.Item',

  parentContext: {
    type: 'HIG.Menu.Sidebar.Group',
    shape: PropTypes.shape({
      addGroupItem: PropTypes.func.isRequired
    })
  },

  create(props, { parent }) {
    if (!parent.addGroupItem) {
      console.error('Sidebar.Item must be inside a Sidebar.Group');
    } else {
      return parent.addGroupItem({
        title: props.children,
        onClick: props.onClick,
        selected: props.selected
      });
    }
  },

  update(instance, props) {
    instance.setTitle(props.children);
    instance.setOnClick(props.onClick);
    instance.setSelected(props.selected);
  }
});
