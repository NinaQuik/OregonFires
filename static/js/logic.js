// Add console.log to check to see if the code is working.
console.log("working");

// Fetch geojson and csv resources
var oregonCounties = "https://data.oregon.gov/resource/fegw-hszq.geojson";
//var oregonFires = "Resources/largeFires.geojson";
var oregonFires = "https://nqfinalprojectoregonfires.s3.us-west-2.amazonaws.com/largeFires.json";
var fireCauses = "https://nqfinalprojectoregonfires.s3.us-west-2.amazonaws.com/fire_causes.csv";

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selectOption");
  // Populate the years to choose from
  for (let i= 1992; i < 2016; i++ ){
    selector
      .append("option")
      .text(i)
      .property(i)
    var selectedyear = i;  
  };
  var causeselector = d3.select("#selectCause");
    // Use the fire causes descriptions to populate the select options
    d3.csv(fireCauses).then((data) => {
      //console.log(data);
      for (var i =0; i < data.length; i++){
        causeselector
          .append("option")
          .text(data[i].stat_cause_descr)
          .property(data[i].stat_cause_code)
      }

      });
  
  
  mapFires();
};

// Initialize the selector
init();

function optionChanged(newYear, cause) {
  // Plot fires each time a new year  or cause is selected, clear existing markers
  fires.clearLayers();
  mapFires(newYear, cause);

}

// Create the map object with a center and zoom level.
let map = L.map("mapid", {
    center: [
      42, -120.5
    ],
    zoom: 7,
    zoomControl: false
  });

  // The tile layers that will be the background of the map.
let sat = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/satellite-v9',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
});

let street = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
});

// Create baseMaps to add to map and layer control

let baseMaps = {
  "Satellite": sat,
  "Street": street
};

sat.addTo(map);

// Create a style for the lines.
let myStyle = {
  color: "blue",
  fillColor: "yellow",
  fillOpacity: 0.1,
  weight: 1
};

//Make fire and county layers
let fires = new L.layerGroup();
let counties = new L.layerGroup();

//Define the overlay
let overlays = {
  Counties: counties,
  Fires: fires
};


var layerControl = L.control.layers(baseMaps, overlays).addTo(map);


// Grabbing the County GeoJSON data.
d3.json(oregonCounties).then(function(data) {
  //console.log(data);
  // Creating a GeoJSON layer with the retrieved data.
  L.geoJSON(data, {style: myStyle}).addTo(counties);
  counties.addTo(map);
});

// Function to map fires by year and cause
function mapFires(selectedyear, selectedcause){

   //Create a function to filter by year + cause
   function fireYearFilter(feature){
    console.log(selectedyear + " " + selectedcause);
    let fireYear = feature.properties.fire_year;
    let fireCause = feature.properties.stat_cause_descr;
    if(selectedyear == undefined & selectedcause == undefined){
      return true 
    }
    if (selectedyear =="allyears" & selectedcause =="allcauses"){
      return true
    }
    if (selectedyear =="allyears" & fireCause == selectedcause){
      return true
    }
    if (fireYear == selectedyear & selectedcause =="allcauses"){
      return true
    }
    if (fireYear == selectedyear & fireCause == selectedcause){
      return true
    }
    else {
      return false
    }  
  }
  // Retrieve the fires GeoJSON data
  d3.json(oregonFires).then(function(data) {
  //console.log(data);
    // This function returns the style data for each of the fires we plot on
    // the map.
      function styleInfo(feature) {
        return {
          opacity: 1,
          fillOpacity: 1,
          fillColor: getColor(feature.properties.fire_size_class),
          color: "#000000",
          radius: getRadius(feature.properties.fire_size_class),
          stroke: true,
          weight: 0.5
        };
      } 
  
      // This function determines the color of the circle based on the size of the fire.
    function getColor(fire_size_class) {
      if (fire_size_class == "G") {
        return "#9b2226";
      }
      if (fire_size_class == "F") {
        return "#bb3e03";
      }
      if (fire_size_class == "E") {
        return "#ca6702";
      }
      if (fire_size_class == "D") {
        return "#ee9b00";
      }
      if (fire_size_class == "C") {
        return "#d4ee00";
      }
      return "#94d2bd";
    }
      // This function determines the radius of the fire marker based on its fire class
      function getRadius(fire_size_class) {
        if (fire_size_class == "G") {
          return 30;
        }
        if (fire_size_class == "F") {
          return 20;
        }
        if (fire_size_class == "E") {
          return 15;
        }
        if (fire_size_class == "D") {
          return 10;
        }
        if (fire_size_class == "C") {
          return 6;
        }
        return 1;
      }
      // Creating a GeoJSON layer with the retrieved data.
      L.geoJSON(data, {
        // turn each feature into a circleMarker on the map
          pointToLayer: function(feature, latlng){
            //console.log(data);
            return L.circleMarker(latlng);
          },  
          style: styleInfo,
          // create a popup for each circleMarker to display information about the fire after the marker has been created and styled.
            onEachFeature: function(feature, layer) {
              layer.bindPopup(feature.properties.fire_name + "<br>Cause: " + feature.properties.stat_cause_descr + "<br>Year: " + feature.properties.fire_year + 
                              "<br>Duration: " + feature.properties.duration + " days" + "<br>Size: " + feature.properties.fire_size + " acres" +
                              "<br>County: " + feature.properties.county_name);
            },
          //call filter by year and cause function before adding markers
          filter:fireYearFilter,  
          }).addTo(fires);
          //Add fire layer to the map
    fires.addTo(map);
  });  
}


