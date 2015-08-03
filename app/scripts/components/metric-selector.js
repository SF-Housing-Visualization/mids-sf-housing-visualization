import React from 'react';

import SelectionStore from './selection-store';

import DimensionActions from './dimension-actions';

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = { };

    this.onSelectionChange = this.onSelectionChange.bind(this);

    /*this.initial = {
      geography: 'San Francisco',
      date: 2013,
      interval: [1999, 2015]
    };

    this.onIndexLoaded = this.onIndexLoaded.bind(this);
    this.onGeoMappingLoaded = this.onGeoMappingLoaded.bind(this);
    this.onSelectionChange = this.onSelectionChange.bind(this);
    this.onIntroductionStore = this.onIntroductionStore.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);
    this.onDimensionStore = this.onDimensionStore.bind(this);*/
  }

  componentDidMount() {
    this.unsubscribeFromSelectionStore =
      SelectionStore.listen(this.onSelectionChange);

    let visualizationHeaderHeight = this.updateVisualizationHeaderHeight();

    DimensionActions.resizeVisualizationHeader({
      visualizationHeaderHeight
    });
  }

  componentWillUnmount() {
    this.unsubscribeFromSelectionStore();
  }

  render() {
    let selectedPrimaryMetric = this.state.selectedPrimaryMetric;
    let primaryMetricDisplayName =
      selectedPrimaryMetric
      ? selectedPrimaryMetric.group + ' > ' + selectedPrimaryMetric.metric
      : 'Loading ...';

    let metric = (
      <button className='btn btn-default btn-lg' onClick={this.onSelectMetric}
        aria-label={ primaryMetricDisplayName }>
        <span className='glyphicon glyphicon-check' 
          aria-hidden='true'></span> { primaryMetricDisplayName }
      </button>
    );

    return (
      <div>
        <div ref='header'>
          <header ref='visualization' className='group'>
            { metric }
          </header>
        </div>
      </div>
    );
  }

  onDimensionStore(event) {
    console.log('MetricSelector onDimensionStore()', event);
  }

  onSelectMetric(event) {

  }

  onSelectionChange(newSelection) {
    this.setState(newSelection);
    console.log('MetricSelector onSelectionChange() this.state: ', this.state);
  }

  updateVisualizationHeaderHeight() {
    let header = React.findDOMNode(this.refs.header);
    let height = $(header).height();

    console.log('MetricSelector updateVisualizationHeaderHeight()',
      header, height);

    this.setState({ visualizationHeaderHeight : height });

    return height;
  }
}