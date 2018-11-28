import React from 'react';
import Component from 'components/Component';
import style from 'styles/plan/annual-tab.css';
import planStyles from 'styles/plan/plan.css';
import icons from 'styles/icons/plan.css';
import IndicatorsGraph from 'components/pages/plan/IndicatorsGraph';
import BudgetsTable from 'components/pages/plan/BudgetsTable';
import {monthNames, getEndOfMonthString, getQuarterOffset, getRawDatesSpecific, formatSpecificDate, getRawDates, getAnnualOffset} from 'components/utils/date';
import FloatingComponent from 'components/controls/FloatingComponent';
import {isNil, sumBy, union, last, orderBy, groupBy, isEmpty} from 'lodash';
import chunk from 'lodash/chunk';
import concat from 'lodash/concat';

const CELL_WIDTH = 140;

export default class AnnualTab extends Component {

  style = style;
  styles = [planStyles, icons];

  static defaultProps = {
    actualIndicators: {},
    planDate: '',
    events: [],
    objectives: [],
    annualBudgetArray: []
  };

  constructor(props) {
    super(props);
    this.state = {
      hoverRow: void 0,
      scrollPosition: 0
    };
  }

  changeScrollPosition = (toPosition) => {
    this.setState({
      scrollPosition: toPosition
    });
  };

  componentDidMount() {
    this.setState({scrollPosition: this.props.calculatedData.historyData.historyDataLength * CELL_WIDTH});
  }

  addQuartersAndFormatDates = (dates, quarterFutureOffset, formatDateFunc) => {
    return this.addQuarters(dates, quarterData => {
      const date = quarterData[0];
      const quarterNumber = Math.round((date.getMonth() / 3)) + 1;
      const yearStr = date.getFullYear().toString().substr(2, 2);
      return `Q${quarterNumber} ${yearStr}`;
    }, quarterFutureOffset, item => formatDateFunc(item, false));
  };

  addEvery = (array, chunkData, itemInQuarterMap = (item) => {
    return item;
  }) => {
    const chunksAddition = union(...chunkData.map(({offset, itemsInChunk, sumChunkFormatter}, grouperIndex) => {
      const chunkSplit = [array.slice(0, offset),
        ...chunk(array.slice(offset), itemsInChunk)];

      const mapChunk = (chunk) => chunk.map((chunk, index) => {
        return {putAfter: (offset + index * itemsInChunk), value: sumChunkFormatter(chunk), orderIndex: grouperIndex};
      });

      if (array.length / itemsInChunk !== 0) {
        return mapChunk(chunkSplit.slice(0, chunkSplit.length - 1));
      }
      else {
        return mapChunk(chunkSplit);
      }
    }));

    const orderedChunksAddition = orderBy(chunksAddition, 'orderIndex');
    const groupedAdditions = groupBy(orderedChunksAddition, 'putAfter');
    const parsedArray = array.map((item, index) => {
      return {value: itemInQuarterMap(item), realIndex: index};
    });

    let arrayWithAddition = parsedArray;
    Object.keys(groupedAdditions).forEach(putAfter => {
      const additions = groupedAdditions[putAfter];
      const putAfterIndex = arrayWithAddition.findIndex(item => item.realIndex == putAfter);
      arrayWithAddition =
        [...arrayWithAddition.slice(0, putAfterIndex),
          ...additions.map(item => item.value),
          ...arrayWithAddition.slice(putAfterIndex)];
    });

    return arrayWithAddition;
  };

  addQuarters = (array, quarterDataFunc, firstQuarterOffset, itemInQuarterMap = (item) => {
    return item;
  }) => {

    if (isEmpty(array)) {
      return [];
    }
    // return this.addEvery(array,
    //   [{offset: firstQuarterOffset, itemsInChunk: 3, sumChunkFormatter: quarterDataFunc}],
    //   itemInQuarterMap);

    const quartersSplit = [array.slice(0, firstQuarterOffset),
      ...chunk(array.slice(firstQuarterOffset), 3)];

    const withQuarterAddition = quartersSplit.map((quarterMonths, index) => {
      // If last quarter did not end, don't add quarter value
      if (index == quartersSplit.length - 1 && firstQuarterOffset !== 0) {
        return quarterMonths.map(itemInQuarterMap);
      }
      else {
        return [...quarterMonths.map(itemInQuarterMap), quarterDataFunc(quarterMonths)];
      }
    });

    return concat(...withQuarterAddition);
  };

