import { storiesOf } from '@storybook/react';

declare module "@storybook/react" {
  interface Story {
    addWithInfo(storyName: string, info: string, storyFn: Function, _options?: any);
  }
}


