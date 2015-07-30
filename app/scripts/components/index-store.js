import Reflux from 'reflux';
import d3 from 'd3';
import IndexLoadAction from './index-load-action';

export default Reflux.createStore({

  init: function() { 
    this.state = { };
    this.onIndexLoad = this.onIndexLoad.bind(this);
    this.onIndexLoaded = this.onIndexLoaded.bind(this);

    this.listenTo(IndexLoadAction, this.onIndexLoad);
    this.listenTo(IndexLoadAction.completed, this.onIndexLoaded);
  },

  onIndexLoad: function onIndexLoad() {
    const url = '/mids-sf-housing-sandbox/data/prod/data_variables.csv';
    console.log('loading index with url ', url);
    d3.promise.csv(url)
      .then(IndexLoadAction.completed)
      .catch(IndexLoadAction.failed);
  },

  onIndexLoaded: function onIndexLoaded(index) {
    let shapedIndex = this.shape(index);
    this.state = shapedIndex;
    this.trigger(shapedIndex);
  },

  shape: function shape(index) {
    let groups = { };
    let groupOrder = [ ];

    index.forEach( (variable) => {
      let groupId = variable.GroupID;
      let groupName = variable.GroupName;
      
      let group = groups[groupId] || { 
        groupId, // ES6 implicit :groupId
        groupName, // ES6 implicit :groupMame
        variables : { },
        variableOrder: [ ]
      };
      
      if (!(groupId in groups)) {
        groups[groupId] = group;
        groupOrder.push(groupId);
      }

      let variableId = variable.VariableID;
      let variableName = variable.VariableName;
      let variableDescription = variable.variableDescription;

      let variableObject = {
        variableId, // ES6 implicit :variableId
        variableName, // ES6 implicit :variableName
        variableDescription // ES6 implicit :variableDescription
      };

      group.variables[variableId] = variableObject;
      group.variableOrder.push(variableId);
    });

    return { 
      groups, // ES6 implicit :groups
      groupOrder //ES6 implicit :groupOrder
    };
  }

});