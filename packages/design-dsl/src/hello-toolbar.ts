import { Primitive } from './primitives';
import { primitiveToComponent } from './utils/gen-functional-component';
import { primitiveToHtml } from './utils/gen-html';

interface ToolbarProps {
  items: ToolbarItem[];
}

interface ToolbarItem {
  label: string;
  icon: string;
  width: number;
  height: number
}

const toolbarTemplate: Primitive = {
  type: 'container',
  props: {
    display: 'flex',
    layout: 'row',
    paddingAll: 'small',
    background: 'black'
  },

  children: [
    {
      type: 'map',
      collection: 'items',
      refs: {
        image: 'children[0]',
        label: 'children[1]'
      },
      mappings: [
        { source: 'width', destination: 'image.props.width' },
        { source: 'height', destination: 'image.props.height' },
        { source: 'icon', destination: 'image.src' },
        { source: 'label', destination: 'label.textContent' }
      ],
      template: {
        type: 'container',
        props: {
          display: 'flex',
          layout: 'row',
          paddingAll: 'medium',
          background: 'grey'
        },

        children: [
          { type: 'image' },
          { type: 'text' }
        ]
      }
    }
  ]
}

console.log();
console.log('A Component Template');
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