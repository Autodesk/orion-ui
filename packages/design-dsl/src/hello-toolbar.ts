import { Primitive } from './primitives';
import { primitiveToComponent } from './utils/gen-functional-component';
import { primitiveToHtml } from './utils/gen-html';
import { toolbarTemplate } from './demo-components/toolbar';

interface ToolbarProps {
  items: ToolbarItem[];
}

interface ToolbarItem {
  label: string;
  icon: string;
  width: number;
  height: number
}

console.log();
console.log('A template which uses a map type');
console.log();

console.log(JSON.stringify(toolbarTemplate, null, 4));

// output
const toolbar = primitiveToComponent<ToolbarProps>(toolbarTemplate);

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

console.log(JSON.stringify(primitiveToHtml(toolbar(props)), null, 4));