import React from 'react';
import Component from 'components/Component';
import style from 'styles/campaigns/comment.css';
import onboardingStyle from 'styles/onboarding/onboarding.css';

export default class Task extends Component {

  style=style;
  styles=[onboardingStyle];

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  static defaultProps = {
    initials: ''
  };

  timeSince(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) {
      return interval + " years ago";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
      return interval + " months ago";
    }
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
      return interval + " days ago";
    }
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
      return interval + " hours ago";
    }
    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
      return interval + " minutes ago";
    }
    return Math.floor(seconds) + " seconds ago";
  }

  hashCode(str) { // java String#hashCode
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  }

  intToRGB(i){
    const c = (i & 0x00FFFFFF)
      .toString(16)
      .toUpperCase();

    return "00000".substring(0, 6 - c.length) + c;
  }

  render() {
    return <div className={ this.classes.frame }>
      <div className={ this.classes.content }>
        <div className={ this.classes.initials } style={{ backgroundColor: "#" + this.intToRGB(this.hashCode(this.props.name))}}>
          {this.props.initials}
        </div>
        <div className={ this.classes.name }>
          {this.props.name}
        </div>
        <div className={ this.classes.commentText }>
          {this.props.comment}
        </div>
        <div className={ onboardingStyle.locals.footer }>
          <div className={ this.classes.line }/>
        </div>
        <div className={ onboardingStyle.locals.footer }>
          <div className={ onboardingStyle.locals.footerLeft }>
            <div className={ this.classes.time }>
              {this.timeSince(new Date(this.props.time))}
            </div>
          </div>
          <div className={ onboardingStyle.locals.footerRight }>
          </div>
        </div>
      </div>
    </div>
  }

}