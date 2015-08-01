import React from 'react';
import $ from 'jquery';

import IntroductionActions from './introduction-actions';
import IntroductionStore from './introduction-store';

import IntroductoryHook from '../content/introductory-hook';
import IntroductoryPage from '../content/introductory-page';


export default class extends React.Component {
  constructor(props) {
    super(props);
    let flowtype = {
      minimum   : 500,
      maximum   : 1074,
      minFont   : 12,
      maxFont   : 40,
      fontRatio : 50
    };

    let expanded = false;

    // ES6 implicitly { expanded : expanded, flowtype : flowtype }
    this.state = { expanded, flowtype }; 

    this.onCollapse = this.onCollapse.bind(this);
    this.onExpand = this.onExpand.bind(this);
    this.onVisualize = this.onVisualize.bind(this);
    this.onIntroductionStore = this.onIntroductionStore.bind(this);
  }

  render() {

    let collapse = (
      <button className='btn btn-default btn-lg' onClick={this.onCollapse}
        aria-label='Show less'>
        <span className='glyphicon glyphicon-menu-up' 
          aria-hidden='true'></span> Show less
      </button>
    );

    let expand = (
      <button className='btn btn-default btn-lg' onClick={this.onExpand}
        aria-label='Show more'>
        <span className='glyphicon glyphicon-menu-down' 
          aria-hidden='true'></span> Show more
      </button>
    );

    let visualize = (
      <button className='btn btn-default btn-lg' onClick={this.onVisualize}
        aria-label='Visualize!'>
        <span className='glyphicon glyphicon-stats' 
          aria-hidden='true'></span> Visualize!
      </button>
    );

    let collapsed = (
      <div>
        { expand } { visualize }
      </div>
    );

    let expanded = (
      <div>
        { collapse } { visualize }
        <IntroductoryPage />
        { collapse } { visualize }
      </div>
    );

    return (
      <div className='introduction' ref='introduction'>
        <IntroductoryHook /> 
        <div className={ this.state.expanded ? 'collapsed gradual' : 'gradual' }>
          { collapsed }
        </div>
        <div className={ this.state.expanded ? 'gradual' : 'collapsed gradual' }>
          { expanded }
        </div>
      </div>
    );
  }

  componentDidMount() {
    let introduction = React.findDOMNode(this.refs.introduction);
    $(introduction).flowtype(this.state.flowtype);

    this.unsubscribeFromIntroductionStore =
      IntroductionStore.listen(this.onIntroductionStore);
  }

  componentWillUnmount() {
    this.unsubscribeFromIntroductionStore();
  }

  onCollapse() {
    IntroductionActions.collapse();
  }

  onExpand() {
    console.log('onexpand called');
    IntroductionActions.expand();
  }

  onVisualize() {
    IntroductionActions.visualize();
  }

  onIntroductionStore(newState) {
    console.log('onIntroductionStore() called with:', newState);
    this.setState(newState);
  }

}

