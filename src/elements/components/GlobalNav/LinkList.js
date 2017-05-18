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
import createComponent from '../../../adapters/createComponent';
import HIGNodeList from '../../HIGNodeList';

import LinkComponent, { Link } from './Link';

// Does not extend HIGElement because it's not a real HIG component
export class LinkList {
  constructor(higInstance) {
    this.hig = higInstance;
    this.links = new HIGNodeList();
  }

  mount() {
    this.mounted = true;

    for (let instance of this.links) {
      this.hig.addSection(instance.hig);
      instance.mount();
    }
  }

  unmount() {
    // no-op
  }

  commitUpdate(updatePayload, oldProps, newProps) {
    // no-op
  }

  createElement(ElementConstructor, props) {
    switch (ElementConstructor) {
      case Link:
        return new Link(this.hig.partials.Link, props);
      default:
        throw new Error(`Unknown type ${ElementConstructor.name}`);
    }
  }

  appendChild(instance) {
    if (instance instanceof Link) {
      this.links.appendChild(instance);

      if (this.mounted) {
        this.hig.addLink(instance.hig);
        instance.mount();
      }
    } else {
      throw new Error(`unknown type ${instance}`);
    }
  }

  insertBefore(instance, insertBeforeIndex) {
    const beforeChild = this.links.item(insertBeforeIndex);
    this.links.insertBefore(instance, beforeChild);
    this.hig.addLink(instance.hig, beforeChild.hig);
    instance.mount();
  }

  removeChild(instance) {
    const index = this.links.indexOf(instance);
    this.links.splice(index, 1);
    instance.unmount();
  }
}

const LinkListComponent = createComponent(LinkList);

LinkListComponent.Item = LinkComponent;

export default LinkListComponent;
