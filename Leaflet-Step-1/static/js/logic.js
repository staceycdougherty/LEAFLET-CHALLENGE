// Creating map object
var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5
  });
  
  // Adding tile layer to the map
  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
  }).addTo(myMap);

//query url
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

//grab data with d3
d3.json(queryUrl).then(function(response) {

    console.log(response)

    //get features data
    var response = response.features;

	for (var i = 0; i < response.length; i++) {
		
		//set variables for future use
        var place = response[i].properties.place;
        var date = new Date(response[i].properties.time);
		var magnitude = response[i].properties.mag;
		var coordinates = response[i].geometry.coordinates;
        var depth = response[i].geometry.coordinates[2];
            console.log(place)
            console.log(depth)
            console.log(magnitude)
            console.log(coordinates)

        //create color gradient for depths
            var color = "";
            if (depth >-10 && depth <=10) {
              color =  "lime";
            }
            else if (depth >10 && depth <=30) {
              color = "palegreen";
            }
            else if (depth >30 && depth <=50) {
              color = "gold";
            }
            else if (depth >50 && depth <=70) {
              color = "orange";
            }
            else if (depth >70 && depth <=90) {
              return "darkorange";
            }
            else {
              return "red";
            }


            L.circleMarker([coordinates[1], coordinates[0]], {
                fillOpacity: 0.75,
                color: "black",
                weight: 0.5,
                fillColor: color,
                radius: magnitude * 10
            }).bindPopup("<h3>" + place + "</h3><hr><p>" + date + 
            '<br>' + "Coordinates: " + '[' + coordinates[1] + ', ' + coordinates[0] + ']' +
            '<br>' + "Magnitude: " + magnitude + "</p>").addTo(myMap);            
          };
    });

//add legend
var legend = L.control({ position: "bottomright" });

legend.onAdd = function() {
  var div = L.DomUtil.create("div", "legend");
  div.innerHTML += "<h4>Depth in km</h4>";
  div.innerHTML += '<li style="background: lime">-10-10</li><br>';
  div.innerHTML += '<li style="background: palegreen">10-30</li><br>';
  div.innerHTML += '<li style="background: gold">30-50</li><br>';
  div.innerHTML += '<li style="background: orange">50-70</li><br>';
  div.innerHTML += '<li style="background: darkorange">70-90</li><br>';
  div.innerHTML += '<li style="background: red">90+</li><br>';

  return div;
};

legend.addTo(myMap);