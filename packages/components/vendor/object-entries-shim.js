const entries = require('object.entries');

if (!Object.entries) {
  entries.shim();
}
