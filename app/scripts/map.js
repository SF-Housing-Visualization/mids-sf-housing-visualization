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

	var areas = window.areas = view.areas = view.areas || { };

	function styleGeoJsonBaseline(feature) {
		return {
			fillColor: "#E3E3E3",
			weight: 1,
			opacity: 0.4,
			color: 'gray',
			fillOpacity: 0.3
		};
	}

	function styleGeoJsonHover(feature) {
		return {
			weight: 2,
			color: '#666',
			dashArray: '',
			fillOpacity: 0.7
		};
	}

	function styleGeoJsonSelected(feature) {
		return {
			weight: 4,
			color: '#333',
			dashArray: '',
			fillOpacity: 0.9
		};
	}

	function onAreaMouseEnter(event) {
		console.log('entering area', event);
		var layer = event.target;
		layer.setStyle(styleGeoJsonHover());
		//layer.bringToFront();
	}

	function onAreaMouseExit(event) {
		console.log('exiting area', event);
		var layer = event.target;
		layer.setStyle(styleGeoJsonBaseline());
	}

	function onAreaClick(event) {
		console.log('click in area', event);
		var layer = event.target;
		var name = layer.feature.properties['NAME'];

		var selection = { label : name };

		getDispatcher().dispatch(selection, window.state);
	}

	function onEachGeoJsonFeature(feature, layer) {
		layer.on({
			click : onAreaClick,
			mouseover : onAreaMouseEnter,
			mouseout : onAreaMouseExit
		});

		var name = layer.feature.properties['NAME'];
		areas[name] = layer;
	}

	// Following technique from: 
  //   http://oramind.com/country-border-highlighting-with-leaflet-js/
	window.setGeoJson = function setGeoJson(geoJson) {
		view.countries = getData().countries = L.geoJson(geoJson, {
			style : styleGeoJsonBaseline,
			onEachFeature : onEachGeoJsonFeature
		}).addTo(map);

	}.bind(this);

	var handler = function mapHandler(selection, state) {
		console.log('map handler', selection, state);

		if (! isUndefined(view.marker)) {
			map.removeLayer(view.marker);
		}

		if (! isUndefined(view.highlight)) {
			view.highlight.setStyle(styleGeoJsonBaseline());
		}

		// var data = getData();
		// var coordinates = data.map[selection.label];
		// var marker = view.marker = L.marker(coordinates);
		// map.addLayer(marker);

		var name = selection.label;

		var area = areas[name];

		area.setStyle(styleGeoJsonSelected());

		view.highlight = area;

	}.bind(this);

	getDispatcher().register(handler);

}(window, document, L));