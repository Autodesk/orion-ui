/**
 * Abstraction demo
 */
"use strict";
const gen_functional_component_1 = require("./utils/gen-functional-component");
const gen_html_1 = require("./utils/gen-html");
const toolbar_1 = require("./demo-components/toolbar");
const panel = {
    type: 'container',
    props: {
        display: 'flex',
        layout: 'column'
    },
    children: [
        {
            type: 'text',
            textContent: 'Hello Toolbar'
        },
        {
            type: 'component',
            component: {
                type: 'toolbar',
                props: {
                    items: [
                        { label: 'Item 1', icon: 'item1.png', width: 20, height: 20 },
                        { label: 'Item 2', icon: 'item2.png', width: 20, height: 20 },
                        { label: 'Item 3', icon: 'item3.png', width: 20, height: 20 }
                    ]
                }
            }
        }
    ]
};
console.log();
console.log('A template which uses a component type');
console.log();
console.log(JSON.stringify(panel, null, 4));
console.log();
console.log('When flattened with toolbarTemplate');
console.log();
console.log(JSON.stringify(toolbar_1.toolbarTemplate, null, 4));
console.log();
console.log('Makes the following primitive');
console.log();
const flat = gen_functional_component_1.flattenPrimitive(panel, {}, { toolbar: toolbar_1.toolbarTemplate });
console.log(JSON.stringify(flat, null, 4));
console.log();
console.log();
console.log(JSON.stringify(gen_html_1.primitiveToHtml(flat), null, 4));
//# sourceMappingURL=hello-panel.js.map