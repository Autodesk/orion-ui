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
