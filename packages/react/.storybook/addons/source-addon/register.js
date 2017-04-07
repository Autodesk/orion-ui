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
import { docco } from 'react-syntax-highlighter/dist/styles';
import addons from '@kadira/storybook-addons';
import React, { PropTypes } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';

const styles = {
  sourcePanel: {
    ...docco,
  },
};

styles.sourcePanel.hljs.width = '100%';

class SourceViewer extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = { source: '' };
    this.onAddSource = this.onAddSource.bind(this);
  }

  componentDidMount() {
    const { channel, api, framework } = this.props;
    // Listen to the notes and render it.

    channel.on(`kadira/source/add_${framework}`, this.onAddSource);

    // Clear the current notes on every story change.
    this.stopListeningOnStory = api.onStory(() => {
      this.onAddSource();
    });
  }

  componentWillUnmount() {
    if (this.stopListeningOnStory) {
      this.stopListeningOnStory();
    }

    this.unmounted = true;
    const { channel, framework } = this.props;
    channel.removeListener(`kadira/source/add_${framework}`, this.onAddSource);
  }

  onAddSource(source = '') {
    if (source) {
      this.setState({ source });
    } else {
      this.setState({ source: '' });
    }
  }

  render() {
    const { source } = this.state;

    if (!source) {
      return <span>No source defined</span>;
    }

    return (
      <SyntaxHighlighter
        language="javascript"
        style={styles.sourcePanel}
        showLineNumbers
      >{source}
      </SyntaxHighlighter>
    );
  }
}

SourceViewer.propTypes = {
  channel: PropTypes.shape({
    on: PropTypes.func.isRequired,
    removeListener: PropTypes.func.isRequired,
  }).isRequired,
  framework: PropTypes.string.isRequired,
  api: PropTypes.shape({
    onStory: PropTypes.func.isRequired,
  }).isRequired,
};

// Register the addon with a unique name.
addons.register('kadira/source', (api) => {
  // Also need to set a unique name to the panel.
  addons.addPanel('kadira/sources/react', {
    title: 'React',
    render: () => (
      <SourceViewer framework="react" channel={addons.getChannel()} api={api} />
    ),
  });

  addons.addPanel('kadira/sources/angular', {
    title: 'Angular 1.5.x',
    render: () => (
      <SourceViewer framework="angular" channel={addons.getChannel()} api={api} />
    ),
  });
});
