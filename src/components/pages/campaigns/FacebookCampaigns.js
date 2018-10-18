import React from 'react';
import Component from 'components/Component';
import style from 'styles/onboarding/onboarding.css';
import salesForceStyle from 'styles/indicators/salesforce-automatic-popup.css';
import CRMStyle from 'styles/indicators/crm-popup.css';
import FacebookCampaignsPopup from 'components/pages/campaigns/importPopups/FacebookCampaignsPopup';

export default class FacebookCampaigns extends Component {

  style = style;
  styles = [salesForceStyle, CRMStyle];

  render(){
    return <div style={{ width: '100%' }}>
      <div className={ CRMStyle.locals.facebookads } onClick={ () => this.refs.popup.open() }/>
      <FacebookCampaignsPopup {...this.props} ref='popup' />
    </div>
  }

}