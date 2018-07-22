import React, {PropTypes} from 'react';
import Component from 'components/Component';
import style from 'styles/plan/table-cell.css';
import EditableCell from 'components/pages/plan/EditableCell';
import planStyle from 'styles/plan/plan.css';
import cellStyle from 'styles/plan/plan-cell.css';
import StateSelection from 'components/pages/plan/StateSelection';
import { formatBudget } from 'components/utils/budget';

const CONSTRAINT_MAPPING = {
  'none': {isConstraint: false, text: 'None'},
  'soft': {isConstraint: true, isSoft: true, text: 'Soft'},
  'hard': {isConstraint: true, isSoft: false, text: 'Hard'}
};

export default class TableCell extends Component {

  style = style;
  styles = [cellStyle, planStyle];

  static propTypes = {
    primaryValue: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
    secondaryValue: PropTypes.string,
    isConstraitsEnabled: PropTypes.bool,
    key: PropTypes.number,
    constraintChange: PropTypes.func,
    isConstraint: PropTypes.bool,
    isSoft: PropTypes.bool,
    className: PropTypes.string,
    isEditMode: PropTypes.bool,
    onChange: PropTypes.func,
    acceptSuggestion: PropTypes.func,
    dragEnter: PropTypes.func,
    commitDrag: PropTypes.func,
    dragStart: PropTypes.func,
    isDragging: PropTypes.bool,
    style: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
      suggestionBoxOpen: false,
      hoverCell: false
    };
  }

  getConstraint = () => {
    return !this.props.isConstraint ? 'none' :
      this.props.isSoft ? 'soft' : 'hard';
  };

  changeConstraint = (changeTo) => {
    const typeOptions = CONSTRAINT_MAPPING[changeTo];
    this.props.constraintChange(typeOptions.isConstraint, typeOptions.isSoft);
  };

  changeSuggestionBoxOpen = (isOpen) => {
    this.setState({suggestionBoxOpen: isOpen});
  }

  showExtraInfo = () => {
    return this.state.hoverCell || this.state.suggestionBoxOpen;
  }

  render() {
    const showSuggestion = this.props.secondaryValue && (this.props.secondaryValue !== this.props.primaryValue);

    return this.props.isEditMode ?
      <td className={this.classes.valueCell} key={this.props.key} style={this.props.style}>
        <EditableCell value={this.props.primaryValue}
                      onChange={this.props.onChange}
                      drop={this.props.commitDrag}
                      dragStart={this.props.dragStart}
                      dragEnter={this.props.dragEnter}
                      isDragging={this.props.isDragging}
        />
      </td>
      : <td className={this.classes.valueCell}
            onMouseEnter={() => {
              this.setState({hoverCell: true});
            }}
            onMouseLeave={() => {
              this.setState({hoverCell: false});
            }}
            style={this.props.style}
            key={this.props.key}>

        <div hidden={!this.showExtraInfo()}>
          {this.props.isConstraitsEnabled ?
            <StateSelection currentConstraint={this.getConstraint()}
                            constraintOptions={Object.keys(CONSTRAINT_MAPPING).map(key => {
                              return {key: key, text: CONSTRAINT_MAPPING[key].text};
                            })}
                            changeConstraint={this.changeConstraint}
                            changeSuggestionBoxOpen={this.changeSuggestionBoxOpen}
            />
            : null}
        </div>
        <div className={this.classes.cellItem}>
          <div>
            ${formatBudget(this.props.primaryValue)}
            {showSuggestion && this.showExtraInfo() ?
              <div className={this.classes.secondaryValue}>
                ${formatBudget(this.props.secondaryValue)}
              </div> : null}
          </div>
          <div className={planStyle.locals.right}>
            <div className={cellStyle.locals.accept} onClick={this.props.acceptSuggestion}/>
          </div>
        </div>
      </td>;
  }
}