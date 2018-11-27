import React, {PropTypes} from 'react';
import Component from 'components/Component';
import Button from 'components/controls/Button';
import style from 'styles/paging.css';

export default class Paging extends Component {

  style = style;

  static propTypes = {
    onBack: PropTypes.func,
    onNext: PropTypes.func,
    title: PropTypes.any
  };

  render() {
    const {onBack, onNext, title} = this.props;

    return <div className={this.classes.titleBox}>
      <Button type="primary" style={{
        width: '36px'
      }} onClick={onBack}>
        <div className={this.classes.arrowLeft}/>
      </Button>
      <div className={this.classes.titleText} style={{
        width: '200px',
        textAlign: 'center'
      }}>
        {title}
      </div>
      <Button type="primary" style={{
        width: '36px'
      }} onClick={onNext}>
        <div className={this.classes.arrowRight}/>
      </Button>
    </div>;
  }
}