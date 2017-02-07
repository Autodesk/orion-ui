import {Primitive} from '../primitives';

export const toolbarTemplate: Primitive = {
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