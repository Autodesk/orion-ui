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
const replaceRaf = require('raf-stub').replaceRaf;

replaceRaf();

const RenderQueue = require('./render-queue');
const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.use(sinonChai);

const expect = chai.expect;

describe('Utils.RenderQueue', () => {
  let renderQueue;

  beforeEach(() => {
    renderQueue = new RenderQueue();
  });

  afterEach(() => {
    renderQueue.flush();
  });

  describe('#add', () => {
    context('called 3 times', () => {
      let element;

      beforeEach(() => {
        element = { _render: sinon.spy() };
        renderQueue.add(element);
        renderQueue.add(element);
        renderQueue.add(element);
      });

      context('after the next animation frame', () => {
        beforeEach(() => {
          requestAnimationFrame.step();
        });

        it('calls the callback once', () => {
          expect(element._render).to.have.been.calledOnce;
        });
      });

      context('after two frames', () => {
        beforeEach(() => {
          requestAnimationFrame.step(2);
        });

        it('is called only once', () => {
          expect(element._render).to.have.been.calledOnce;
        });
      });

    });

    context('when a render triggers another render', () => {
      let parentElement;
      let childElement;
      let childRender;

      beforeEach(() => {
        childRender = sinon.spy();

        childElement = { _render: childRender };
        parentElement = { _render: () => { renderQueue.add(childElement); } };

        renderQueue.add(parentElement);
      });

      it('gets called on the next frame', () => {
        requestAnimationFrame.step();
        expect(childRender).not.to.have.been.called;
        requestAnimationFrame.step();
        expect(childRender).to.have.been.calledOnce;
      });
    });

    context('with 3 different elements', () => {
      const element1 = { _render: sinon.spy() };
      const element2 = { _render: sinon.spy() };
      const element3 = { _render: sinon.spy() };

      beforeEach(() => {
        renderQueue.add(element1);
        renderQueue.add(element2);
        renderQueue.add(element3);
        requestAnimationFrame.step();
      });

      it('renders each of them once', () => {
        expect(element1._render).to.have.been.calledOnce;
        expect(element2._render).to.have.been.calledOnce;
        expect(element3._render).to.have.been.calledOnce;
      });
    });
  });

  describe('#flush', () => {
    const element = { _render: sinon.spy() };

    beforeEach(() => {
      renderQueue.add(element);
    });

    it('calls all queued callbacks synchronously', () => {
      renderQueue.flush();
      expect(element._render).to.have.been.calledOnce; // eslint-disable-line no-unused-expressions
    });
  });
});
