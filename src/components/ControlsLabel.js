import React from 'react';
import Component from 'components/Component';

import style from 'styles/controls-label.css';

export default class Label extends Component {
  style = style;
  state = {
    displayHelp: false
  };

  static defaultProps = {
    checkboxDisabled: false,
    capitalize: true
  };

  render() {
    let question;
    let tooltip;

    if (this.state.displayHelp) {
      let items = this.props.question;

      if (!Array.isArray(items)) {
        items = [];
      }

      const contents = items.map((name, index) => {
        return <div key={ name }>
          <div className={ this.classes.ttSubTitle }>{ name }</div>
          <div className={ this.classes.ttSubText }>
            { this.props.description && this.props.description[index] || '' }
          </div>
        </div>
      });

      tooltip = <div className={ this.classes.tooltip }>
        <div className={ this.classes.ttLabel }>
          { this.props.children }
        </div>
        <div className={ this.classes.ttContent }>
          { contents }
        </div>
      </div>
    }

    if (this.props.question) {
      question = <div className={ this.classes.questionBox }>
        <div className={ this.classes.question }
          onMouseOver={() => {
            this.setState({
              displayHelp: true
            })
          }}
          onMouseOut={() => {
            this.setState({
              displayHelp: false
            })
          }}
        />

        { tooltip }
      </div>
    }

    let className = this.classes.label;

    if (this.props.className) {
      className += ' ' + this.props.className;
    }

    return <div className={ className } style={ this.props.style } data-capitalize={this.props.capitalize ? true : null}>
      { (this.props.checkbox != undefined) ? <input type="checkbox" checked={ this.props.checkbox } disabled={this.props.checkboxDisabled ? true : null} onChange={ this.props.onChange }/> : null }
      { this.props.children }
      { question }
    </div>
  }
}

