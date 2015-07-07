/*jslint browser: true*/
/*global L */

(function (window, document, L, undefined) {
	'use strict';

  function isUndefined(ref) { return typeof ref === 'undefined'; }

  var getDispatcher = function getDispatcher() { 
    return window.dispatcher; 
  }.bind(this);

  var getData = function getData() {
  	return window.data;
  }.bind(this);

	L.Icon.Default.imagePath = 'images/';

	/* create leaflet map */
	var map = L.map('map', {
		center: [52.5377, 13.3958],
		zoom: 4
	});

	/* add default stamen tile layer */
	new L.tileLayer('http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png', {
		minZoom: 0,
		maxZoom: 18,
		attribution: 'Map data © <a href="http://www.openstreetmap.org">OpenStreetMap contributors</a>'
	}).addTo(map);

	var view = { };

	var handler = function mapHandler(selection, state) {
		console.log('map handler', selection, state);

		if (! isUndefined(view.marker)) {
			map.removeLayer(view.marker);
		}

		var data = getData();

		var coordinates = data.map[selection.label];

		var marker = view.marker = L.marker(coordinates);

		map.addLayer(marker);

	}.bind(this);

	getDispatcher().register(handler);

}(window, document, L));