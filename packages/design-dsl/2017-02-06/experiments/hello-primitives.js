"use strict";
const gen_html_1 = require("./utils/gen-html");
const hello = {
    type: 'container',
    props: {
        display: 'inline',
        paddingAll: 'small'
    },
    children: [{
            type: 'text',
            props: {
                color: 'white',
                fontSize: 'f1',
                lineHeight: 'title'
            },
            textContent: 'Hello World'
        }]
};
console.log(JSON.stringify(hello, null, 4));
console.log();
console.log('Converted to HTML');
console.log();
console.log(JSON.stringify(gen_html_1.primitiveToHtml(hello), null, 4));
//# sourceMappingURL=hello-primitives.js.map