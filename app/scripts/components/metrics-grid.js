import React from 'react';
import _ from 'underscore';

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

    
    let groups = index.groups || { };

    let displayGroups = this.regroupByGroupName(groups);
    let groupOrder = _.sortBy(_.keys(displayGroups));

    return (
      <div className='metrics-grid'>
        <div className='well'>
          { 
            this.renderSelectedVirtualGroup(
              groups, selectedPrimaryMetric, index
            ) 
          }
        </div>
        { 
          groupOrder.map( (groupName) => 
            this.renderGroup(displayGroups[groupName]) 
          ) 
        }
        
      </div>
    );
  }

  regroupByGroupName(groups) {
    let displayGroups = { };

    _.keys(groups).forEach( (groupId) => {
      let group = groups[groupId];
      let groupName = group.groupName;

      let displayGroup = displayGroups[groupName] || { };
      
      if (_.isEmpty(displayGroup)) {
        displayGroups[groupName] = displayGroup;
        displayGroup.groupName = groupName;
        displayGroup.variables = { };
      }

      let displayVariables = displayGroup.variables;
      let displayVariableOrder = displayGroup.variableOrder;

      group.variableOrder.forEach( (variableId) => {
        let variable = group.variables[variableId];
        let displayVariable = _.extend(_.clone(variable), { groupId });
        
        displayVariables[variableId] = displayVariable;
      });
    });

    return displayGroups;
  }

  renderSelectedVirtualGroup(groups, selected, index) {
    if (selected 
        && selected.group
        && selected.metric
        && index
        && index.groups) {
      let display = selected.display || { };
      let selectedGroupId = selected.group;
      let selectedVariableId = selected.metric;

      let selectedGroup = index.groups[selectedGroupId];
      let selectedMetric = selectedGroup.variables[selectedVariableId];

      let selectedGroupName = selectedGroup.groupName;
      let selectedVariableName = selectedMetric.variableName;
      let selectedVariableDescription = selectedMetric.variableDescription;

      let virtualVariables = { };
      virtualVariables[selectedVariableId] = {
        groupId: selectedGroupId,
        variableId: selectedVariableId,
        variableName: selectedVariableName,
        variableDescription: selectedVariableDescription
      };

      let virtualGroup = {
        groupId: selectedGroupId,
        groupName: selectedGroupName,
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

    let groupId = overrideKey || group.groupId;
    let title = overrideTitle || group.groupName;

    return (
      <div key={ groupId } className='panel panel-default'>
        <div className='panel-heading'>
          <h3 className='panel-title'> { title } </h3>
        </div>
        <table className='table table-condensed'>
          <tbody>
          { 
            _.sortBy(_.keys(variables)).map( (variableName) => 
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

    let groupId = variable.groupId;
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
        <td> { variableDescription }</td>
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