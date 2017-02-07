"use strict";
const gen_functional_component_1 = require("./utils/gen-functional-component");
const gen_html_1 = require("./utils/gen-html");
const toolbar_1 = require("./demo-components/toolbar");
console.log();
console.log('A template which uses a map type');
console.log();
console.log(JSON.stringify(toolbar_1.toolbarTemplate, null, 4));
// output
const toolbar = gen_functional_component_1.primitiveToComponent(toolbar_1.toolbarTemplate);
console.log();
console.log('Builds a function which when applied with this data');
console.log();
const props = {
    items: [
        { label: 'Item 1', icon: 'item1.png', width: 20, height: 20 },
        { label: 'Item 2', icon: 'item2.png', width: 20, height: 20 },
        { label: 'Item 3', icon: 'item3.png', width: 20, height: 20 }
    ]
};
console.log(JSON.stringify(props, null, 4));
console.log();
console.log('Produces the following primitives');
console.log();
console.log(JSON.stringify(toolbar(props), null, 4));
console.log();
console.log('Converted to HTML');
console.log();
console.log(JSON.stringify(gen_html_1.primitiveToHtml(toolbar(props)), null, 4));
//# sourceMappingURL=hello-toolbar.js.map