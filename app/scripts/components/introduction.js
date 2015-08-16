import React from 'react';
import ClassNames from 'classnames';

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
        aria-label='More words'>
        <span className='glyphicon glyphicon-menu-up' 
          aria-hidden='true'></span> More Words
      </button>
    );

    let expand = (
      <button className='btn btn-default btn-lg' onClick={this.onExpand}
        aria-label='Less words'>
        <span className='glyphicon glyphicon-menu-down' 
          aria-hidden='true'></span> Less words
      </button>
    );

    let visualize = (
      <button className='btn btn-default btn-lg' onClick={this.onVisualize}
        aria-label='Visualize!'>
        <span className='glyphicon glyphicon-stats' 
          aria-hidden='true'></span> Visualize!
      </button>
    );

    let introductoryPageMaxHeight = this.state.introductoryPageMaxHeight;

    let introductoryPageContainerStyle =
      (introductoryPageMaxHeight && this.state.expanded)
      ? { 
        maxHeight : introductoryPageMaxHeight,
        transitionDuration : '0.5s',
        transitionProperty : 'max-height',
        transitionTimingFunction : 'ease-in-out'
      } : { 
        maxHeight : 0, 
        overflowY : 'hidden',
        transitionDuration : '0.5s',
        transitionProperty : 'max-height',
        transitionTimingFunction : 'ease-in-out'
      };

    return (
      <div className='introduction' ref='introduction'>
        <IntroductoryHook /> 
        { this.state.expanded ? collapse : expand } { visualize }
        <div 
          className='introductory-page-container'
          style={ introductoryPageContainerStyle }
          ref='introductoryPageContainer'>
          <div 
            className='introductory-page' 
            ref='introductoryPage'>
            <IntroductoryPage />
            { collapse } { visualize }
          </div>
        </div>

      </div>
    );

    /*
      <div className={ this.state.expanded ? 'collapsed gradual' : 'gradual' }>
          { collapsed }
        </div>
        <div className={ this.state.expanded ? 'gradual' : 'collapsed gradual' }>
          { expanded }
        </div>
    */
  }



  componentDidMount() {
    this.unsubscribeFromIntroductionStore =
      IntroductionStore.listen(this.onIntroductionStore);

    let introduction = React.findDOMNode(this.refs.introduction);
    $(introduction).flowtype(this.state.flowtype);

    this.updateMaxHeight();
  }

  componentWillUnmount() {
    this.unsubscribeFromIntroductionStore();
  }

  onCollapse() {
    IntroductionActions.collapse();
  }

  onExpand() {
    console.log('onexpand called');
    this.updateMaxHeight();
    IntroductionActions.expand();
  }

  onVisualize() {
    IntroductionActions.visualize();
  }

  onIntroductionStore(newState) {
    console.log('onIntroductionStore() called with:', newState);
    this.setState(newState);
  }

  updateMaxHeight() {
    let introductoryPage =
      React.findDOMNode(this.refs.introductoryPage);
    let height = $(introductoryPage).height();

    this.setState({ introductoryPageMaxHeight : height });
  }

}

