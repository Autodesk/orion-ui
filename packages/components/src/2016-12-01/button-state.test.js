/* eslint-disable import/no-extraneous-dependencies */
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
const chai = require('chai');

const expect = chai.expect;

const ButtonState = require('./button-state.js');

describe('ButtonState', () => {
  describe('getInitialState', () => {
    it('returns a default state', () => {
      const initialState = ButtonState.getInitialState();
      expect(initialState.disabled).to.be.false;
      expect(initialState.focus).to.be.false;
      expect(initialState.hover).to.be.false;
    });

    context('with a state', () => {
      it('extends default state with passed state', () => {
        const initialState = ButtonState.getInitialState({ disabled: true });
        expect(initialState.disabled).to.be.true;
        expect(initialState.focus).to.be.false;
        expect(initialState.hover).to.be.false;
      });
    });
  });

  describe('enterHover', () => {
    it('sets hover to true', () => {
      const nextState = ButtonState.enterHover({ hover: false });
      expect(nextState.hover).to.be.true;
    });
  });

  describe('leaveHover', () => {
    it('sets hover to false', () => {
      const nextState = ButtonState.leaveHover({ hover: true });
      expect(nextState.hover).to.be.false;
    });
  });

  describe('enterDisabled', () => {
    it('sets disabled to true', () => {
      const nextState = ButtonState.enterDisabled({ disabled: false });
      expect(nextState.disabled).to.be.true;
    });
  });

  describe('leaveDisabled', () => {
    it('sets disabled to false', () => {
      const nextState = ButtonState.leaveDisabled({ disabled: true });
      expect(nextState.disabled).to.be.false;
    });
  });
});
