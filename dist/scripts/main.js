!function(a){a.data=a.data||{},a.data.sidebar=[{key:"Series 1",color:"#d67777",values:[{label:"Germany",value:-1.8746444827653},{label:"France",value:-8.0961543492239},{label:"Spain",value:-.57072943117674},{label:"Russia",value:-2.4174010336624},{label:"Italy",value:-.72009071426284},{label:"Ukraine",value:-.77154485523777},{label:"Sweden",value:-.90152097798131},{label:"Norway",value:-.91445417330854},{label:"Estonia",value:-.055746319141851}]},{key:"Series 2",color:"#4f99b4",values:[{label:"Germany",value:25.307646510375},{label:"France",value:16.756779544553},{label:"Spain",value:18.451534877007},{label:"Russia",value:8.6142352811805},{label:"Italy",value:7.8082472075876},{label:"Ukraine",value:5.259101026956},{label:"Sweden",value:.30947953487127},{label:"Norway",value:0},{label:"Estonia",value:0}]}]}(window),function(a,e,n,t,l){var r=function(){return a.dispatcher}.bind(this);n.addGraph(function(){var a=n.models.multiBarHorizontalChart().x(function(a){return a.label}).y(function(a){return a.value}).margin({top:30,right:20,bottom:50,left:175}).showValues(!0).tooltips(!0).showControls(!0);return a.yAxis.tickFormat(e.format(",.2f")),e.select(l).datum(t).call(a),n.utils.windowResize(a.update),a},function(){e.selectAll(l+" .nv-bar").on("click",function(a){r().dispatch(a)})})}(window,d3,nv,window.data.sidebar,".sidebar svg"),function(a,e){var n=a.state=a.state||{};n.selected=n.selected={},n.selected.area=e}(window),function(a,e){var n=function(){return a.state}.bind(this),t=a.dispatcher=a.dispatcher||{},l=t.handlers=t.handlers||[];t.dispatch=function(a){var e=n();console.log("dispatching event",a,e);for(handler in l){var t=l[handler];console.log("calling handler",t,a,e),t(a,e)}return!0}.bind(this),t.register=function(a){l.push(a)}.bind(this)}(window),function(a,e){var n=a.data=a.data||{},t=n.map=n.map||{};t.Germany=[52.5,13.4],t.France=[48.9,2.4],t.Spain=[40.4,-3.7],t.Russia=[55.7,37.6],t.Italy=[41.9,12.5],t.Ukraine=[50.5,30.5],t.Sweden=[59.3,18],t.Norway=[60,10.8],t.Estonia=[59.4,24.7]}(window),function(a,e,n,t){"use strict";function l(a){return"undefined"==typeof a}var r=function(){return a.dispatcher}.bind(this),i=function(){return a.data}.bind(this);n.Icon.Default.imagePath="images/";var o=n.map("map",{center:[52.5377,13.3958],zoom:4});new n.tileLayer("http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png",{minZoom:0,maxZoom:18,attribution:'Map data © <a href="http://www.openstreetmap.org">OpenStreetMap contributors</a>'}).addTo(o);var u={},s=function(a,e){console.log("map handler",a,e),l(u.marker)||o.removeLayer(u.marker);var t=i(),r=t.map[a.label],s=u.marker=n.marker(r);o.addLayer(s)}.bind(this);r().register(s)}(window,document,L);