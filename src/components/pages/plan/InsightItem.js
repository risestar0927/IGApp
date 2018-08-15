import React from 'react';
import Component from 'components/Component';
import style from 'styles/plan/insight-item.css';
import Button from 'components/controls/Button';

export default class InsightItem extends Component {

  style = style;

  render() {

    return <div>
      <div className={this.classes.frame}>
        <div className={this.classes.title}>
          Optimization Opportunity
        </div>
        <div className={this.classes.inner}>
          <ChannelItem/>
          <div className={this.classes.arrowIcon}/>
          <ChannelItem/>
          <ChannelItem/>
        </div>
      </div>
      <div className={this.classes.buttons}>
        <Button type='reverse2' icon='buttons:approve' style={{width: '100px'}}>
          Commit
        </Button>
        <Button type='warning' icon='buttons:decline' style={{width: '100px', marginLeft: '20px'}}>
          Decline
        </Button>
      </div>
    </div>;
  }
}

export class ChannelItem extends Component {

  style = style;

  render() {

    return <div className={this.classes.channelItem}>
      <div className={this.classes.date}>
        MAR 18
      </div>
      <div className={this.classes.channelIcon} data-icon="plan:TV"/>
      <div style={{display: 'flex'}}>
        <div className={this.classes.fromBudget}>
          $7,000
        </div>
        <div className={this.classes.shiftIcon}/>
        <div className={this.classes.toBudget}>
          $9,000
        </div>
      </div>
    </div>;
  }
}