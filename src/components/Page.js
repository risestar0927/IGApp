import React from 'react';
import Component from 'components/Component';
import style from 'styles/page.css';

export default class Page extends Component {
  style = style;

  static defaultProps = {
    sidebar: true
  };

  componentDidMount() {
    window.addEventListener('scroll', this.props.onPageScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.props.onPageScroll);
  }

  componentWillReceiveProps(newProps) {
    window.removeEventListener('scroll', this.props.onPageScroll);
    window.addEventListener('scroll', newProps.onPageScroll);
  }

  render() {
    let className = this.props.popup ?
      this.classes.popup : this.classes.static;

    if (this.props.className) {
      className += ' ' + this.props.className;
    }

    let boxStyle;

    if (this.props.width) {
      boxStyle = {
        maxWidth: this.props.width
      };
    }

    if (this.props.centered) {
      boxStyle || (boxStyle = {});
      boxStyle.margin = '0 auto';
    }

    let contentClassName = this.classes.content;

    if (this.props.contentClassName) {
      contentClassName += ' ' + this.props.contentClassName;
    }

    let innerClassName = this.classes.inner;

    if (this.props.innerClassName) {
      innerClassName += ' ' + this.props.innerClassName;
    }

    return <div className={className}
                style={this.props.style}
                data-sidebar={this.props.sidebar}
                onScroll={() => {
                  if (this.props.popup && this.props.onPageScroll) {
                    this.props.onPageScroll();
                  }
                }}>
      <div className={this.classes.box} style={boxStyle}>
        <div className={innerClassName}>
          <div className={contentClassName}>
            {this.props.children}
          </div>
        </div>
      </div>
    </div>;
  }
}