import { OContainer } from './primitives';

// attributes

const keyMaps = {
  container: ['background', 'color', 'display', 'gap', 'layout', 'marginAll', 'paddingAll']
}

const s = {
  title: 'Background Schema',
  type: 'string',


}

const integration = `
  <!-- root element must always be orion -->
  <orion>
    <container display="inline" paddingAll="small">
      <text color="white" fontSize="f1" lineHeight="title">Hello World!</text>
    </container>
  </orion>
`;

interface Node {
  type: string;
  props: {
    [key: string]: any;
  }

  children: Node[];
}

const result: Node =
  {
    type: 'orion',
    props: {},
    children: [
      {
        type: 'container',
        props: {
          display: 'inline',
          paddingAll: 'small'
        },

        children: [
          {
            type: 'text',
            props: {
              color: 'white',
              fontSize: 'f1',
              lineHeight: 'title'
            },
            children: [
              {
                type: 'textNode',
                props: {
                  textContent: 'Hello World!'
                },
                children: []
              }
            ]
          }
        ]
      }
    ]
  }

