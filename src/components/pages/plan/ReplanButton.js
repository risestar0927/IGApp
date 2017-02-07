import React from 'react';
import Component from 'components/Component';

import style from 'styles/onboarding/buttons.css';
import Button from 'components/controls/Button';

export default class NextButton extends Component {
  style = style;

  render() {
    return <Button type="normalAccent2"
              onClick={ this.props.onClick }
              className={ this.classes.planButton }
              icon="buttons:replan"
              style={{
        width: '220px'
              }}
      >
      Plan next month ( { this.props.numberOfPlanUpdates} )
      </Button>
  }
}