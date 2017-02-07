/**
Copyright 2016 Autodesk,Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/
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