/* eslint-env jest */
/* eslint-disable no-unused-expressions */
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
import chai, { expect } from 'chai';

const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.use(sinonChai);

const replaceRaf = require('raf-stub').replaceRaf;

replaceRaf();

const RenderQueue = require('./render-queue');

describe('Utils.RenderQueue', () => {
  let renderQueue;

  beforeEach(() => {
    renderQueue = new RenderQueue();
  });

  afterEach(() => {
    renderQueue.flush();
  });

  describe('#add', () => {
    describe('called 3 times', () => {
      let element;

      beforeEach(() => {
        element = { render: sinon.spy() };
        renderQueue.add(element);
        renderQueue.add(element);
        renderQueue.add(element);
      });

      describe('after the next animation frame', () => {
        beforeEach(() => {
          requestAnimationFrame.step();
        });

        it('calls the callback once', () => {
          expect(element.render).to.have.been.calledOnce;
        });
      });

      describe('after two frames', () => {
        beforeEach(() => {
          requestAnimationFrame.step(2);
        });

        it('is called only once', () => {
          expect(element.render).to.have.been.calledOnce;
        });
      });
    });

    describe('when a render triggers another render', () => {
      let parentElement;
      let childElement;
      let childRender;

      beforeEach(() => {
        childRender = sinon.spy();

        childElement = { render: childRender };
        parentElement = { render: () => { renderQueue.add(childElement); } };

        renderQueue.add(parentElement);
      });

      it('gets called in that animation frame', () => {
        requestAnimationFrame.step();
        expect(childRender).to.have.been.calledOnce;
      });
    });

    describe('with 3 different elements', () => {
      const element1 = { render: sinon.spy() };
      const element2 = { render: sinon.spy() };
      const element3 = { render: sinon.spy() };

      beforeEach(() => {
        renderQueue.add(element1);
        renderQueue.add(element2);
        renderQueue.add(element3);
        requestAnimationFrame.step();
      });

      it('renders each of them once', () => {
        expect(element1.render).to.have.been.calledOnce;
        expect(element2.render).to.have.been.calledOnce;
        expect(element3.render).to.have.been.calledOnce;
      });
    });
  });

  describe('#flush', () => {
    const element = { render: sinon.spy() };

    beforeEach(() => {
      renderQueue.add(element);
    });

    it('calls all queued callbacks synchronously', () => {
      renderQueue.flush();
      expect(element.render).to.have.been.calledOnce;
    });
  });

  describe('#clearQueue', () => {
    let parentElement;
    let childElement;
    let childRender;

    beforeEach(() => {
      childRender = sinon.spy();

      childElement = { render: childRender };
      parentElement = { render: () => { renderQueue.add(childElement); } };

      renderQueue.add(parentElement);
    });

    it('calls flush until queue has been cleared', () => {
      expect(renderQueue.queue.size).to.eq(1);
      renderQueue.clearQueue();
      expect(childElement.render).to.have.been.calledOnce;
      expect(renderQueue.queue.size).to.eq(0);
    });
  });
});
