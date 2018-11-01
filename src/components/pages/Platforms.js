import React from 'react';
import Component from 'components/Component';
import Page from 'components/Page';
import style from 'styles/onboarding/onboarding.css';
import platformsStyle from 'styles/indicators/platforms.css';
import BackButton from 'components/pages/profile/BackButton';
import NextButton from 'components/pages/profile/NextButton';
import history from 'history';
import Title from 'components/onboarding/Title';
import Platform from 'components/pages/indicators/Platform';
import {isPopupMode} from 'modules/popup-mode';
import SalesforceAutomaticPopup from 'components/pages/indicators/SalesforceAutomaticPopup';
import HubspotAutomaticPopup from 'components/pages/indicators/HubspotAutomaticPopup';
import GoogleAutomaticPopup from 'components/pages/indicators/GoogleAutomaticPopup';
import LinkedinAutomaticPopup from 'components/pages/indicators/LinkedinAutomaticPopup';
import FacebookAutomaticPopup from 'components/pages/indicators/FacebookAutomaticPopup';
import TwitterAutomaticPopup from 'components/pages/indicators/TwitterAutomaticPopup';
import YoutubeAutomaticPopup from 'components/pages/indicators/YoutubeAutomaticPopup';
import StripeAutomaticPopup from 'components/pages/indicators/StripeAutomaticPopup';
import GoogleSheetsAutomaticPopup from 'components/pages/indicators/GoogleSheetsAutomaticPopup';
import MozAutomaticPopup from 'components/pages/indicators/MozAutomaticPopup';
import ReactDOM from 'react-dom';
import Button from 'components/controls/Button';
import ReactTooltip from 'react-tooltip';
import remove from 'lodash/remove';
import FacebookCampaignsPopup from 'components/importCampaignsPopups/FacebookCampaignsPopup';
import AdwordsCampaignsPopup from 'components/importCampaignsPopups/AdwordsCampaignsPopup';
import SalesforceCampaignsPopup from 'components/importCampaignsPopups/SalesforceCampaignsPopup';
import LinkedinCampaignsPopup from 'components/importCampaignsPopups/LinkedinCampaignsPopup';
import TwitterCampaignsPopup from 'components/importCampaignsPopups/TwitterCampaignPopup';

const PLATFORM_INDICATORS_MAPPING = {
  'Hubspot': ['MCL', 'MQL', 'SQL', 'opps', 'users', 'blogSubscribers', 'newMCL', 'newMQL', 'newSQL', 'newOpps', 'newUsers'],
  'Salesforce': ['MCL',
    'MQL',
    'SQL',
    'opps',
    'users',
    'CAC',
    'MRR',
    'ARPA',
    'newMCL',
    'newMQL',
    'newSQL',
    'newOpps',
    'newUsers'],
  'Google Analytics': ['sessions', 'bounceRate', 'averageSessionDuration', 'blogVisits'],
  'LinkedIn': ['linkedinEngagement', 'linkedinFollowers'],
  'Facebook': ['facebookEngagement', 'facebookLikes'],
  'Twitter': ['twitterFollowers', 'twitterEngagement'],
  'Youtube': ['youtubeSubscribers', 'youtubeEngagement'],
  'Stripe': ['MRR', 'LTV', 'churnRate'],
  'Google Sheets': ['MRR', 'LTV', 'CAC', 'churnRate'],
  'Moz': ['domainAuthority']
};

export default class Platforms extends Component {

  style = style;
  styles = [platformsStyle];

  constructor(props) {
    super(props);
    this.state = {
      visibleSections: {},
      loading: []
    };
  }

  componentDidMount() {
    const sections = ['crm', 'webAnalytics', 'social', 'payment', 'productivity', 'seo'];
    const visibleSections = {};
    sections.forEach(section => {
      visibleSections[section] = this.isTitleHidden(section);
    });
    this.setState({visibleSections: visibleSections});
  }

  isHidden(platform) {
    return !this.props.technologyStack.includes(platform);
  }

  isLoading = (platform) => {
    return this.state.loading.indexOf(platform) >= 0;
  };

  setLoading = (platform, isLoading) => {
    if (isLoading) {
      this.setState({
        loading: [...this.state.loading, platform]
      });
    }
    else {
      const newLoadingArray = [...this.state.loading];
      remove(newLoadingArray, (item) => item === platform);

      this.setState({
        loading: newLoadingArray
      });
    }
  };

  isTitleHidden = (title) => {
    const domElement = ReactDOM.findDOMNode(this.refs[title]);
    let isHidden = true;
    if (domElement) {
      let childrenArray = [...domElement.children];
      childrenArray.forEach(child => {
        isHidden = isHidden && child.hidden;
      });
    }
    return isHidden;
  };

