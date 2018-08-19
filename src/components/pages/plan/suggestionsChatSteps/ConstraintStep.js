import Component from 'components/Component';
import Textfield from 'components/controls/Textfield';
import React, {PropTypes} from 'react';
import style from 'styles/plan/plan-optimization-popup.css';
import MultiSelect from 'components/controls/MultiSelect';
import {getNickname} from 'components/utils/channels';

export default class ConstraintStep extends Component {
  style = style;

  static PropTypes = {
    onConstraintAdd: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired,
    getChannelsLockOptions: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = {
      changeObject: this.isChannelsLimitConstraint() ? {channelsLimit: 2} : {channelsToLock: []},
      setClicked: false
    };
  }

  handleChangeMulti = (event) => {
    const channelsToLock = event.map((obj) => {
      return obj.value;
    });

    this.setState({changeObject: {channelsToLock}});
  };

  isChannelsLimitConstraint = () => {
    return this.props.type === 'channelsNumber';
  };

  render() {
    const disableInput = this.state.setClicked;
    const beforeInputText = this.isChannelsLimitConstraint() ? `Don't touch more than` : `Don’t touch`;
    const channelsLockOptions = this.props.getChannelsLockOptions && this.props.getChannelsLockOptions();
    const channelsOptions = channelsLockOptions && channelsLockOptions.map((channelKey) => {
      return {
        value: channelKey,
        label: getNickname(channelKey)
      };
    });

    return <div className={this.classes.optionsWrapper}>
      <div className={this.classes.constraintStep}>
        <span className={this.classes.constraintText}>{beforeInputText}</span>
        {this.isChannelsLimitConstraint()
          ? <div style={{
            display: 'inherit',
            alignItems: 'inherit'
          }}>
            <Textfield type="number" value={this.state.changeObject.channelsLimit}
                       onChange={(e) =>
                         this.setState({
                           changeObject: {
                             channelsLimit: parseInt(e.target.value)
                           }
                         })
                       }
                       min="2"
                       max="7"
                       disabled={disableInput}
                       className={this.classes.inputField}
                       inputClassName={this.classes.numberInput}/>
            <span className={this.classes.constraintText}>channels</span>
          </div>
          : <MultiSelect disabled={disableInput}
                         selected={this.state.changeObject.channelsToLock}
                         select={{name: 'Channels', options: channelsOptions}}
                         onChange={this.handleChangeMulti}
                         className={this.classes.inputField}
                         style={{width: '250px'}}
          />

        }
        <div className={this.classes.setButton}
             data-chosen={this.state.setClicked ? true : null}
             onClick={() => {
               if (!this.state.setClicked) {
                 this.setState({setClicked: true});
                 this.props.setConstraintAndRunPlanner(this.state.changeObject,
                   () => this.props.triggerNextStep({
                     trigger: '7'
                   })
                 );
               }
             }}>
          Set
        </div>
      </div>
    </div>;
  }
}