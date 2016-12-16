import {Component} from './components';
import {Primitive} from './primitives';

interface ToolbarProps {
  items: ToolbarItem[];
}

interface ToolbarItem {
  label: string;
  icon: string;
  width: number;
  height: number
}

const toolbarTemplate: Component<ToolbarProps> = {
  type: 'component',
  transformation: {
    type: 'map',
    collection: 'props.items',
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
}

console.log();
console.log('A Component Template');
console.log();

console.log(JSON.stringify(toolbarTemplate, null, 4));

console.log();
console.log('With this data');
console.log();

const items = [
  { label: 'Item 1', icon: 'item1.png', width: 20, height: 20 },
  { label: 'Item 2', icon: 'item2.png', width: 20, height: 20 },
  { label: 'Item 3', icon: 'item3.png', width: 20, height: 20 }
];

console.log(JSON.stringify(items, null, 4));

console.log();
console.log('Produces the following primitives:')
console.log();

// output

const toolbarPrimitive: Primitive = {
  type: 'container',
  props: {
    display: 'flex',
    layout: 'row',
    paddingAll: 'small',
    background: 'black'
  },

  children: [
    {
      type: 'container',
      props: {
        display: 'flex',
        layout: 'row',
        paddingAll: 'small',
        background: 'grey'
      },
      children: [
        {
          type: 'image',
          props: {
            width: 20,
            height: 20
          },
          src: 'item1.png'

        },
        {
          type: 'text',
          textContent: 'Item 1'
        }
      ]
    },
    {
      type: 'container',
      props: {
        display: 'flex',
        layout: 'row',
        paddingAll: 'small',
        background: 'grey'
      },
      children: [
        {
          type: 'image',
          props: {
            width: 20,
            height: 20
          },
          src: 'item2.png'
        },
        {
          type: 'text',
          textContent: 'Item 2'
        }
      ]
    },
    {
      type: 'container',
      props: {
        display: 'flex',
        layout: 'row',
        paddingAll: 'small',
        background: 'grey'
      },
      children: [
        {
          type: 'image',
          props: {
            width: 20,
            height: 20
          },
          src: 'item3.png'
        },
        {
          type: 'text',
          textContent: 'Item 3'
        }
      ]
    }
  ]
}

console.log(JSON.stringify(toolbarPrimitive, null, 4));
