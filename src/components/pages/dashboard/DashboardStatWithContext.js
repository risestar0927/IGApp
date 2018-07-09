import React, { PropTypes } from "react";
import Component from "components/Component";
import style from "styles/dashboard/dashboard-stat-with-context.css";
import ReactTooltip from 'react-tooltip';

export default class DashboardStatWithContext extends Component {

  static propTypes = {
    title:PropTypes.string.isRequired,
    stat:PropTypes.node,
    contextStat:PropTypes.node,
    statWithArrow: PropTypes.bool,
    contextText: PropTypes.string,
    isPositive: PropTypes.bool,
    tooltipText: PropTypes.string,
    showEmptyStat : PropTypes.bool,
    emptyStatMessage: PropTypes.string
  };

  static defaultProps = {
    tooltipText: '',
    statWithArrow: false,
    showEmptyStat: false,
    contextText: ''
  };

  constructor(props){
    super(props);
    this.uniqueID = Math.random().toString(36).substr(2, 9);
  }

  style = style;

  render() {
    return <div className={ this.classes.col}>
      <ReactTooltip place='bottom' effect='solid' id={this.uniqueID}/>
      <div className={ this.classes.item }>
        <div className={ this.classes.text }>{this.props.title}</div>
        { this.props.showEmptyStat ?
          <div>
            <div className={ this.classes.center }>
              <div className={ this.classes.sadIcon }/>
            </div>
            <div className={ this.classes.noMetrics }>
              {this.props.emptyStatMessage}
            </div>
          </div>
          :
          <div>
            <div className={ this.classes.number }>{this.props.stat}</div>
            <div className={this.classes.context} data-tip={this.props.tooltipText} data-for={this.uniqueID}>
              {this.props.contextStat ? <div className={this.classes.contextStat + ' ' + this.classes.contextText} data-negative={ this.props.isPositive ? null : 'negative' }>
                  {this.props.statWithArrow ? <div className={this.classes.arrow} data-arrow-type={ !this.props.isPositive ? 'decline' : null } /> : ''}
                  {this.props.contextStat}
                </div> : ''
              }

              { ' '+ this.props.contextText }
            </div>
          </div>
        }
      </div>
    </div>
  }
}