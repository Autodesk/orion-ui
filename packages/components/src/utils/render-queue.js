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
let instance = null;

class RenderQueue {
  constructor() {
    if (!instance) {
      instance = this;
    }

    this.queue = new Set();
    this.flush = this.flush.bind(this);

    return instance;
  }

  add(element) {
    this.queue.add(element);
    if (this._renderQueued) { return; }

    this._renderQueued = true;
    requestAnimationFrame(this.flush);
  }

  flush() {
    const elements = new Set(this.queue);
    this.queue.clear();
    this._renderQueued = false;

    elements.forEach((element) => {
      element._render(); // eslint-disable-line no-underscore-dangle
    });
  }
}

module.exports = RenderQueue;
