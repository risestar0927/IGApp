import React from 'react';
import Component from 'components/Component';
import {ResponsiveContainer, Area, AreaChart, CartesianGrid, ReferenceDot, Tooltip, XAxis, YAxis} from 'recharts';
import style from 'styles/plan/indicators-graph.css';
import onboardingStyle from 'styles/onboarding/onboarding.css';
import Label from 'components/ControlsLabel';
import {getIndicatorsWithProps, getNickname} from 'components/utils/indicators';
import {formatBudgetShortened} from 'components/utils/budget';
import isEqual from 'lodash/isEqual';
import CustomCheckbox from 'components/controls/CustomCheckbox';

export default class IndicatorsGraph extends Component {

  style = style;
  styles = [onboardingStyle];

  static defaultProps = {
    dimensions: {
      width: 0,
      marginLeft: 0
    }
  };

  constructor(props) {
    super(props);

    const initialIndicators = this.getInitialeIndicators(this.props);
    this.state = {
      checkedIndicators: initialIndicators ? initialIndicators : []
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(nextProps.objectives, this.props.objectives)) {
      const objectives = this.getInitialeIndicators(nextProps);
      if (objectives) {
        this.setState({
          checkedIndicators: objectives
        });
      }
    }
  }

  getInitialeIndicators = (props) => {
    const objectives = Object.keys(props.objectives);
    const objective = objectives && objectives[0];
    return objective ? [objective] : null;
  };

  get width() {
    return this.props.dimensions.width - this.marginLeft + 5;
  }

  get marginLeft() {
    return this.props.dimensions.marginLeft - 65;
  }

  toggleCheckbox(indicator) {
    let checkedIndicators = this.state.checkedIndicators;
    const index = checkedIndicators.indexOf(indicator);
    if (index !== -1) {
      checkedIndicators.splice(index, 1);
    }
    else {
      checkedIndicators.push(indicator);
    }
    this.setState({checkedIndicators: checkedIndicators});
  }

  getTooltipContent() {
  }

  render() {
    const COLORS = [
      '#189aca',
      '#3cca3f',
      '#a8daec',
      '#70d972',
      '#56b5d9',
      '#8338EC',
      '#40557d',
      '#f0b499',
      '#ffd400',
      '#3373b4',
      '#72c4b9',
      '#FB5607',
      '#FF006E',
      '#76E5FC',
      '#036D19'
    ];
    const indicators = getIndicatorsWithProps();
    const indicatorsMapping = {};
    Object.keys(indicators)
      .filter(item => indicators[item].isObjective)
      .forEach(item =>
        indicatorsMapping[item] = indicators[item].nickname
      );
    const popupItems = Object.keys(indicatorsMapping).map(indicator =>
      <div className={this.classes.menuItem} key={indicator}>
        <Label checkbox={this.state.checkedIndicators.indexOf(indicator) !== -1}
               onChange={this.toggleCheckbox.bind(this, indicator)}
               style={{
                 marginBottom: '3px',
                 fontSize: '12px',
                 textTransform: 'capitalize'
               }}>{indicatorsMapping[indicator]}</Label>
      </div>
    );
    const menuItems = Object.keys(indicatorsMapping).map((indicator, index) =>
      <div className={this.classes.menuItem} key={indicator}>
        <CustomCheckbox checked={this.state.checkedIndicators.indexOf(indicator) !== -1}
                        onChange={this.toggleCheckbox.bind(this, indicator)}
                        className={this.classes.label}
                        checkboxStyle={{backgroundColor: COLORS[index % COLORS.length]}}>{indicatorsMapping[indicator]}</CustomCheckbox>
      </div>
    );

    const defs = this.state.checkedIndicators.map(indicator => {
      const index = Object.keys(indicatorsMapping).indexOf(indicator);
      return <defs key={indicator}>
        <linearGradient id={indicator} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0.2}/>
          <stop offset="100%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0}/>
        </linearGradient>
      </defs>;
    });
    const lines = this.state.checkedIndicators.map(indicator => {
      const index = Object.keys(indicatorsMapping).indexOf(indicator);
      return <Area key={indicator}
                   isAnimationActive={false}
                   type='monotone'
                   dataKey={indicator}
                   stroke={COLORS[index % COLORS.length]}
                   fill={`url(#${indicator})`}
                   fillOpacity={1}
                   strokeWidth={1}/>;
    });
    const suggestedLines = this.state.checkedIndicators.map((indicator, index) =>
      <Area key={indicator + 1}
            type='monotone'
            dataKey={indicator + 'Suggested'}
            stroke={COLORS[index % COLORS.length]}
            fill={COLORS[index % COLORS.length]}
            strokeWidth={3}
            strokeDasharray="7 11"
            dot={{strokeDasharray: 'initial', fill: 'white'}}/>
    );

    const CustomizedLabel = React.createClass({
      render() {
        const {x, y} = this.props;
        return <svg>
          <image x={x - 12} y={y - 12} width="24" height="24" href="../../assets/objective-dot.svg"/>
        </svg>;
      }
    });

    const dots = this.state.checkedIndicators.map((indicator, index) =>
      this.props.objectives[indicator] &&
      <ReferenceDot {... this.props.objectives[indicator]}
                    fill="none"
                    stroke="none"
                    key={index}
                    label={<CustomizedLabel/>}
                    alwaysShow={true}/>
    );
    const tooltip = (data) => {
      const currentIndex = this.props.data.findIndex(month => month.name === data.label);
      const prevIndex = currentIndex - 1;
      if (data.active && data.payload && data.payload.length > 0) {
        return <div className={this.classes.customTooltip}>
          {
            data.payload.map((item, index) => {
              const indicator = item.dataKey;
              const colorIndex = Object.keys(indicatorsMapping).indexOf(indicator);
              if (item.value && !item.dataKey.includes('Suggested')) {
                return <div key={index}>
                  <div className={this.classes.customTooltipIndicator}>
                    {indicatorsMapping[indicator]}
                  </div>
                  <div className={this.classes.customTooltipValue} style={{color: COLORS[colorIndex % COLORS.length]}}>
                    {item.value}
                  </div>
                  {this.props.objectives[indicator] !== undefined &&
                  this.props.objectives[indicator].x === data.label ?
                    <div>
                      {indicatorsMapping[indicator]} (objective): {this.props.objectives[indicator].y}
                    </div>
                    : null}
                </div>;
              }
            })
          }
        </div>;
      }
      return null;
    };

    return <div className={this.classes.inner}>
      <div className={this.classes.menu}>
        <div className={this.classes.menuTitle}>
          Forecasting
        </div>
        <div className={this.classes.menuItems}>
          {menuItems}
        </div>
      </div>
      <div className={this.classes.chart}
           style={{marginTop: '80px', marginLeft: '80px', width: '-webkit-fill-available'}}>
        <ResponsiveContainer height={400} width='100%'>
          <AreaChart data={this.props.data}>
            <XAxis dataKey="name" style={{fontSize: '12px', color: '#354052', opacity: '0.5'}} tickLine={false}/>
            <YAxis axisLine={false}
                   tickLine={false}
                   tickFormatter={formatBudgetShortened}
                   style={{fontSize: '12px', color: '#354052', opacity: '0.5'}}
                   domain={['dataMin', 'dataMax']}/>
            <CartesianGrid vertical={false}/>
            {dots}
            <Tooltip content={tooltip.bind(this)} offset={0}/>
            {defs}
            {lines}
            {suggestedLines}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>;
  }

};