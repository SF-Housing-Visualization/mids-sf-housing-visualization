import React from 'react';
import ClassNames from 'classnames';

import $ from 'jquery';

import IntroductionActions from './introduction-actions';
import IntroductionStore from './introduction-store';

import Footer from '../content/footer';

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


    this.state = { flowtype }; 

  }

  render() {

    return (
      <div className='introduction' ref='footer'>
        <Footer /> 
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

    let footer = React.findDOMNode(this.refs.footer);
    $(footer).flowtype(this.state.flowtype);


  }

}

