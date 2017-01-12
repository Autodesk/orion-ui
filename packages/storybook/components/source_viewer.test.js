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
import 'jsdom-global/register';
import React from 'react';
import { mount } from 'enzyme';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import SourceViewer from './source_viewer';

chai.use(chaiEnzyme());

describe('<SourceViewer />', () => {
  let wrapper;

  before(() => {
    const props = {
      sources: [
        { label: 'React', source: '<Foo>It\'s a react component</Foo>' },
        { label: 'Web components', source: '<foo>It\'s a web component</foo>' },
      ],
    };
    wrapper = mount(<SourceViewer {...props} />);
  });

  it('renders the source', () => {
    expect(wrapper.text()).to.match(/a react component/);
  });

  describe('setting another source', () => {
    before(() => {
      wrapper.setState({ activeIndex: 1 });
    });

    it('shows that source', () => {
      expect(wrapper.text()).to.match(/a web component/);
    });
  });
});
