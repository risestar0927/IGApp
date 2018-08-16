import Component from 'components/Component';
import Page from 'components/Page';
import React, {PropTypes} from 'react';
import ChatBot from 'react-simple-chatbot';
import style from 'styles/plan/plan-optimization-popup.css';
import ConstraintStep from 'components/pages/plan/ConstraintStep';
import UserOptionsStep from 'components/pages/plan/UserOptionsStep';
import uniq from 'lodash/uniq';
import InsightStep from 'components/pages/plan/InsightStep';

export default class PlanOptimizationPopup extends Component {

  style = style;

  static propTypes = {
    hidden: PropTypes.bool
  };

  initialConstraints = {
    channelsLimit: null,
    channelsToBlock: []
  };

  constructor(props) {
    super(props);
    this.state = {
      constraints: this.initialConstraints,
      currentSuggestions: []
    };
  }

  getSteps = () => [
    {
      id: '0',
      message: 'Hey there! \n Looking to improve your plan?',
      trigger: '1'
    },
    {
      id: '1',
      component: <UserOptionsStep options={[
        {value: 1, label: 'No.', trigger: '2'},
        {value: 2, label: 'Sure!', trigger: '3'}
      ]}/>
    },
    {
      id: '2',
      message: 'That\'s too bad, I\'m always here if you need anything.',
      trigger: '15'
    },
    {
      id: '3',
      message: 'That’s great :) \n Do you have specific requirements for the reallocation suggestion?',
      trigger: '4'
    },
    {
      id: '4',
      component: <UserOptionsStep options={[
        {value: 1, label: 'No, I want the optimal suggestion', trigger: '5'},
        {
          value: 2,
          label: 'yes, I want to limit the number of channels that will be touched in the suggestion',
          trigger: '6'
        }
      ]}/>
    },
    {
      id: '5',
      component: <FunctionStep
        funcToRun={(callback) => this.setConstraintAndRunPlanner(this.initialConstraints, callback)}
        textForUser='OK running optimal plan'
        nextStepId='7'
      />,
      asMessage: true
    },
    {
      id: '6',
      component: <ConstraintStep type='channelsNumber' setConstraintAndRunPlanner={this.setConstraintAndRunPlanner}/>
    },
    {
      id: '7',
      component: <InsightStep getInsightData={this.getInsightData} planDate={this.props.planDate}/>
    },
    {
      id: '8',
      message: 'Awesome! Are you looking for another improvement suggestion?',
      trigger: '9'
    },
    {
      id: '9',
      component: <UserOptionsStep options={[
        {value: 1, label: 'No', trigger: '2'},
        {
          value: 2,
          label: 'Yes',
          trigger: '10'
        }
      ]}/>
    },
    {
      id: '10',
      component: <FunctionStep funcToRun={this.clearState}
                               nextStepId='4'
                               textForUser={'That’s great :)\n' +
                               'Do you have specific requirements for the reallocation suggestion?'}/>,
      asMessage: true
    },
    {
      id: '11',
      message: 'Why?',
      trigger: '12'
    },
    {
      id: '12',
      component: <UserOptionsStep options={[
        {value: 1, label: 'I want to lock budgets for specific channels', trigger: '13'},
        {value: 2, label: 'No particular reason, I just don’t like it', trigger: '14'},
        {
          value: 3,
          label: 'I want to limit the number of channels that will be touched in the suggestion',
          trigger: '6'
        }
      ]}/>
    },
    {
      id: '13',
      component: <ConstraintStep type='lockingChannels'
                                 setConstraintAndRunPlanner={this.setConstraintAndRunPlanner}
                                 getChannelsBlockOptions={() =>
                                   uniq(this.state.currentSuggestions.map((suggestion) => suggestion.channel))
                                 }/>
    },
    {
      id: '14',
      component: <FunctionStep funcToRun={this.noParticularReasonAndRun}
                               textForUser={'OK trying to run again'}
                               nextStepId='7'/>,
      asMessage: true
    },
    {
      id: '15',
      component: <div className={this.classes.optionsWrapper}>
        <div className={this.classes.option} onClick={this.props.onClose}>
          Close
        </div>
      </div>
    }];

