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
