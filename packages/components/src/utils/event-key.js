const keyStrings = {
  9: 'Tab',
  13: 'Enter',
  27: 'Escape',
  37: 'ArrowLeft',
  38: 'ArrowUp',
  39: 'ArrowRight',
  40: 'ArrowDown',
};

module.exports = function eventKey(event) {
  if (event.key !== undefined) { return event.key; }
  return keyStrings[event.keyCode];
};