  clearState = (callback) => {
    this.setState({
      constraints: this.initialConstraints,
      currentSuggestions: []
    }, callback);
  };

  setConstraintAndRunPlanner = (changeObject, callback) => {
    this.setState({
        constraints: {
          ...this.state.constraints,
          ...changeObject
        }
      }
      , () => this.runPlannerWithConstraints(callback));
  };

  noParticularReasonAndRun = (callback) => {
    console.log('setting lock on all suggested channels');
    this.runPlannerWithConstraints(callback);
  };

  runPlannerWithConstraints = (callback) => {
    this.props.planWithConstraints(this.state.constraints,
      (suggestions) => {
        this.setState({currentSuggestions: suggestions});
        callback();
      });
  };

  getInsightData = () => {
    const fromChannels = [];
    const toChannels = [];
    this.state.currentSuggestions.forEach(item => {
      if (item.fromBudget > item.toBudget) {
        fromChannels.push(item);
      }
      else {
        toChannels.push(item);
      }
    });
    return {fromChannels, toChannels};
  };

  render() {
    return <div hidden={this.props.hidden}>
      <Page popup={true} width='650px' contentClassName={this.classes.content} onClose={this.props.onClose}>
        <ChatBot className={this.classes.chatbot}
                 style={{
                   background: '#ffffff',
                   fontFamily: 'inherit',
                   width: '100%',
                   borderRadius: 'inherit',
                   boxShadow: 'none'
                 }}
                 botAvatar='icons/InfiniGrow - white logo SVG.svg'
                 avatarStyle={{
                   backgroundColor: '#6c7482',
                   borderRadius: '50%',
                   padding: '11px 0',
                   minWidth: '15px',
                   width: '34px',
                   height: '12px',
                   marginBottom: '15px'
                 }}
                 bubbleStyle={{
                   clipPath: 'polygon(9px 0px, 100% 0px, 100% 100%, 9px 100%, 9px calc(100% - 35px), 0px calc(100% - 25px), 9px calc(100% - 15px))',
                   borderRadius: '14px 7px 7px 14px',
                   paddingLeft: '20px',
                   margin: '0 0 15px',
                   background: '#e6e8f0',
                   fontSize: '18px',
                   fontWeight: '500',
                   color: '#3e495a',
                   boxShadow: 'none',
                   whiteSpace: 'pre-line'
                 }}
                 hideUserAvatar={true}
                 width='650px'
                 headerComponent={<CustomizedHeader/>}
                 hideSubmitButton={true}
                 steps={this.getSteps()}
                 customStyle={{
                   background: 'transparent',
                   border: 'none',
                   boxShadow: 'none',
                   padding: '0',
                   margin: '0 0 7px 0'
                 }}
                 inputStyle={{
                   display: 'none'
                 }}
                 contentStyle={{
                   paddingRight: '6px'
                 }}/>
      </Page>
    </div>;
  }
}

export class CustomizedHeader extends Component {

  style = style;

  render() {
    return <div>
      <div className={this.classes.title}>
        Improve your current committed plan
      </div>
      <div className={this.classes.subtitle}>
        Here you can get specific improvement suggestions on your current plan.
      </div>
    </div>;
  }
}

class FunctionStep extends Component {
  static PropTypes = {
    funcToRun: PropTypes.func.isRequired,
    textForUser: PropTypes.string.isRequired,
    nextStepId: PropTypes.string.isRequired
  };

  componentDidMount() {
    this.props.funcToRun(() => {
      this.props.triggerNextStep({trigger: this.props.nextStepId});
    });
  }

  render() {
    return <div>{this.props.textForUser}</div>;
  }
}