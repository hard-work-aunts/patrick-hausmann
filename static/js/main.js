$(function() {
	//============
	// Background Layers

	var layer_MQ = new L.tileLayer(
		'http://otile{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png',{
			attribution: 'Data, imagery and map information provided by MapQuest, <a href=" http://www.openstreetmap.org/" title="OpenStreetMap">OpenStreetMap</a>  and contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/" title="CC-BY-SA">CC-BY-SA</a>',
			maxZoom: 18, subdomains: '1234'
		}
	),
	layer_OSM = new L.tileLayer(
		'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
			attribution: '&copy <a href=" http://www.openstreetmap.org/" title="OpenStreetMap">OpenStreetMap</a>  and contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/" title="CC-BY-SA">CC-BY-SA</a>',
			maxZoom: 18, subdomains: 'abc'
		}
	),
	layer_MapBox = new L.tileLayer(
		'http://a.tiles.mapbox.com/v3/examples.map-4l7djmvo/{z}/{x}/{y}.png', {
			maxZoom: 18, attribution: 'MapBox Streets',
			subdomains:'abcd'   
		}
	),
	layer_CloudMate = new L.tileLayer(
		'http://{s}.tile.cloudmade.com/ad132e106cd246ec961bbdfbe0228fe8/997/256/{z}/{x}/{y}.png',{
			attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
			maxZoom: 18
		}
	)

	var baseMaps = {
		'OpenStreetMap': layer_OSM,
		'OSM MapQuest': layer_MQ,
		'Mapbox Streets': layer_MapBox,
		'CloudMate': layer_CloudMate
	};

	//==================================================
	// Dunkin Donuts

	var DunkinDonutsDotOption = {
	    radius: 4,
	 //   fillColor: "69C5FF",
	    color: "purple",
	    weight: 1,
	    opacity: 0.7,
	    fillOpacity: 0.0 // 0.5
	};

	var DunkinDonutsLayer = L.geoJson(null, {
		pointToLayer: function (feature, latlng) {
	        return L.circleMarker(latlng, DunkinDonutsDotOption);
	    }});
//	var markers2 = new L.MarkerClusterGroup();

	$.getJSON('data/dunkin_donuts.geojson', function(geojsonFeature) {
	    DunkinDonutsLayer.addData(geojsonFeature);
	});


	//==================================================
	// Starbucks

	var StarbucksDotOption = {
	    radius: 4,
	    color: "red",
	    weight: 1,
	    opacity: 0.7,
	    fillOpacity: 0.0 // 0.5
	};

	var StarbucksLayer = L.geoJson(null, {
		pointToLayer: function (feature, latlng) {
	        return L.circleMarker(latlng, StarbucksDotOption);
	    }});

	$.getJSON('data/starbucks.geojson', function(geojsonFeature) {
	    StarbucksLayer.addData(geojsonFeature);
	});

	//==================================================
	// KFC

	var KFCDotOption = {
	    radius: 4,
	    color: "blue",
	    weight: 1,
	    opacity: 0.7,
	    fillOpacity: 0.0 // 0.5
	};

	var KFCLayer = L.geoJson(null, {
		pointToLayer: function (feature, latlng) {
	        return L.circleMarker(latlng, KFCDotOption);
	    }});

	$.getJSON('data/kfc.geojson', function(geojsonFeature) {
	    KFCLayer.addData(geojsonFeature);
	});

	//==================================================
	// McDonalds

	var McDonaldsDotOption = {
	    radius: 4,
	    color: "green",
	    weight: 1,
	    opacity: 0.7,
	    fillOpacity: 0.0 // 0.5
	};

	var McDonaldsLayer = L.geoJson(null, {
		pointToLayer: function (feature, latlng) {
	        return L.circleMarker(latlng, McDonaldsDotOption);
	    }});

	$.getJSON('data/mcdonalds.geojson', function(geojsonFeature) {
	    McDonaldsLayer.addData(geojsonFeature);
	});

	//==================================================
	// Taco_Bell

	var TacoBellDotOption = {
	    radius: 4,
	    color: "yellow",
	    weight: 1,
	    opacity: 0.7,
	    fillOpacity: 0.0 // 0.5
	};

	var TacoBellLayer = L.geoJson(null, {
		pointToLayer: function (feature, latlng) {
	        return L.circleMarker(latlng, TacoBellDotOption);
	    }});

	$.getJSON('data/taco_bell.geojson', function(geojsonFeature) {
	    TacoBellLayer.addData(geojsonFeature);
	});

	//==================================================
	// Pizza Hut

	var PizzaHutDotOption = {
	    radius: 4,
	    color: "orange",
	    weight: 1,
	    opacity: 0.7,
	    fillOpacity: 0.0 // 0.5
	};

	var PizzaHutLayer = L.geoJson(null, {
		pointToLayer: function (feature, latlng) {
	        return L.circleMarker(latlng, PizzaHutDotOption);
	    }});

	$.getJSON('data/pizza_hut.geojson', function(geojsonFeature) {
	    PizzaHutLayer.addData(geojsonFeature);
	});

//=============================================================================

	//=============
	// Data Layers

	var overlayMaps = {
		'Starbucks (red)': StarbucksLayer,
		'KFC (blue)': KFCLayer,
		'McDonalds (green)': McDonaldsLayer,
		'Taco Bell (yellow)': TacoBellLayer,
		'Pizza Hut (orange)': PizzaHutLayer,
		'Dunkin Donuts (purple)': DunkinDonutsLayer
	//	'Image Layer': imageLayer
	};

	var controls = L.control.layers(baseMaps, overlayMaps, {collapsed: false});
	var map = new L.Map('map', {
		center: new L.LatLng(-94.588611, 39.109722),
		zoom: 13,
		layers: [layer_OSM]
	})

	var bounding = L.polygon([[50.3, -70.1],[25.3, -122.3]]);
	map.fitBounds(bounding.getBounds());

	controls.addTo(map)

	//================
	// Locate the user

	//map.locate({setView: true, maxZoom: 16});

	function onLocationFound(e) {
		var radius = e.accuracy / 2;

		L.marker(e.latlng).addTo(map)
			.bindPopup("You are within " + radius + " meters from this point").openPopup();

		L.circle(e.latlng, radius).addTo(map);
	}

	map.on('locationfound', onLocationFound);

	function onLocationError(e) {
		alert(e.message);
	}

	map.on('locationerror', onLocationError);

});