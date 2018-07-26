import React from 'react';
import Component from 'components/Component';
import style from 'styles/plan/annual-tab.css';
import planStyles from 'styles/plan/plan.css';
import icons from 'styles/icons/plan.css';
import IndicatorsGraph from 'components/pages/plan/IndicatorsGraph';
import {timeFrameToDate} from 'components/utils/objective';
import {formatBudget} from 'components/utils/budget';
import BudgetsTable from 'components/pages/plan/BudgetsTable';
import {monthNames, getDates} from 'components/utils/date';

export default class AnnualTab extends Component {

  style = style;
  styles = [planStyles, icons];

  static defaultProps = {
    projectedPlan: [],
    approvedBudgets: [],
    actualIndicators: {},
    planDate: '',
    events: [],
    objectives: [],
    approvedBudgetsProjection: [],
    annualBudgetArray: []
  };

  constructor(props) {
    super(props);
    this.state = {
      hoverRow: void 0,
      graphDimensions: {},
      approvedPlan: true,
      isSticky: false
    };
  }

  componentDidMount() {
    this.calculateGraphDimensions();
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = () => {
    this.setState({isSticky: window.pageYOffset >= (this.planTable && this.planTable.offsetTop)});
  };

  calculateGraphDimensions() {
    if (this.planTable && this.firstColumnCell) {
      const planTableOffsetWidth = this.planTable.offsetWidth;
      const firstColumnOffsetWidth = this.firstColumnCell.offsetWidth;
      window.requestAnimationFrame(() => {
        this.setState({
          graphDimensions: {
            width: planTableOffsetWidth,
            marginLeft: firstColumnOffsetWidth
          }
        });
      });
    }
  }

  render() {
    const {budgetsData, planDate, editMode, interactiveMode} = this.props;

    const currentSuggested = {};
    const dates = getDates(planDate);
    const projections = this.props.forecastedIndicators.map((item, index) => {
      const json = {};
      Object.keys(item).forEach(key => {
        json[key] = item[key].committed;
      });
      return {...json, name: dates[index]};
    });

    Object.keys(this.props.actualIndicators).forEach(indicator => {
      currentSuggested[indicator] = this.props.actualIndicators[indicator];
    });

    // Current indicators values to first cell
    projections.splice(0, 0, {...this.props.actualIndicators, name: 'today', ...currentSuggested});

    const objectives = {};
    this.props.objectives
      .filter(function (objective) {
        const today = new Date();
        const date = objective && objective.timeFrame ? timeFrameToDate(objective.timeFrame) : today;
        return date >= today;
      })
      .forEach(objective => {
        const delta = objective.isPercentage
          ? objective.amount * (objective.currentValue || 0) / 100
          : objective.amount;
        const target = objective.direction === 'equals' ? objective.amount : (objective.direction === 'increase'
          ? delta + (objective.currentValue || 0)
          : (objective.currentValue || 0) - delta);
        const date = timeFrameToDate(objective.timeFrame);
        const monthStr = monthNames[date.getMonth()] + '/' + date.getFullYear().toString().substr(2, 2);
        objectives[objective.indicator] = {x: monthStr, y: target};
      });

    return <div>
      <div className={this.classes.wrap}>
        <div className={this.classes.innerBox}>
          <BudgetsTable isEditMode={editMode}
                        isShowSecondaryEnabled={interactiveMode}
                        isConstraintsEnabled={interactiveMode}
                        data={budgetsData}
                        tableRef={(ref) => this.planTable = ref}
                        firstColumnCell={(ref) => this.firstColumnCell = ref}
                        dates={dates}
                        approvedPlan={this.state.approvedPlan}
                        editCommittedBudget={this.props.editCommittedBudget}
                        changeBudgetConstraint={this.props.changeBudgetConstraint}
                        {...this.props}
                        />

          <div className={this.classes.indicatorsGraph} ref={this.props.forecastingGraphRef.bind(this)}>
            <IndicatorsGraph data={projections} objectives={objectives} dimensions={this.state.graphDimensions}/>
          </div>
        </div>
      </div>
    </div>;
  }
}