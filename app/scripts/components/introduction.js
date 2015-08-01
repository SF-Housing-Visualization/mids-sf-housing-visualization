import React from 'react';
import IntroductoryPage from '../content/introductory-page';

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  render() {
    return (
      <div className='introduction'>
        <IntroductoryPage />
      </div>
    );
  }
}