import React, { useEffect, useState } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";
const DUMMY = {
    "countries": [
      { "id": "US", "name": "USA Suppliers", "latitude": 37.0902, "longitude": -95.7129, "suppliers": 120 },
      { "id": "IN", "name": "India Suppliers", "latitude": 20.5937, "longitude": 78.9629, "suppliers": 95 },
      { "id": "CN", "name": "China Suppliers", "latitude": 35.8617, "longitude": 104.1954, "suppliers": 80 },
      { "id": "UK", "name": "UK Suppliers", "latitude": 55.3781, "longitude": -3.4360, "suppliers": 60 },
      { "id": "DE", "name": "Germany Suppliers", "latitude": 51.1657, "longitude": 10.4515, "suppliers": 70 },
      { "id": "BR", "name": "Brazil Suppliers", "latitude": -14.2350, "longitude": -51.9253, "suppliers": 50 },
      { "id": "AU", "name": "Australia Suppliers", "latitude": -25.2744, "longitude": 133.7751, "suppliers": 40 }
    ],
    "states": {
      "US": [
        { "id": "CA", "name": "California", "latitude": 36.7783, "longitude": -119.4179, "suppliers": 50 },
        { "id": "TX", "name": "Texas", "latitude": 31.9686, "longitude": -99.9018, "suppliers": 70 },
        { "id": "NY", "name": "New York", "latitude": 40.7128, "longitude": -74.0060, "suppliers": 45 }
      ],
      "IN": [
        { "id": "MH", "name": "Maharashtra", "latitude": 19.7515, "longitude": 75.7139, "suppliers": 60 },
        { "id": "KA", "name": "Karnataka", "latitude": 15.3173, "longitude": 75.7139, "suppliers": 35 },
        { "id": "TN", "name": "Tamil Nadu", "latitude": 11.1271, "longitude": 78.6569, "suppliers": 40 }
      ],
      "CN": [
        { "id": "BJ", "name": "Beijing", "latitude": 39.9042, "longitude": 116.4074, "suppliers": 50 },
        { "id": "SH", "name": "Shanghai", "latitude": 31.2304, "longitude": 121.4737, "suppliers": 60 }
      ],
      "UK": [
        { "id": "ENG", "name": "England", "latitude": 52.3555, "longitude": -1.1743, "suppliers": 35 },
        { "id": "SCT", "name": "Scotland", "latitude": 56.4907, "longitude": -4.2026, "suppliers": 25 }
      ],
      "DE": [
        { "id": "BE", "name": "Berlin", "latitude": 52.5200, "longitude": 13.4050, "suppliers": 40 },
        { "id": "BW", "name": "Baden-Württemberg", "latitude": 48.6616, "longitude": 9.3501, "suppliers": 30 }
      ],
      "BR": [
        { "id": "SP", "name": "São Paulo", "latitude": -23.5505, "longitude": -46.6333, "suppliers": 30 },
        { "id": "RJ", "name": "Rio de Janeiro", "latitude": -22.9068, "longitude": -43.1729, "suppliers": 20 }
      ],
      "AU": [
        { "id": "NSW", "name": "New South Wales", "latitude": -31.2532, "longitude": 146.9211, "suppliers": 25 },
        { "id": "VIC", "name": "Victoria", "latitude": -37.8136, "longitude": 144.9631, "suppliers": 15 }
      ]
    },
    "cities": {
      "CA": [
        { "name": "Los Angeles", "latitude": 34.0522, "longitude": -118.2437, "suppliers": 25 },
        { "name": "San Francisco", "latitude": 37.7749, "longitude": -122.4194, "suppliers": 25 }
      ],
      "MH": [
        { "name": "Mumbai", "latitude": 19.0760, "longitude": 72.8777, "suppliers": 30 },
        { "name": "Pune", "latitude": 18.5204, "longitude": 73.8567, "suppliers": 30 }
      ],
      "BJ": [
        { "name": "Haidian", "latitude": 39.9566, "longitude": 116.3166, "suppliers": 25 },
        { "name": "Chaoyang", "latitude": 39.9215, "longitude": 116.4431, "suppliers": 25 }
      ],
      "ENG": [
        { "name": "London", "latitude": 51.5074, "longitude": -0.1278, "suppliers": 30 },
        { "name": "Manchester", "latitude": 53.4808, "longitude": -2.2426, "suppliers": 20 }
      ],
      "BE": [
        { "name": "Berlin Mitte", "latitude": 52.5235, "longitude": 13.4115, "suppliers": 20 },
        { "name": "Charlottenburg", "latitude": 52.5051, "longitude": 13.3030, "suppliers": 20 }
      ],
      "SP": [
        { "name": "São Paulo City", "latitude": -23.5505, "longitude": -46.6333, "suppliers": 15 },
        { "name": "Campinas", "latitude": -22.9099, "longitude": -47.0626, "suppliers": 15 }
      ],
      "NSW": [
        { "name": "Sydney", "latitude": -33.8688, "longitude": 151.2093, "suppliers": 15 },
        { "name": "Newcastle", "latitude": -32.9267, "longitude": 151.7789, "suppliers": 10 }
      ]
    }
  };
  
