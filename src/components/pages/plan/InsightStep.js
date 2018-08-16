import Component from 'components/Component';
import React, {PropTypes} from 'react';
import style from 'styles/plan/plan-optimization-popup.css';
import InsightItem from 'components/pages/plan/InsightItem';

export default class InsightStep extends Component {
  style = style;

  static PropTypes = {
    getInsightData: PropTypes.func.isRequired,
    plan: PropTypes.any.isRequired
  };

  render() {
    const {getInsightData, planDate} = this.props;
    const {fromChannels, toChannels, forecastedIndicators} = getInsightData && getInsightData();
    return <div className={this.classes.optionsWrapper}>
      <InsightItem fromChannels={fromChannels}
                   toChannels={toChannels}
                   planDate={planDate}
                   forecasting={forecastedIndicators}
                   onCommit={() => {
                     this.props.triggerNextStep({trigger: '8'});
                   }}
                   onDecline={() => {
                     this.props.triggerNextStep({trigger: '11'});
                   }}/>
    </div>;
  }
}