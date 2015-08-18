import React from 'react';export default class extends React.Component {  constructor(props) { super(props); }  render() {    return (      <div>      <h3>What Is This?</h3>
<p>This was created by <em>Ross Boberg</em>, <em>John Bocharov</em>, and <em>Angela Gunn</em> to help people explore some great data already available about the San Franscisco Bay Area’s housing crisis.</p>
<h3>Where Did the Data Come From?</h3>
<p>Our data sources are:</p>
<blockquote>
<ul>
<li>US Census: <a href="http://factfinder.census.gov/faces/nav/jsf/pages/index.xhtml">http://factfinder.census.gov/faces/nav/jsf/pages/index.xhtml</a></li>
<li>California Association of Realtors (CARS): <a href="http://www.car.org/marketdata/data/">http://www.car.org/marketdata/data/</a></li>
</ul>
</blockquote>
      </div>    );  }}