  render() {
    return <div>
      <Page popup={isPopupMode()}
            className={!isPopupMode() ? this.classes.static : null}
            contentClassName={this.classes.content}
            innerClassName={this.classes.pageInner}
            width='100%'>
        <ReactTooltip place='right' effect='solid' id='platforms' html={true}/>
        <Title title="Integrations"/>
        <div>
          <SalesforceAutomaticPopup setDataAsState={this.props.setDataAsState} data={this.props.salesforceapi}
                                    ref="salesforce" affectedIndicators={PLATFORM_INDICATORS_MAPPING.Salesforce}
                                    actualIndicators={this.props.actualIndicators}
                                    loadingStarted={() => this.setLoading('salesforce', true)}
                                    loadingFinished={() => this.setLoading('salesforce', false)}
          />
          <HubspotAutomaticPopup setDataAsState={this.props.setDataAsState} data={this.props.hubspotAuto}
                                 updateState={this.props.updateState} ref="hubspot"
                                 affectedIndicators={PLATFORM_INDICATORS_MAPPING.Hubspot}
                                 actualIndicators={this.props.actualIndicators}
                                 loadingStarted={() => this.setLoading('hubspot', true)}
                                 loadingFinished={() => this.setLoading('hubspot', false)}
          />
          <GoogleAutomaticPopup setDataAsState={this.props.setDataAsState} data={this.props.googleAuto}
                                ref="googleAnalytics"
                                affectedIndicators={PLATFORM_INDICATORS_MAPPING['Google Analytics']}
                                actualIndicators={this.props.actualIndicators}
                                loadingStarted={() => this.setLoading('google', true)}
                                loadingFinished={() => this.setLoading('google', false)}
          />
          <LinkedinAutomaticPopup setDataAsState={this.props.setDataAsState} ref="linkedin"
                                  affectedIndicators={PLATFORM_INDICATORS_MAPPING.LinkedIn}
                                  actualIndicators={this.props.actualIndicators}
                                  loadingStarted={() => this.setLoading('linkedin', true)}
                                  loadingFinished={() => this.setLoading('linkedin', false)}
          />
          <FacebookAutomaticPopup setDataAsState={this.props.setDataAsState} ref="facebook"
                                  affectedIndicators={PLATFORM_INDICATORS_MAPPING.Facebook}
                                  actualIndicators={this.props.actualIndicators}/>
          <TwitterAutomaticPopup setDataAsState={this.props.setDataAsState} ref="twitter"
                                 affectedIndicators={PLATFORM_INDICATORS_MAPPING.Twitter}
                                 actualIndicators={this.props.actualIndicators}/>
          <YoutubeAutomaticPopup setDataAsState={this.props.setDataAsState} ref="youtube"
                                 affectedIndicators={PLATFORM_INDICATORS_MAPPING.Youtube}
                                 actualIndicators={this.props.actualIndicators}/>
          <StripeAutomaticPopup setDataAsState={this.props.setDataAsState} ref="stripe"
                                affectedIndicators={PLATFORM_INDICATORS_MAPPING.Stripe}
                                actualIndicators={this.props.actualIndicators}
                                loadingStarted={() => this.setLoading('stripe', true)}
                                loadingFinished={() => this.setLoading('stripe', false)}
          />
          <MozAutomaticPopup setDataAsState={this.props.setDataAsState}
                             defaultUrl={this.props.mozapi
                               ? this.props.mozapi.url
                               : this.props.userAccount.companyWebsite}
                             ref="moz" affectedIndicators={PLATFORM_INDICATORS_MAPPING.Moz}
                             actualIndicators={this.props.actualIndicators}
                             loadingStarted={() => this.setLoading('moz', true)}
                             loadingFinished={() => this.setLoading('moz', false)}

          />
          <GoogleSheetsAutomaticPopup setDataAsState={this.props.setDataAsState} data={this.props.googleSheetsAuto}
                                      ref="googleSheets"
                                      affectedIndicators={PLATFORM_INDICATORS_MAPPING['Google Sheets']}
                                      actualIndicators={this.props.actualIndicators}
                                      loadingStarted={() => this.setLoading('sheets', true)}
                                      loadingFinished={() => this.setLoading('sheets', false)}
          />
          <LinkedinCampaignsPopup setDataAsState={this.props.setDataAsState}
                                  ref='linkedinCampaigns'
                                  data={this.props.linkedinadsapi}
                                  userAccount={this.props.userAccount}
                                  loadingStarted={() => this.setLoading('linkedinCampaigns', true)}
                                  loadingFinished={() => this.setLoading('linkedinCampaigns', false)}/>
          <TwitterCampaignsPopup setDataAsState={this.props.setDataAsState}
                                 ref='twitterCampaigns'
                                 data={this.props.twitteradsapi}
                                 userAccount={this.props.userAccount}
                                 loadingStarted={() => this.setLoading('twitterCampaigns', true)}
                                 loadingFinished={() => this.setLoading('twitterCampaigns', false)}
          />
          <FacebookCampaignsPopup setDataAsState={this.props.setDataAsState}
                                  ref='facebookCampaigns'
                                  data={this.props.facebookadsapi}
                                  userAccount={this.props.userAccount}
                                  loadingStarted={() => this.setLoading('facebookCampaigns', true)}
                                  loadingFinished={() => this.setLoading('facebookCampaigns', false)}
          />
          <AdwordsCampaignsPopup setDataAsState={this.props.setDataAsState}
                                 ref='adwordsCampaigns'
                                 data={this.props.adwordsapi}
                                 userAccount={this.props.userAccount}
                                 loadingStarted={() => this.setLoading('adwordsCampaigns', true)}
                                 loadingFinished={() => this.setLoading('adwordsCampaigns', false)}
          />
          <SalesforceCampaignsPopup setDataAsState={this.props.setDataAsState}
                                    ref='salesForceCampaigns'
                                    data={this.props.salesforceapi}
                                    userAccount={this.props.userAccount}
                                    loadingStarted={() => this.setLoading('salesForceCampaigns', true)}
                                    loadingFinished={() => this.setLoading('salesForceCampaigns', false)}
          />
          <Button type="secondary" style={{
            width: '193px',
            marginLeft: 'auto'
          }} onClick={() => {
            history.push('/profile/technology-stack');
          }}>
            Add more platforms
          </Button>
          <div hidden={this.state.visibleSections.crm}>
            <div className={platformsStyle.locals.platformTitle}>
              CRM
            </div>
            <div className={platformsStyle.locals.platformLine} ref="crm">
              <Platform
                connected={!!(this.props.salesforceapi && this.props.salesforceapi.tokens && this.props.salesforceapi.mapping)}
                title="Salesforce"
                loading={this.isLoading('salesforce')}
                indicators={PLATFORM_INDICATORS_MAPPING['Salesforce']} icon="platform:salesforce" open={() => {
                this.refs.salesforce.open();
              }} hidden={this.isHidden('salesforce')}/>
              <Platform connected={this.props.hubspotAuto} title="Hubspot"
                        loading={this.isLoading('hubspot')}
                        indicators={PLATFORM_INDICATORS_MAPPING['Hubspot']} icon="platform:hubspot" open={() => {
                this.refs.hubspot.open();
              }} hidden={this.isHidden('hubspot')}/>
            </div>
          </div>
          <div hidden={this.state.visibleSections.webAnalytics}>
            <div className={platformsStyle.locals.platformTitle}>
              Web Analytics
            </div>
            <div className={platformsStyle.locals.platformLine} ref="webAnalytics">
              <Platform connected={this.props.googleAuto} title="Google Analytics"
                        loading={this.isLoading('google')}
                        indicators={PLATFORM_INDICATORS_MAPPING['Google Analytics']} icon="platform:googleAnalytics"
                        open={() => {
                          this.refs.googleAnalytics.open();
                        }} hidden={this.isHidden('googleAnalytics')}/>
            </div>
          </div>
          <div hidden={this.state.visibleSections.social}>
            <div className={platformsStyle.locals.platformTitle}>
              Social
            </div>
            <div className={platformsStyle.locals.platformLine} ref="social">
              <Platform connected={this.props.isLinkedinAuto} title="LinkedIn"
                        loading={this.isLoading('linkedin')}
                        indicators={PLATFORM_INDICATORS_MAPPING['LinkedIn']} icon="platform:linkedin" open={() => {
                this.refs.linkedin.open();
              }} hidden={this.isHidden('linkedin')}/>
              <Platform connected={this.props.isFacebookAuto} title="Facebook"
                        indicators={PLATFORM_INDICATORS_MAPPING['Facebook']} icon="platform:facebook" open={() => {
                this.refs.facebook.open();
              }} hidden={this.isHidden('facebook')}/>
              <Platform connected={this.props.isTwitterAuto} title="Twitter"
                        indicators={PLATFORM_INDICATORS_MAPPING['Twitter']} icon="platform:twitter" open={() => {
                this.refs.twitter.open();
              }} hidden={this.isHidden('twitter')}/>
              <Platform connected={this.props.isYoutubeAuto} title="Youtube"
                        indicators={PLATFORM_INDICATORS_MAPPING['Youtube']} icon="platform:youtube" open={() => {
                this.refs.youtube.open();
              }} hidden={this.isHidden('youtube')}/>
            </div>
          </div>
          <div hidden={this.state.visibleSections.payment}>
            <div className={platformsStyle.locals.platformTitle}>
              Payment Providers
            </div>
            <div className={platformsStyle.locals.platformLine} ref="payment">
              <Platform connected={this.props.isStripeAuto} title="Stripe"
                        loading={this.isLoading('stripe')}
                        indicators={PLATFORM_INDICATORS_MAPPING['Stripe']} icon="platform:stripe" open={() => {
                this.refs.stripe.open();
              }} hidden={this.isHidden('stripe')}/>
            </div>
          </div>
          <div hidden={this.state.visibleSections.productivity}>
            <div className={platformsStyle.locals.platformTitle}>
              Productivity
            </div>
            <div className={platformsStyle.locals.platformLine} ref="productivity">
              <Platform connected={this.props.googleSheetsAuto} title="Google Sheets" loading={this.isLoading('sheets')}
                        indicators={PLATFORM_INDICATORS_MAPPING['Google Sheets']} icon="platform:googleSheets"
                        open={() => {
                          this.refs.googleSheets.open();
                        }} hidden={this.isHidden('googleSheets')}/>
            </div>
          </div>
          <div hidden={this.state.visibleSections.seo}>
            <div className={platformsStyle.locals.platformTitle}>
              SEO
            </div>
            <div className={platformsStyle.locals.platformLine} ref="seo">
              <Platform connected={this.props.mozapi} title="Moz" indicators={PLATFORM_INDICATORS_MAPPING['Moz']}
                        loading={this.isLoading('moz')}
                        icon="platform:moz" open={() => {
                this.refs.moz.open();
              }} hidden={this.isHidden('moz')}
              />
            </div>
          </div>
          <div>
            <div className={platformsStyle.locals.platformTitle}>
              Campaigns
            </div>
            <div className={platformsStyle.locals.platformLine} ref="crm">
              <div className={this.classes.row}>
                <Platform
                  connected={!!(this.props.salesforceapi && this.props.salesforceapi.tokens && this.props.salesforceapi.selectedCampaigns && this.props.salesforceapi.selectedCampaigns.length > 0)}
                  title="Salesforce Campaigns" loading={this.isLoading('salesForceCampaigns')}
                  icon="platform:salesforce"
                  connectButtonText='Import'
                  setDataAsState={this.props.setDataAsState}
                  open={() => {
                    this.refs.salesForceCampaigns.open();
                  }}
                />
              </div>
              <div className={this.classes.row}>
              </div>
              <Platform
                connected={!!this.props.adwordsapi} title="Adwords Campaigns"
                loading={this.isLoading('adwordsCampaigns')}
                icon='platform:googleAds'
                connectButtonText='Import'
                setDataAsState={this.props.setDataAsState}
                open={() => {
                  this.refs.adwordsCampaigns.open();
                }}
              />
              <Platform
                connected={!!(this.props.facebookadsapi && this.props.facebookadsapi.accountId && this.props.facebookadsapi.token)}
                title="Facebook Campaigns" loading={this.isLoading('facebookCampaigns')}
                icon='platform:facebookAds'
                connectButtonText='Import'
                setDataAsState={this.props.setDataAsState}
                open={() => {
                  this.refs.facebookCampaigns.open();
                }}
              />
              <Platform
                connected={!!(this.props.linkedinadsapi && this.props.linkedinadsapi.tokens && this.props.linkedinadsapi.accountId)}
                title="LinkedIn Campaigns"
                loading={this.isLoading('linkedinCampaigns')}
                icon='platform:linkedInAds'
                connectButtonText='Import'
                setDataAsState={this.props.setDataAsState}
                open={() => {
                  this.refs.linkedinCampaigns.open();
                }}
              />
              <Platform
                connected={!!(this.props.twitteradsapi && this.props.twitteradsapi.oauthAccessToken && this.props.twitteradsapi.oauthAccessTokenSecret && this.props.twitteradsapi.accountId)}
                title="Twitter Campaigns" loading={this.isLoading('twitterCampaigns')}
                icon='platform:twitterAds'
                connectButtonText='Import'
                setDataAsState={this.props.setDataAsState}
                open={() => {
                  this.refs.twitterCampaigns.open();
                }}
              />
            </div>
          </div>
          {isPopupMode() ?
            <div className={this.classes.footer}>
              <BackButton onClick={() => {
                history.push('/profile/technology-stack');
              }}/>
              <div style={{width: '30px'}}/>
              <NextButton onClick={() => {
                history.push('/settings/attribution/setup');
              }}/>
            </div>
            :
            <div style={{paddingBottom: '60px'}}/>
          }
        </div>
      </Page>
    </div>;
  }
}