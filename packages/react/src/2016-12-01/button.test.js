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
import sinon from 'sinon';
import chaiEnzyme from 'chai-enzyme';
import OrionButton from './button.js';

chai.use(chaiEnzyme());

describe('<OrionButton />', () => {
  it('passes props to button web component', () => {
    const props = {
      backgroundColor: '#FFFFFF',
      color: '#000000'
    }
    const wrapper = mount(
      <OrionButton {...props} />
    );
    const passedProps = wrapper.find('button').props();
    expect(passedProps.backgroundColor).to.equal(props.backgroundColor);
    expect(passedProps.color).to.equal(props.color);
  });

  it('simulates click events', () => {
    const onClick = sinon.spy();
    const wrapper = mount(
      <OrionButton onClick={onClick} />
    );
    wrapper.find('button').simulate('click');
    expect(onClick).to.have.property('callCount', 1);
  });
});
