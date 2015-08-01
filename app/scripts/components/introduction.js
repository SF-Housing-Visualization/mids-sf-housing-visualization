import React from 'react';
import $ from 'jquery';
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

    this.onExpandCollapse = this.onExpandCollapse.bind(this);
  }

  render() {
    return (
      <div className='introduction' ref='introduction'>
        <IntroductoryHook />
        <div>
          <button 
            className='expandCollapse' 
            onClick={this.onExpandCollapse}>
            expand or collapse
          </button>
        </div>
        <IntroductoryPage />
      </div>
    );
  }

  componentDidMount() {
    let introduction = React.findDOMNode(this.refs.introduction);
    $(introduction).flowtype(this.state.flowtype);
  }

  onExpandCollapse(event) {
    console.log('event', event, 'this', this);
  }
}