import React from 'react';
import Component from 'components/Component';
import style from 'styles/onboarding/onboarding.css';
import serverCommunication from 'data/serverCommunication';
import Loading from 'components/pages/indicators/Loading';
import Select from 'components/controls/Select';
import salesForceStyle from 'styles/indicators/salesforce-automatic-popup.css';
import Page from 'components/Page';
import Title from 'components/onboarding/Title';
import Button from 'components/controls/Button';
import Label from 'components/ControlsLabel';
import MultiSelect from 'components/controls/MultiSelect';

export default class HubspotAutomaticPopup extends Component {

  style = style;
  styles = [salesForceStyle];

  constructor(props) {
    super(props);
    this.state = {
      code: null,
      loading: false,
      mapping: {
      },
      owners: []
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.hidden && this.props.hidden != nextProps.hidden) {
      serverCommunication.serverRequest('get', 'hubspotapi')
        .then((response) => {
          if (response.ok) {
            response.json()
              .then((data) => {
                const win = window.open(data);
                const timer = setInterval(() => {
                  if (win.closed) {
                    clearInterval(timer);
                    const code = localStorage.getItem('code');
                    if (code) {
                      localStorage.removeItem('code');
                      this.setState({code: code});
                      serverCommunication.serverRequest('post', 'hubspotapi', JSON.stringify({code: code}))
                        .then((response) => {
                          if (response.ok) {
                            response.json()
                              .then((data) => {
                                this.setState({owners: data});
                              });
                          }
                          else if (response.status == 401) {
                            history.push('/');
                          }
                        })
                        .catch(function (err) {
                          console.log(err);
                        });
                    }
                    else {
                      this.props.close();
                    }
                  }
                }, 1000);

              });
          }
          else if (response.status == 401) {
            history.push('/');
          }
        })
        .catch(function (err) {
          console.log(err);
        });
    }
  }

  getUserData() {
    this.setState({loading: true});
    serverCommunication.serverRequest('put', 'hubspotapi', JSON.stringify({mapping: this.state.mapping}), localStorage.getItem('region'))
      .then((response) => {
        if (response.ok) {
          response.json()
            .then((data) => {
              this.props.setDataAsState(data);
            });
        }
        else if (response.status == 401) {
          history.push('/');
        }
        this.setState({loading: false});
      })
      .catch(function (err) {
        this.setState({loading: false});
        console.log(err);
      });
    this.props.close();
  }

  toggleCheckbox(indicator) {
    let mapping = this.state.mapping;
    if (mapping[indicator] !== undefined) {
      delete mapping[indicator];
    }
    else {
      mapping[indicator] = '';
    }
    this.setState({mapping: mapping});
  }

  toggleCheckboxMulti(key) {
    let mapping = this.state.mapping;
    if (mapping[key]) {
      delete mapping[key];
    }
    else {
      mapping[key] = [];
    }
    this.setState({mapping: mapping});
  }

  handleChange(indicator, event) {
    let mapping = this.state.mapping;
    mapping[indicator] = event.value;
    this.setState({mapping: mapping});
  }

  handleChangeMulti(key, event) {
    let mapping = this.state.mapping;
    mapping[key] = event.map((obj) => {
      return obj.value;
    });
    this.setState({mapping: mapping});
  }

