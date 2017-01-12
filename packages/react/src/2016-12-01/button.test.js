/* eslint-disable import/no-extraneous-dependencies */
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
require('jsdom-global/register');

const React = require('react');
const { mount } = require('enzyme');
const chai = require('chai');
const sinon = require('sinon');
const chaiEnzyme = require('chai-enzyme');

const expect = chai.expect;

const OrionButton = require('./button');

chai.use(chaiEnzyme());

describe('<OrionButton />', () => {
  it('passes props to button web component', () => {
    const props = {
      background: 'white',
      color: 'black',
    };
    const wrapper = mount(<OrionButton {...props} />);

    const element = wrapper.find('orion-button').getDOMNode();

    expect(element.background).to.equal(props.background);
    expect(element.color).to.equal(props.color);
  });

  it('simulates click events', () => {
    const onClick = sinon.spy();
    const wrapper = mount(<OrionButton onClick={onClick} />);
    wrapper.find('orion-button').get(0).dispatchEvent(new Event('click'));
    expect(onClick).to.have.property('callCount', 1);
  });

  context('when disabled', () => {
    it('does not simulate click events', () => {
      const onClick = sinon.spy();
      const wrapper = mount(<OrionButton onClick={onClick} disabled />);
      wrapper.find('orion-button').simulate('click');

      expect(onClick).to.have.property('callCount', 0);
    });
  });
});
