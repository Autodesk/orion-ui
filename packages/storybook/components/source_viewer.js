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
import React, { PropTypes } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/styles';
import SourceViewerButton from './source_viewer_button';

class SourceViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0,
    };
    this._setActiveIndex = this._setActiveIndex.bind(this);
  }

  _setActiveIndex(newSourceIndex) {
    this.setState({ activeIndex: newSourceIndex });
  }

  renderTabs() {
    return this.props.sources.map(({ label, source }, i) => {
      return (
        <SourceViewerButton
          active={this.state.activeIndex === i}
          key={i}
          index={i}
          label={label}
          onClick={this._setActiveIndex}
        />
      );
    });
  }

  render() {
    const source = this.props.sources[this.state.activeIndex].source;
    return (
      <div>
        {this.renderTabs()}
        <SyntaxHighlighter
          language="javascript"
          style={docco}
          showLineNumbers
        >{source}
        </SyntaxHighlighter>
      </div>
    );
  }
}

SourceViewer.propTypes = {
  sources: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    source: PropTypes.string.isRequired,
  })).isRequired,
};

export default SourceViewer;
