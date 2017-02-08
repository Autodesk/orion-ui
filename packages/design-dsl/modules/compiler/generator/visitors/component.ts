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

import { IOutput, IVisitor } from '../../types';

export default class ComponentVisitor implements IVisitor {
  public tagName: string = 'component';

  visit(output: IOutput) {
    output.save(this._getClass(output));

    output.saveDeferred(
      ['initial', 'mount', 'update', 'teardown'],
      ([initial, mount, update, teardown]: Function[]) =>
        `
        function render(props) {
          ${initial()}

          return {
            mount: target => {
              ${mount()}
            },

            update: (changed, props) => {
              ${update()}
            },

            teardown: () => {
              ${teardown()}
            }
          }
        }
      `);
  }

  _getClass(output: IOutput) {
    return `
      export default class ${output.getBaseName()} {
        constructor(mount, props) {
          this._props = props;
          this._fragment = render(this._props, this);
          this._fragment.mount(mount);
        }

        get(key) {
          return key ? this._props[key] : this._props;
        }

        set(newProps) {
          const oldProps = this._props;
          this._props = Object.assign({}, oldProps, newProps);
          this._fragment.update(newProps, this._props);
        }

        teardown() {
          this._fragment.teardown();
          this._fragment = null;
          this._props = {};
        }
      }
    `
  }
}