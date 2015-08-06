import React from 'react';

import SelectionStore from './selection-store';

import DimensionActions from './dimension-actions';

import MetricSelectorStore from './metric-selector-store';
import MetricSelectorActions from './metric-selector-actions';

import MetricsGrid from './metrics-grid';

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = { expanded: false };

    this.onSelectionChange = this.onSelectionChange.bind(this);
    this.onSelectMetric = this.onSelectMetric.bind(this);
    this.onMetricSelected = this.onMetricSelected.bind(this);
    this.onMetricSelectorStore = this.onMetricSelectorStore.bind(this);

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
    this.unsubscribeFromMetricSelectorStore =
      MetricSelectorStore.listen(this.onMetricSelectorStore);

    let visualizationHeaderHeight = this.updateVisualizationHeaderHeight();

    DimensionActions.resizeVisualizationHeader({
      visualizationHeaderHeight
    });

    this.updateSelectorMaxHeight();
  }

  componentWillUnmount() {
    this.unsubscribeFromMetricSelectorStore();
    this.unsubscribeFromSelectionStore();
  }

  render() {
    let selectedPrimaryMetric = this.state.selectedPrimaryMetric;
    let index = this.state.index;

    let metric = this.renderMetric(selectedPrimaryMetric, index);
    
    let primaryMetricDisplayName =
      selectedPrimaryMetric
      ? selectedPrimaryMetric.group + ' > ' + selectedPrimaryMetric.metric
      : 'Loading ...';

    

    let selectorMaxHeight = this.state.selectorMaxHeight;
    console.log('MetricSelector render()',
      'selectorMaxHeight', selectorMaxHeight, 
      'state.expanded', this.state.expanded);

    let selectorContainerStyle =
      (selectorMaxHeight && this.state.expanded)
      ? { 
        maxHeight : selectorMaxHeight,
        transitionDuration : '0.2s',
        transitionProperty : 'max-height',
        transitionTimingFunction : 'ease-in-out'
      } : { 
        maxHeight : 0, 
        overflowY : 'hidden',
        transitionDuration : '0.2s',
        transitionProperty : 'max-height',
        transitionTimingFunction : 'ease-in-out'
      };

    return (
      <div>
        <div ref='header'>
          <header ref='visualization' className='group'>
            { metric }
          </header>
        </div>
        <div 
          className='metric-selector-container' 
          style={ selectorContainerStyle }
          ref='selectorContainer'>
          <div 
            className='metric-selector'
            ref='selector'>
            <MetricsGrid />
          </div>
        </div>
      </div>
    );
  }

  renderMetric(selected, index) {

    let display = { 
      group: 'Data', 
      metric: 'Loading ...',
      description: 'Thank you for your patience while the data is loading.'
    };

    if (selected && index) {
      let groupId = selected.group;
      let metricId = selected.metric;
      
      let group = index.groups[groupId];
      let variable = group.variables[metricId];

      display.group = group.groupName;
      display.metric = variable.variableName;
      display.description = variable.variableDescription;
    }

    let metric = (
      <div className='metric-headline'>
        <button className='btn btn-default btn-lg' 
          onClick={ this.onSelectMetric }
          aria-label={ display.metric }>
          <span className='glyphicon glyphicon-check' 
            aria-hidden='true'></span> 

          <span className='metric-group'> { display.group } </span>

          <span className='glyphicon glyphicon-menu-right' 
            aria-hidden='true'></span> 
          <span className='metric-metric'> { display.metric } </span>
        </button>

        <span>&nbsp;</span>

        <button 
          className='btn btn-default btn-lg disabled metric-description'
          ref='description'
          dataToggle='tooltip' dataPlacement='bottom'> 
          { display.description } 
        </button>
      </div>
    );

    return metric;
  }

  onDimensionStore(event) {
    console.log('MetricSelector onDimensionStore()', event);
  }

  onSelectMetric(event) {
    console.log('MetricSelector onSelectMetric()', event);

    this.updateSelectorMaxHeight();
    MetricSelectorActions.expand();
  }

  onMetricSelected(event) {
    console.log('MetricSelector onMetricSelected()', event);
    MetricSelectorActions.collapse();
  }

  onMetricSelectorStore(newState) {
    console.log('MetricSelector onMetricSelectorStore()', newState);
    this.setState(newState);
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

  updateSelectorMaxHeight() {
    let selector =
      React.findDOMNode(this.refs.selector);
    let height = $(selector).outerHeight();
    console.log('MetricSelector updateSelectorMaxHeight()',
      selector, height);
    this.setState({ selectorMaxHeight : height });
  }

}