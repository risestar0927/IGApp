import React from 'react';
import Component from 'components/Component';
import ProgressBar from 'components/pages/campaigns/ProgressBar';
import Task from 'components/pages/campaigns/Task';
import CampaignTask from 'components/pages/campaigns/CampaignTask';
import { formatBudget } from 'components/utils/budget';
import style from 'styles/campaigns/check-list.css';

export default class Checklist extends Component {

  style=style

  constructor(props) {
    super(props);
    this.state = {
      ... props
    }
    this.toggleCompletion = this.toggleCompletion.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
  };

  addOrEditTask(name, budget, description, index) {
    let update = Object.assign({}, this.props.campaign);
    if (index) {
      update.tasks[index].name = name;
      update.tasks[index].budget = budget;
      update.tasks[index].description = description;
    }
    else {
      update.tasks.push({name: name, budget: budget, description: description, completed: false});
    }
    this.props.updateState({campaign: update});
    this.props.updateCampaign(this.props.campaign, this.props.index, this.props.channel)
      .then(() => {
      })
  }

  toggleCompletion(index) {
    let update = Object.assign({}, this.props.campaign);
    update.tasks[index].completed = !update.tasks[index].completed;
    this.props.updateState({campaign: update});
    this.props.updateCampaign(this.props.campaign, this.props.index, this.props.channel)
      .then(() => {
      })
  }

  deleteTask(index) {
    let update = Object.assign({}, this.props.campaign);
    update.tasks.splice(index,1);
    this.props.updateState({campaign: update});
    this.props.updateCampaign(this.props.campaign, this.props.index, this.props.channel)
      .then(() => {
      })
  }

  render() {
    let completedTasksCount = 0;
    const tasks = this.props.campaign.tasks.map((task, index) => {
      if (task.completed) {
        completedTasksCount++;
      }
      return <Task {... task} key={index} addOrEditTask={ this.addOrEditTask.bind(this) } index={ index } toggleCompletion={ this.toggleCompletion } deleteTask={ this.deleteTask }/>
    });
    return <div>
      <div className={ this.classes.budget }>
        <div className={ this.classes.budgetText }>
          Budget -
        </div>
        <div className={ this.classes.budgetNumber }>
          {" $" + formatBudget(this.props.campaign.actualSpent || this.props.campaign.budget)}
        </div>
      </div>
      <ProgressBar progress={(completedTasksCount / this.props.campaign.tasks.length) || 0}/>
      { tasks }
      <CampaignTask addOrEditTask={ this.addOrEditTask.bind(this) } isNew={ true }/>
    </div>
  }

}