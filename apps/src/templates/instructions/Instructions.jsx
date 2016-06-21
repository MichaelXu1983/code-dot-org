var React = require('react');
var MarkdownInstructions = require('./MarkdownInstructions');
var NonMarkdownInstructions = require('./NonMarkdownInstructions');
import InputOutputTable from './InputOutputTable';

const styles = {
  main: {
    overflow: 'auto'
  },
  icon: {
    cursor: "pointer",
    padding: "5px 10px",
    margin: "0 10px"
  },
  audio: {
    verticalAlign: "middle",
    margin: "0 10px",
  }
};

var Instructions = React.createClass({

  propTypes: {
    puzzleTitle: React.PropTypes.string,
    instructions: React.PropTypes.string,
    instructions2: React.PropTypes.string,
    renderedMarkdown: React.PropTypes.string,
    markdownClassicMargins: React.PropTypes.bool,
    aniGifURL: React.PropTypes.string,
    authoredHints: React.PropTypes.element,
    inputOutputTable: React.PropTypes.arrayOf(
      React.PropTypes.arrayOf(React.PropTypes.number)
    ),
    onResize: React.PropTypes.func,
    acapelaSrc: React.PropTypes.string.isRequired
  },

  playAudio: function () {
    this.setState({
      audioSrc: this.props.acapelaSrc
    });
  },

  render: function () {
    // Body logic is as follows:
    //
    // If we have been given rendered markdown, render a div containing
    // that, optionally with inline-styled margins. We don't need to
    // worry about the title in this case, as it is rendered by the
    // Dialog header
    //
    // Otherwise, render the title and up to two sets of instructions.
    // These instructions may contain spans and images as determined by
    // substituteInstructionImages
    var instructions;
    if (this.props.renderedMarkdown) {
      instructions = (
        <MarkdownInstructions
          ref="instructionsMarkdown"
          renderedMarkdown={this.props.renderedMarkdown}
          markdownClassicMargins={this.props.markdownClassicMargins}
          onResize={this.props.onResize}
          inTopPane={this.props.inTopPane}
        />
      );
    } else {
      instructions = (
        <NonMarkdownInstructions
          puzzleTitle={this.props.puzzleTitle}
          instructions={this.props.instructions}
          instructions2={this.props.instructions2}
        />
      );
    }
    return (
      <div style={styles.main}>
        {instructions}
        {this.props.inputOutputTable && <InputOutputTable data={this.props.inputOutputTable}/>}
        {this.props.aniGifURL &&
          <img className="aniGif example-image" src={ this.props.aniGifURL }/>
        }
        {this.props.acapelaSrc && (<div>
          <p style={{lineHeight: "14px", fontSize: "12px"}}>Note that in trial mode, we don't have access to the high-quality children's voices that we would probably want to use in production</p>
          <a className="btn btn-primary" onClick={this.playAudio}><i className="icon-bullhorn icon-white"></i></a>
          {this.state && this.state.audioSrc && <audio style={styles.audio} src={this.state.audioSrc} controls='controls' />}
        </div>)}
        {this.props.authoredHints}
      </div>
    );
  }
});

module.exports = Instructions;
