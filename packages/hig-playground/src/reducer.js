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
const initialState = {
  menuOpen: false,
  welcomeMessage: 'Hello Main App Content!',
  items: [{ id: 1, label: 'Item 1' }, { id: 2, label: 'Item 2' }],
  lastItemId: 3,
  selectedItem: null
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case 'SELECT_ITEM':
      return {
        ...state,
        selectedItem: action.item
      };
    case 'TOGGLE_MENU':
      return {
        ...state,
        menuOpen: !state.menuOpen
      };
    default:
      return state;
  }
}
