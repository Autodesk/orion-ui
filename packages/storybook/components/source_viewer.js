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
    return this.props.sources.map(([label, source], i) => {
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
    const source = this.props.sources[this.state.activeIndex][1];
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
  sources: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
};

export default SourceViewer;