const GeoMap = () => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [map, setMap] = useState(null);
  const [data, setData] = useState(DUMMY);


  useEffect(() => {
    let chart = am4core.create("map-element", am4maps.MapChart);
    chart.geodata = am4geodata_worldLow;
    chart.projection = new am4maps.projections.Miller();
    setMap(chart);

    drawCountries(chart);
    
    return () => {
      chart.dispose();
    };
  }, [data]);

  const drawCountries = (chart) => {
    chart.series.clear();

    let polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
    polygonSeries.useGeodata = true;
    polygonSeries.exclude = ["AQ"];


    let countryBubbles = chart.series.push(new am4maps.MapImageSeries());
    let countryTemplate = countryBubbles.mapImages.template;
    countryTemplate.tooltipText = "{name}: {suppliers} Suppliers";


    let outerCircle = countryTemplate.createChild(am4core.Circle);
    outerCircle.radius = 10; 
    outerCircle.fill = am4core.color("#FF5733");
    outerCircle.stroke = am4core.color("#FFFFFF");
    outerCircle.strokeWidth = 2;
    outerCircle.nonScaling = true;
    outerCircle.tooltipText = "{name}: {suppliers} Suppliers";
  
    let innerCircle = countryTemplate.createChild(am4core.Circle);
    innerCircle.radius = 20;
    innerCircle.fill = am4core.color("#FF5733");
    innerCircle.fillOpacity = 0.2; 

    countryTemplate.propertyFields.latitude = "latitude";
    countryTemplate.propertyFields.longitude = "longitude";

    countryBubbles.data = data.countries || [];

    countryTemplate.events.on("hit", function (ev) {
      let countryId = ev.target.dataItem.dataContext.id;
      setSelectedCountry(countryId);
      setSelectedState(null);
    });
  };

  const drawStates = (chart) => {
    chart.series.clear();

    let polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
    polygonSeries.useGeodata = true;
    polygonSeries.include = [selectedCountry];

    let stateBubbles = chart.series.push(new am4maps.MapImageSeries());
    let stateTemplate = stateBubbles.mapImages.template;
    stateTemplate.tooltipText = "{name}: {suppliers} Suppliers";



    let outerCircle = stateTemplate.createChild(am4core.Circle);
    outerCircle.radius = 10; 
    outerCircle.fill = am4core.color("#007BFF");
    outerCircle.stroke = am4core.color("#FFFFFF");
    outerCircle.strokeWidth = 2;
    outerCircle.nonScaling = true;
    outerCircle.tooltipText = "{name}: {suppliers} Suppliers";
  
    let innerCircle = stateTemplate.createChild(am4core.Circle);
    innerCircle.radius = 20; 
    innerCircle.fill = am4core.color("#007BFF");
    innerCircle.fillOpacity = 0.2; 



    stateTemplate.propertyFields.latitude = "latitude";
    stateTemplate.propertyFields.longitude = "longitude";

    stateBubbles.data = data.states[selectedCountry] || [];

    stateTemplate.events.on("hit", function (ev) {
      let state = ev.target.dataItem.dataContext;
      setSelectedState(state.id);
      map.zoomToGeoPoint({ latitude: state.latitude, longitude: state.longitude }, 5);
    });
  };

  const drawCities = (chart) => {
    chart.series.clear();

    let polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
    polygonSeries.useGeodata = true;
    polygonSeries.include = [selectedCountry];

    let cityBubbles = chart.series.push(new am4maps.MapImageSeries());
    let cityTemplate = cityBubbles.mapImages.template;
    cityTemplate.tooltipText = "{name}: {suppliers} Suppliers";


  

    let outerCircle = cityTemplate.createChild(am4core.Circle);
    outerCircle.radius = 10; 
    outerCircle.fill = am4core.color("#28A745");
    outerCircle.stroke = am4core.color("#FFFFFF");
    outerCircle.strokeWidth = 2;
    outerCircle.nonScaling = true;
    outerCircle.tooltipText = "{name}: {suppliers} Suppliers";
  
    let innerCircle = cityTemplate.createChild(am4core.Circle);
    innerCircle.radius = 20; 
    innerCircle.fill = am4core.color("#28A745");
    innerCircle.fillOpacity = 0.2; 



    cityTemplate.propertyFields.latitude = "latitude";
    cityTemplate.propertyFields.longitude = "longitude";

    cityBubbles.data = data.cities[selectedState] || [];

    let firstCity = data.cities[selectedState]?.[0];
    if (firstCity) {
      map.zoomToGeoPoint({ latitude: firstCity.latitude, longitude: firstCity.longitude }, 8);
    }
  };

  useEffect(() => {
    if (selectedCountry && map) {
      drawStates(map);
    } else if (map) {
      drawCountries(map);
    }
  }, [selectedCountry, map, data]);

  useEffect(() => {
    if (selectedState && map) {
      drawCities(map);
    } else if (selectedCountry && map) {
      drawStates(map);
    }
  }, [selectedState, map, data]);

  const handleZoomOut = () => {
    if (selectedState) {
      let country = data.countries.find(c => c.id === selectedCountry);
      console.log(country)
      if (country) {
        map.zoomToGeoPoint({ latitude: country.latitude, longitude: country.longitude }, 0);
      }
      setSelectedState(null);
    } else if (selectedCountry) {
      map.zoomToGeoPoint({ latitude: 20, longitude: 0 }, 1);
      setSelectedCountry(null);
    }
  };
  
  

  return (
    <div style={{ position: "relative", width: "500px", height: "400px" }}>
      <div id="map-element" style={{ width: "100%", height: "100%" }}></div>
      {(selectedCountry || selectedState) && (
        <button
          onClick={handleZoomOut}
          style={{
            position: "absolute",
            top: 20,
            left: 20,
            padding: "10px 15px",
            backgroundColor: "#cfcfcf",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
            zIndex: 10
          }}
        >
        Zoom Out
        </button>
      )}
    </div>
  );
};

export default GeoMap;