  render() {
    const {budgetsData, editMode, interactiveMode, secondaryPlanForecastedIndicators, primaryPlanForecastedIndicators, forecastingGraphRef, calculatedData: {objectives: {objectivesData}}, historyData: {indicators}} = this.props;

    const showSecondaryIndicatorGraph = secondaryPlanForecastedIndicators &&
      secondaryPlanForecastedIndicators.length > 0;

    const parsedObjectives = {};
    objectivesData
      .forEach(objective => {
        const target = objective.target;
        const date = objective.dueDate;
        const monthStr = monthNames[date.getMonth()] + ' ' + date.getFullYear().toString().substr(2, 2);
        parsedObjectives[objective.indicator] = {x: getEndOfMonthString(monthStr), y: target};
      });

    const numberOfPastDates = budgetsData && budgetsData.filter((month) => month.isHistory).length;
    const dates = !isNil(numberOfPastDates) && budgetsData && getRawDatesSpecific(this.props.planDate,
      numberOfPastDates,
      budgetsData.length - numberOfPastDates);
    const quarterOffset = getQuarterOffset(dates);
    const annualOffset = getAnnualOffset(dates);

    const datesWithQuarters = dates &&
      this.addQuartersAndFormatDates(dates, quarterOffset, item => formatSpecificDate(item, false));

    const budgetDataWithIndex = budgetsData && budgetsData.map((month, index) => {
      return {...month, updateIndex: index};
    });

    const dataWithQuarters = budgetDataWithIndex && this.addQuarters(budgetDataWithIndex, quarterData => {
      const channelsInQuarter = union(...quarterData.map(month => Object.keys(month.channels)));
      const quarterSummedChannel = {};
      channelsInQuarter.forEach(channel => {
        const primaryBudget = sumBy(quarterData, month => {
          return month.channels[channel] ? month.channels[channel].primaryBudget : 0;
        });
        const secondaryBudget = sumBy(quarterData, month => {
          return month.channels[channel] ? month.channels[channel].secondaryBudget : 0;
        });

        return quarterSummedChannel[channel] = {primaryBudget, secondaryBudget};
      });

      return {channels: quarterSummedChannel, isHistory: last(quarterData).isHistory, isQuarter: true};
    }, quarterOffset);

    const numberOfPastDatesWithQuarters = dataWithQuarters && dataWithQuarters.filter((item) => item.isHistory).length;
    const datesForGraphWithQuarters = dates && this.addQuartersAndFormatDates(dates,
      quarterOffset,
      item => getEndOfMonthString(formatSpecificDate(item, false)));

    const addQuarterDataForForecasting = (quarterData) => {
      return {indicators: last(quarterData), isQuarter: true};
    };

    const parseRegularMonthForForecasting = (month) => {
      return {indicators: month, isQuarter: false};
    };

    const primaryDataWithQuarters = dates && this.addQuarters([...indicators, ...primaryPlanForecastedIndicators],
      addQuarterDataForForecasting,
      quarterOffset,
      parseRegularMonthForForecasting);

    const secondaryDataWithQuarters = dates && secondaryPlanForecastedIndicators &&
      this.addQuarters([...indicators, ...secondaryPlanForecastedIndicators],
        addQuarterDataForForecasting,
        quarterOffset,
        parseRegularMonthForForecasting);

    return <div>
      <div className={this.classes.wrap}>
        <div className={this.classes.innerBox}>
          <BudgetsTable isEditMode={editMode}
                        isShowSecondaryEnabled={interactiveMode || editMode}
                        isConstraintsEnabled={interactiveMode}
                        data={dataWithQuarters}
                        changeScrollPosition={this.changeScrollPosition}
                        scrollPosition={this.state.scrollPosition}
                        cellWidth={CELL_WIDTH}
                        isPopup={interactiveMode}
                        dates={datesWithQuarters || []}
                        numberOfPastDates={numberOfPastDatesWithQuarters || 0}
                        {...this.props}
          />

          <div className={this.classes.indicatorsGraph} ref={forecastingGraphRef.bind(this)}>
            <FloatingComponent popup={this.props.interactiveMode}>
              <IndicatorsGraph parsedObjectives={parsedObjectives}
                               dimensions={this.state.graphDimensions}
                               changeScrollPosition={this.changeScrollPosition}
                               scrollPosition={this.state.scrollPosition}
                               cellWidth={CELL_WIDTH}
                               mainLineData={(showSecondaryIndicatorGraph
                                 ? secondaryDataWithQuarters
                                 : primaryDataWithQuarters) || []}
                               dashedLineData={showSecondaryIndicatorGraph ? primaryDataWithQuarters : null}
                               dates={datesForGraphWithQuarters || []}
                               numberOfPastDates={numberOfPastDatesWithQuarters || 0}
                               {...this.props}
              />
            </FloatingComponent>
          </div>
        </div>
      </div>
    </div>;
  }
}