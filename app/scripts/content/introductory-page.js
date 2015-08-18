import React from 'react';export default class extends React.Component {  constructor(props) { super(props); }  render() {    return (      <div>      <h1>Grounds for Truth</h1>
<p>It seems to be common knowledge that the San Francisco Bay Area is an expensive place to live. Angela heard it is impossible to find affordable rent when she moved to Santa Clara County from Canada. Ross heard it is impossible to find a house near his work when he moved to San Mateo from the New York. For both Angela and Ross, the foretold impossible was possible.</p>
<p>Is there any truth to the reputation the Bay Area has received? Listening to people in a coffee shop you might think the  “housing crisis” is a something that happened unexpectedly. You might also think it is the “high paid technology workers” who are driving prices up.  Is the Bay Area really that unaffordable?</p>
<p>This site will help you learn the truth to the coffee shop chatter. Looking over nine years of US Census data, you can discover what is really happening in the Bay Area and what should be chocked up to be just coffee gossip.</p>
<p> </p>
<p><strong>Some interesting findings to get you started (we’ve included our own observations looking at San Francisco County):</strong></p>
<p><em>How many technical workers are there in the Bay Area counties, and how has it changed over time?</em> [Demographic &gt; Tech Workers]</p>
<pre><code>* In San Francisco County it is 14%
* Notice the climbing trend in San Francisco County, but not in Santa Clara County 
(home to Apple, Google, LinkedIn and Facebook, to name a few).
</code></pre>
<p><em>How much does the lowest quintile median income differ from the highest quintile median income?</em> [Income &gt; Lowest 20% Income] [Income &gt; Top 20% Income]</p>
<pre><code>* In San Francisco County, $11,943 compared to $323,053.
* Just across the Golden Gate Bridge is Marin County, 
with $19,745 as the lowest quintile median income and $417,041 as the highest quintile median income.
</code></pre>
<p><em>Compare San Francisco County and Marin County on the median income for the top 5%.</em> [Income &gt; Top 5% Income]</p>
<pre><code>* San Francisco County: $586,684
* Marin County: $801,606
</code></pre>
<p><em>What percentage of homes are actually are worth over one million dollars?</em> [Housing &gt; Percent of Homes over $1 million]</p>
<pre><code>* In San Francisco County, 28% - just lower than the high of 31% in 2007
* In Santa Cruz, the percentage is actually 12 percentage points lower than its high in 2007.
</code></pre>
<p><em>How much do people spend of their income to pay rent (suggested rent should be no more than 30% of household income)?</em> [Housing &gt; Gross Rent (% of Income)]</p>
<pre><code>* In San Francisco, the median is 27.7%, and is actually the lowest of all the counties
</code></pre>
      </div>    );  }}