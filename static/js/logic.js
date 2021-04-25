// Define map layers
var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/satellite-v9",
    accessToken: API_KEY
});

var grayscale = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
});

var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "outdoors-v11",
    accessToken: API_KEY
});

// Creating map object
var myMap = L.map("map", {
    center: [
        37.09, -95.71
    ],
    zoom: 3,
    layers: satellite
});

// Perform a GET request to the query URL
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function(data) {

    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place + "</h3> <hr> <p>" + new Date(feature.properties.time) + "</p> <hr> <p> Magnitude: " + feature.properties.mag + "</p>")
    };

    function getStyle(feature) {
        return {
            opacity: 0.7,
            fillOpacity: 0.5,
            color: "black",
            fillColor: getColor(feature.properties.mag),
            radius: getRadius(feature.properties.mag),
            weight: 1
        };
    }

    function getColor(mag) {
        switch (true) {
            case mag > 5:
              return "#ea2c2c";
            case mag > 4:
              return "#eaa92c";
            case mag > 3:
              return "#d5ea2c";
            case mag > 2:
              return "#92ea2c";
            case mag > 1:
              return "#2ceabf";
            default:
              return "#2c99ea";
        }
    };
    
    function getRadius(mag) {
        return mag * 5;
    };

    var earthquakes = L.geoJson(data, {
        
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng);
        },

        style: getStyle,

        onEachFeature: function(feature, layer) {
            layer.bindPopup("<h3>" + feature.properties.place + "</h3> <hr> <p>" + new Date(feature.properties.time) + "</p> <hr> <p> Magnitude: " + feature.properties.mag + "</p>");
        }

    });
    
    // Add earthquakes to map
    earthquakes.addTo(myMap)

    // Define a baseMaps object to hold our base layers
    var baseMaps = {
        "Satellite": satellite,
        "Grayscale": grayscale,
        "Outdoors": outdoors
    };

    // Create overlay object to hold our overlay layer
    var overlayMaps = {
        Earthquakes: earthquakes
    };

    // Create a layer control
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap)
    
});