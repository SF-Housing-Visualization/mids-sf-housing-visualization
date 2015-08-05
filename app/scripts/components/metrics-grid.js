import React from 'react';

import IndexStore from './index-store';
import SelectionStore from './selection-store';

import MetricSelectorActions from './metric-selector-actions';

import MetricLoadAction from './metric-load-action';

import SelectionActions from './selection-actions';

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 

    };

    this.onMetricSelected = this.onMetricSelected.bind(this);
    this.onIndexLoaded = this.onIndexLoaded.bind(this);

    this.onSelectionChange = this.onSelectionChange.bind(this);
  }

  render() {
    let selectedPrimaryMetric = this.state.selectedPrimaryMetric || { };
    let selectedGroup = selectedPrimaryMetric.group;
    let selectedMetric = selectedPrimaryMetric.metric;

    let index = this.state.index || { };

    let groupOrder = index.groupOrder || [ ];
    let groups = index.groups || { };


    return (
      <div className='metrics-grid'>
        <div className='well'>
          { 
            this.renderSelectedVirtualGroup(groups, selectedPrimaryMetric) 
          }
        </div>
        { 
          groupOrder.map( (groupName) => 
            this.renderGroup(groups[groupName]) 
          ) 
        }
        
      </div>
    );
  }

  renderSelectedVirtualGroup(groups, selected) {
    if (selected) {
      let display = selected.display || { };
      let selectedGroupId = selected.group;
      let selectedGroupName = selected.group;
      let selectedVariableId = selected.metric;
      let selectedVariableName = display.metric;

      let virtualVariables = { };
      virtualVariables[selectedVariableId] = {
        variableId: selectedVariableId,
        variableName: selectedVariableName
      };

      let virtualGroup = {
        groupId: selectedGroupId,
        groupName: selectedGroupName,
        variableOrder: [ selectedVariableId ],
        variables: virtualVariables
      };

      const key = 'selected';
      const title = 'Currently selected metric';
      return this.renderGroup(virtualGroup, key, title, selectedGroupName);

    } else {
      return (<div></div>);
    }  
  }

  renderGroup(group, overrideKey, overrideTitle, overrideGroupName) {
    let variableOrder = group.variableOrder || [ ];
    let variables = group.variables || { };

    let key = overrideKey || group.groupId;
    let title = overrideTitle || group.groupName;

    return (
      <div key={ key } className='panel panel-default'>
        <div className='panel-heading'>
          <h3 className='panel-title'> { title } </h3>
        </div>
        <table className='table table-condensed'>
          <tbody>
          { 
            variableOrder.map( (variableName) => 
              this.renderVariable(
                group, 
                variables[variableName], 
                overrideGroupName
              ) 
            ) 
          }
          </tbody>
        </table>
      </div>
    );
  }

  renderVariable(group, variable, overrideGroupName) {
    let groupName = overrideGroupName || group.groupName;
    let groupId = group.groupId;

    let variableName = variable.variableName;
    let variableId = variable.variableId;
    let variableDescription = variable.variableDescription;

    let displayName = groupName + ' > ' + variableName;

    let onClick = (event) => this.onMetricSelected(groupId, variableId, event);

    let button = (
      <button className='btn btn-default' 
        onClick={ onClick }
        aria-label={ displayName }>
        <span className='glyphicon glyphicon-check' 
          aria-hidden='true'></span> { displayName }
      </button>
    );


    return (
      <tr key={ variable.variableId }>
        <td>{ button }</td>
        <td width='*'> { variableDescription }</td>
      </tr>
    );
  }

  componentDidMount() {
    this.unsubscribeFromIndexStore =
      IndexStore.listen(this.onIndexLoaded);
    this.unsubscribeFromSelectionStore =
      SelectionStore.listen(this.onSelectionChange);
  }

  componentWillUnmount() {
    this.unsubscribeFromSelectionStore();
    this.unsubscribeFromIndexStore();
  }

  onMetricSelected(groupId, variableId, event) {
    console.log('MetricsGrid onMetricSelected()', groupId, variableId, event);
    // TODO: probably too much direct knowledge of its parent, and
    // a better approach would be to have parent pass in a callback
    // investigate when time
    MetricSelectorActions.collapse();

    let index = this.state.index;

    let group = index.groups[groupId];
    let groupName = group.LogicalCategory;

    let variable = group.variables[variableId];
    let metricName = variable.variableName;

    let metric = {
      group: groupId,
      metric: variableId,
      display: {
        group: groupName,
        metric: metricName
      }
    };

    MetricLoadAction(metric);
    SelectionActions.primaryMetricSelectionChange(metric);
  }

  onIndexLoaded(index) {
    console.log('MetricsGrid onIndexLoaded()', index);
    this.setState({ index });
  }

  onSelectionChange(newSelection) {
    this.setState(newSelection);
    console.log('MetricsGrid onSelectionChange() this.state: ', this.state);
  }
}