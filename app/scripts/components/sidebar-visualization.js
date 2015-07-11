import React from 'react';
import d3 from 'd3';
import SidebarData from '../data/sidebar-data';


export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data : SidebarData
    };
    console.log(this.state);
  }

  render() {
    return (
      <div className='sidebar'>
        <svg id='sidebar-svg'></svg>
      </div>
    );
  }

  componentDidMount() {
    console.log(document.querySelector('.sidebar'));

  }

  oldRender() {
    return (
      <div className="hero-unit">
        <h1>'Allo, 'Allo!</h1>
        <p>This is a React component.<br/>
           You now also have:</p>
        <ul>{this.state.items.map(this.renderItem)}</ul>
      </div>
    );
  }

  renderItem(item, index) {
    return <li key={index}>{item}</li>;
  }
}
