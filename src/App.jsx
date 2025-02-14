import { AdvancedMarker, APIProvider, Map, Pin, useMap, InfoWindow } from "@vis.gl/react-google-maps";
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { useEffect, useRef, useState } from "react";

const PoiMarkers = (props) => {
  const map = useMap();
  const [markers, setMarkers] = useState({});
  const clusterer = useRef(null);
  const [hoveredMarker, setHoveredMarker] = useState(null);
  const [hoveredCluster, setHoveredCluster] = useState(null);

  useEffect(() => {
    if (!map) return;

    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({
        map,
        renderer: {
          render: ({ count, position, markers }) => {
            const uniqueRegions = new Set(markers.map(m => m.__region));
            const totalBusinessValue = markers.reduce((sum, marker) => sum + (marker.__businessValue || 0), 0);

            const labelText = uniqueRegions.size === 1
              ? `${[...uniqueRegions][0]}`
              : `Total: ₹${totalBusinessValue.toLocaleString()}`;

            const marker = new google.maps.Marker({
              position,
              label: {
                text: labelText,
                color: "black",
                fontSize: "14px",
                fontWeight: "bold"
              },
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 10 + Math.log(count) * 5,
                fillColor: "blue",
                fillOpacity: 0.7,
                strokeColor: "black",
                strokeWeight: 2
              }
            });

            marker.addListener("mouseover", () => {
              setHoveredCluster({ position, totalBusinessValue, uniqueRegions: [...uniqueRegions] });
            });

            marker.addListener("mouseout", () => {
              setHoveredCluster(null);
            });

            return marker;
          }
        }
      });
    }
  }, [map]);

  useEffect(() => {
    clusterer.current?.clearMarkers();
    clusterer.current?.addMarkers(Object.values(markers));
  }, [markers]);

  const setMarkerRef = (marker, key, businessValue, region, name) => {
    if (marker && markers[key]) return;
    if (!marker && !markers[key]) return;

    if (marker) {
      marker.__businessValue = businessValue;
      marker.__region = region;
      marker.__name = name;
    }

    setMarkers((prev) => {
      if (marker) {
        return { ...prev, [key]: marker };
      } else {
        const newMarkers = { ...prev };
        delete newMarkers[key];
        return newMarkers;
      }
    });
  };

  return (
    <>
      {props.pois.map((poi) => (
        <AdvancedMarker
          key={poi.key}
          position={poi.location}
          ref={(marker) => setMarkerRef(marker, poi.key, poi.businessValue, poi.state || poi.country, poi.name)}
          onMouseOver={() => setHoveredMarker(poi)}
          onMouseOut={() => setHoveredMarker(null)}
        >
          <Pin background={"#FBBC04"} glyphColor={"#000"} borderColor={"#000"} />
        </AdvancedMarker>
      ))}

      {/* Tooltip for individual markers */}
      {hoveredMarker && (
        <InfoWindow position={hoveredMarker.location} onCloseClick={() => setHoveredMarker(null)}>
          <div style={{ fontSize: "14px", fontWeight: "bold" }}>
            <p>{hoveredMarker.name}</p>
            <p>Business Value: ₹{hoveredMarker.businessValue.toLocaleString()}</p>
          </div>
        </InfoWindow>
      )}

      {/* Tooltip for clusters */}
      {hoveredCluster && (
        <InfoWindow position={hoveredCluster.position} onCloseClick={() => setHoveredCluster(null)}>
          <div style={{ fontSize: "14px", fontWeight: "bold" }}>
            {hoveredCluster.uniqueRegions.map(region => (
              <p key={region}>{region}</p>
            ))}
            <p><strong>Total: ₹{hoveredCluster.totalBusinessValue.toLocaleString()}</strong></p>
          </div>
        </InfoWindow>
      )}
    </>
  );
};

const mapStyles = [
  {
    "featureType": "all",
    "elementType": "labels",
    "stylers": [{ "visibility": "off" }]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [{ "color": "#000000" }]
  },
  {
    "featureType": "landscape",
    "elementType": "geometry",
    "stylers": [{ "color": "#212121" }]
  }
];

function App() {
  const locations = [
    { key: 'marinaBeach', name: "Marina Beach", location: { lat: 13.0500, lng: 80.2824 }, businessValue: 500000, state: "Tamil Nadu", country: "India" },
    { key: 'meenakshiTemple', name: "Meenakshi Temple", location: { lat: 9.9195, lng: 78.1190 }, businessValue: 300000, state: "Tamil Nadu", country: "India" },
    { key: 'ootyLake', name: "Ooty Lake", location: { lat: 11.4054, lng: 76.6947 }, businessValue: 400000, state: "Tamil Nadu", country: "India" },
    { key: 'gatewayOfIndia', name: "Gateway of India", location: { lat: 18.9219841, lng: 72.8346543 }, businessValue: 700000, state: "Maharashtra", country: "India" },
    { key: 'charminar', name: "Charminar", location: { lat: 17.3616, lng: 78.4747 }, businessValue: 600000, state: "Telangana", country: "India" },
    { key: 'harbourBridge', name: "Sydney Harbour Bridge", location: { lat: -33.852228, lng: 151.2038374 }, businessValue: 800000, state: "New South Wales", country: "Australia" },
    { key: 'sydneyOperaHouse', name: "Sydney Opera House", location: { lat: -33.8567844, lng: 151.213108 }, businessValue: 900000, state: "New South Wales", country: "Australia" },
    { key: 'timesSquare', name: "Times Square", location: { lat: 40.7580, lng: -73.9855 }, businessValue: 1200000, state: "New York", country: "USA" },
    { key: 'statueOfLiberty', name: "Statue of Liberty", location: { lat: 40.6892, lng: -74.0445 }, businessValue: 1100000, state: "New York", country: "USA" },
    { key: 'eiffelTower', name: "Eiffel Tower", location: { lat: 48.8584, lng: 2.2945 }, businessValue: 1500000, state: "Île-de-France", country: "France" },
  ];

  return (
    <>
      <h1>MAP</h1>
      <div>
        <APIProvider apiKey="AIzaSyDt0nwQeb58yFnrbEp56LJufMISdXBlIOQ">
          <Map
            mapId='VISHNU_MAP'
            style={{ width: '100vw', height: '100vh' }}
            defaultZoom={3}
            gestureHandling={'greedy'}
            disableDefaultUI={true}
            defaultCenter={{ lat: 20.5937, lng: 78.9629 }}
            options={{ styles: mapStyles }}
          >
            <PoiMarkers pois={locations} />
          </Map>
        </APIProvider>
      </div>
    </>
  );
}

export default App;
