!function(t,e,n,i,r){var a=function(){return t.dispatcher}.bind(this);n.addGraph(function(){var t=n.models.multiBarHorizontalChart().x(function(t){return t.label}).y(function(t){return t.value}).margin({top:30,right:20,bottom:50,left:175}).showValues(!0).tooltips(!0).showControls(!0);return t.yAxis.tickFormat(e.format(",.2f")),e.select(r).datum(i).call(t),n.utils.windowResize(t.update),t},function(){e.selectAll(r+" .nv-bar").on("click",function(t){a().dispatch(t)})})}(window,d3,nv,window.data.sidebar,".sidebar svg"),function(t,e,n,i,r){n.addGraph(function(){var t=n.models.lineWithFocusChart();return t.xAxis.tickFormat(e.format(",f")),t.yAxis.tickFormat(e.format(",.2f")),t.y2Axis.tickFormat(e.format(",.2f")),e.select(r).datum(i).transition().duration(500).call(t),n.utils.windowResize(t.update),t})}(window,d3,nv,window.data.timeSeries,".time-series svg"),function(t,e){var n=t.state=t.state||{};n.selected=n.selected={},n.selected.area=e}(window),function(t,e){var n=function(){return t.state}.bind(this),i=t.dispatcher=t.dispatcher||{},r=i.handlers=i.handlers||[];i.dispatch=function(t){var e=n();console.log("dispatching event",t,e);for(handler in r){var i=r[handler];console.log("calling handler",i,t,e),i(t,e)}return!0}.bind(this),i.register=function(t){r.push(t)}.bind(this)}(window),function(t,e,n,i){"use strict";function r(t){return"undefined"==typeof t}function a(t){return{fillColor:"#E3E3E3",weight:1,opacity:.4,color:"gray",fillOpacity:.3}}function o(t){return{weight:2,color:"#666",dashArray:"",fillOpacity:.7}}function s(t){return{weight:4,color:"#333",dashArray:"",fillOpacity:.9}}function c(t){console.log("entering area",t);var e=t.target;e.setStyle(o())}function l(t){console.log("exiting area",t);var e=t.target;e.setStyle(a())}function u(e){console.log("click in area",e);var n=e.target,i=n.feature.properties.NAME,r={label:i};h().dispatch(r,t.state)}function d(t,e){e.on({click:u,mouseover:c,mouseout:l});var n=e.feature.properties.NAME;g[n]=e}var h=function(){return t.dispatcher}.bind(this),f=function(){return t.data}.bind(this);n.Icon.Default.imagePath="images/";var m=n.map("map",{center:[52.5377,13.3958],zoom:4});new n.tileLayer("http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png",{minZoom:0,maxZoom:18,attribution:'Map data © <a href="http://www.openstreetmap.org">OpenStreetMap contributors</a>'}).addTo(m);var p={},g=t.areas=p.areas=p.areas||{};t.setGeoJson=function(t){p.countries=f().countries=n.geoJson(t,{style:a,onEachFeature:d}).addTo(m)}.bind(this);var w=function(t,e){console.log("map handler",t,e),r(p.marker)||m.removeLayer(p.marker),r(p.highlight)||p.highlight.setStyle(a());var n=t.label,i=g[n];i.setStyle(s()),p.highlight=i}.bind(this);h().register(w)}(window,document,L);