  render(){
    const selects = {
      tables: {
        select: {
          name: 'tables',
          options: [
            {value: 'contacts', label: 'contacts'},
            {value: 'companies', label: 'companies'}
          ]
        }
      },
      owners: {
        select: {
          name: 'owners',
          options: this.state.owners
            .map(owner => {
              return {value: owner.ownerId, label: owner.firstName + ' ' + owner.lastName + ' (' + owner.email + ')'}
            })
        }
      }
    };
    return <div>
      <Loading hidden={ !this.state.loading }/>
      <div hidden={ this.props.hidden }>
        { this.state.code ?
          <Page popup={ true } width={'680px'} innerClassName={ salesForceStyle.locals.inner } contentClassName={ salesForceStyle.locals.content }>
            <Title title="Hubspot" subTitle="Define which stages should be taken from Hubspot"/>
            <div className={ this.classes.row }>
              <div className={ this.classes.cols }>
                <div className={ this.classes.colLeft }>
                  <Label checkbox={this.state.mapping.blogSubscribers !== undefined} onChange={ this.toggleCheckbox.bind(this, 'blogSubscribers') } className={ salesForceStyle.locals.label }>Blog Subscribers</Label>
                </div>
                <div className={ this.classes.colCenter }>
                  <div className={ salesForceStyle.locals.arrow }/>
                </div>
                <div className={ this.classes.colRight }>
                  <Select { ... selects.tables} selected={ this.state.mapping.blogSubscribers } onChange={ this.handleChange.bind(this, 'blogSubscribers') } disabled={ this.state.mapping.blogSubscribers === undefined } style={{ width: 'initial'}} placeholder="Group By"/>
                </div>
              </div>
            </div>
            <div className={ this.classes.row }>
              <div className={ this.classes.cols }>
                <div className={ this.classes.colLeft }>
                  <Label checkbox={this.state.mapping.MCL !== undefined} onChange={ this.toggleCheckbox.bind(this, 'MCL') } className={ salesForceStyle.locals.label }>Leads</Label>
                </div>
                <div className={ this.classes.colCenter }>
                  <div className={ salesForceStyle.locals.arrow }/>
                </div>
                <div className={ this.classes.colRight }>
                  <Select { ... selects.tables} selected={ this.state.mapping.MCL } onChange={ this.handleChange.bind(this, 'MCL') } disabled={ this.state.mapping.MCL === undefined } style={{ width: 'initial'}} placeholder="Group By"/>
                </div>
              </div>
            </div>
            <div className={ this.classes.row }>
              <div className={ this.classes.cols }>
                <div className={ this.classes.colLeft }>
                  <Label checkbox={this.state.mapping.MQL !== undefined} onChange={ this.toggleCheckbox.bind(this, 'MQL') } className={ salesForceStyle.locals.label }>Marketing Qualified Leads</Label>
                </div>
                <div className={ this.classes.colCenter }>
                  <div className={ salesForceStyle.locals.arrow }/>
                </div>
                <div className={ this.classes.colRight }>
                  <Select { ... selects.tables} selected={ this.state.mapping.MQL } onChange={ this.handleChange.bind(this, 'MQL') } disabled={ this.state.mapping.MQL === undefined } style={{ width: 'initial'}} placeholder="Group By"/>
                </div>
              </div>
            </div>
            <div className={ this.classes.row }>
              <div className={ this.classes.cols }>
                <div className={ this.classes.colLeft }>
                  <Label checkbox={this.state.mapping.SQL !== undefined} onChange={ this.toggleCheckbox.bind(this, 'SQL') } className={ salesForceStyle.locals.label }>Sales Qualified Leads</Label>
                </div>
                <div className={ this.classes.colCenter }>
                  <div className={ salesForceStyle.locals.arrow }/>
                </div>
                <div className={ this.classes.colRight }>
                  <Select { ... selects.tables} selected={ this.state.mapping.SQL } onChange={ this.handleChange.bind(this, 'SQL') } disabled={ this.state.mapping.SQL === undefined } style={{ width: 'initial'}} placeholder="Group By"/>
                </div>
              </div>
            </div>
            <div className={ this.classes.row }>
              <div className={ this.classes.cols }>
                <div className={ this.classes.colLeft }>
                  <Label checkbox={this.state.mapping.opps !== undefined} onChange={ this.toggleCheckbox.bind(this, 'opps') } className={ salesForceStyle.locals.label }>Opportunities</Label>
                </div>
                <div className={ this.classes.colCenter }>
                  <div className={ salesForceStyle.locals.arrow }/>
                </div>
                <div className={ this.classes.colRight }>
                  <Select { ... selects.tables} selected={ this.state.mapping.opps } onChange={ this.handleChange.bind(this, 'opps') } disabled={ this.state.mapping.opps === undefined } style={{ width: 'initial'}} placeholder="Group By"/>
                </div>
              </div>
            </div>
            <div className={ this.classes.row }>
              <div className={ this.classes.cols }>
                <div className={ this.classes.colLeft }>
                  <Label checkbox={this.state.mapping.users !== undefined} onChange={ this.toggleCheckbox.bind(this, 'users') } className={ salesForceStyle.locals.label }>Paying Accounts</Label>
                </div>
                <div className={ this.classes.colCenter }>
                  <div className={ salesForceStyle.locals.arrow }/>
                </div>
                <div className={ this.classes.colRight }>
                  <Select { ... selects.tables} selected={ this.state.mapping.users } onChange={ this.handleChange.bind(this, 'users') } disabled={ this.state.mapping.users === undefined } style={{ width: 'initial'}}  placeholder="Group By"/>
                </div>
              </div>
            </div>
            <div className={ this.classes.row }>
              <Label checkbox={!!this.state.mapping.owners} onChange={ this.toggleCheckboxMulti.bind(this, 'owners') }>Group by hubspot owners / regions (optional)</Label>
              <MultiSelect { ... selects.owners} selected={ this.state.mapping.owners } onChange={ this.handleChangeMulti.bind(this, 'owners') } disabled={ !this.state.mapping.owners } style={{ width: 'initial'}}  placeholder="Select your region owners"/>
            </div>
            <div className={ this.classes.footer }>
              <div className={ this.classes.footerLeft }>
                <Button type="normal" style={{ width: '100px' }} onClick={ this.props.close }>Cancel</Button>
              </div>
              <div className={ this.classes.footerRight }>
                <Button type="primary2" style={{ width: '100px' }} onClick={ this.getUserData.bind(this) }>Done</Button>
              </div>
            </div>
          </Page>
          : null }
      </div>
    </div>
  }

}