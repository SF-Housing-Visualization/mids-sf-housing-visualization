// Adapted from http://nvd3.org/examples/multiBarHorizontal.html

(function(window, d3, nv, data, container) {
  
  var getDispatcher = function getDispatcher() { 
    return window.dispatcher; 
  }.bind(this);

  nv.addGraph(function() {
    var chart = nv.models.multiBarHorizontalChart()
        .x(function(d) { return d.label })
        .y(function(d) { return d.value })
        .margin({top: 30, right: 20, bottom: 50, left: 175})
        .showValues(true)           //Show bar value next to each bar.
        .tooltips(true)             //Show tooltips on hover.
        //.transitionDuration(350)
        .showControls(true);        //Allow user to switch between "Grouped" and "Stacked" mode.

    chart.yAxis
        .tickFormat(d3.format(',.2f'));

    d3.select(container)
        .datum(data)
        .call(chart);

    nv.utils.windowResize(chart.update);

    return chart;
  }, function() {
    d3.selectAll(container + ' .nv-bar').on('click',
      function(data) {
        getDispatcher()(data);
      }
    );
  });

})(window, d3, nv, window.data.sidebar, '.sidebar svg');

/*(function (window, d3, containerSelector) {
  var categories= ['','Accessories', 'Audiophile', 'Camera & Photo', 'Cell Phones', 'Computers','eBook Readers','Gadgets','GPS & Navigation','Home Audio','Office Electronics','Portable Audio','Portable Video','Security & Surveillance','Service','Television & Video','Car & Vehicle'];

  var dollars = [213,209,190,179,156,209,190,179,213,209,190,179,156,209,190,190];

  var colors = ['#0000b4','#0082ca','#0094ff','#0d4bcf','#0066AE','#074285','#00187B','#285964','#405F83','#416545','#4D7069','#6E9985','#7EBC89','#0283AF','#79BCBF','#99C19E'];

  var grid = d3.range(25).map(function(i){
    return {'x1':0,'y1':0,'x2':0,'y2':480};
  });

  var tickVals = grid.map(function(d,i){
    if(i>0){ return i*10; }
    else if(i===0){ return "100";}
  });

  var xscale = d3.scale.linear()
          .domain([10,250])
          .range([0,722]);

  var yscale = d3.scale.linear()
          .domain([0,categories.length])
          .range([0,480]);

  var colorScale = d3.scale.quantize()
          .domain([0,categories.length])
          .range(colors);

  var canvas = d3.select(containerSelector)
          .append('svg')
          .attr({'width':900,'height':550});

  var grids = canvas.append('g')
            .attr('id','grid')
            .attr('transform','translate(150,10)')
            .selectAll('line')
            .data(grid)
            .enter()
            .append('line')
            .attr({'x1':function(d,i){ return i*30; },
               'y1':function(d){ return d.y1; },
               'x2':function(d,i){ return i*30; },
               'y2':function(d){ return d.y2; },
            })
            .style({'stroke':'#adadad','stroke-width':'1px'});

  var xAxis = d3.svg.axis();
    xAxis
      .orient('bottom')
      .scale(xscale)
      .tickValues(tickVals);

  var yAxis = d3.svg.axis();
    yAxis
      .orient('left')
      .scale(yscale)
      .tickSize(2)
      .tickFormat(function(d,i){ return categories[i]; })
      .tickValues(d3.range(17));

  var y_xis = canvas.append('g')
            .attr("transform", "translate(150,0)")
            .attr('id','yaxis')
            .call(yAxis);

  var x_xis = canvas.append('g')
            .attr("transform", "translate(150,480)")
            .attr('id','xaxis')
            .call(xAxis);

  var chart = canvas.append('g')
            .attr("transform", "translate(150,0)")
            .attr('id','bars')
            .selectAll('rect')
            .data(dollars)
            .enter()
            .append('rect')
            .attr('height',19)
            .attr({'x':0,'y':function(d,i){ return yscale(i)+19; }})
            .style('fill',function(d,i){ return colorScale(i); })
            .attr('width',function(d){ return 0; });


  var transit = d3.select("svg").selectAll("rect")
              .data(dollars)
              .transition()
              .duration(1000) 
              .attr("width", function(d) {return xscale(d); });

  var transitext = d3.select('#bars')
            .selectAll('text')
            .data(dollars)
            .enter()
            .append('text')
            .attr({'x':function(d) {return xscale(d)-200; },'y':function(d,i){ return yscale(i)+35; }})
            .text(function(d){ return d+"$"; }).style({'fill':'#fff','font-size':'14px'});


})(window, d3, '#wrapper'); */
