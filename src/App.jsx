import { AdvancedMarker, APIProvider, Map, Pin, useMap } from "@vis.gl/react-google-maps"
import {MarkerClusterer} from '@googlemaps/markerclusterer';
import { useEffect, useRef, useState } from "react";

const PoiMarkers = (props) => {
  const map = useMap();
  const [markers, setMarkers] = useState({});
  const clusterer = useRef(null);

  useEffect(() => {
    if (!map) return;
    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({map});
    }
  }, [map]);
  useEffect(() => {
    clusterer.current?.clearMarkers();
    clusterer.current?.addMarkers(Object.values(markers));
  }, [markers]);


  const setMarkerRef = (marker, key) => {
    if (marker && markers[key]) return;
    if (!marker && !markers[key]) return;

    setMarkers(prev => {
      if (marker) {
        return {...prev, [key]: marker};
      } else {
        const newMarkers = {...prev};
        delete newMarkers[key];
        return newMarkers;
      }
    });
  };
  return (
    <>
      {props.pois.map( (poi) => (
        <AdvancedMarker
          key={poi.key}
          position={poi.location}
          ref={marker => setMarkerRef(marker, poi.key)}
          >
        <Pin background={'#FBBC04'} glyphColor={'#000'} borderColor={'#000'} />
        </AdvancedMarker>
      ))}
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
    "featureType": "poi",
    "elementType": "all",
    "stylers": [{ "visibility": "off" }]
  },
  {
    "featureType": "road",
    "elementType": "all",
    "stylers": [{ "visibility": "off" }]
  },
  {
    "featureType": "transit",
    "elementType": "all",
    "stylers": [{ "visibility": "off" }]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [{ "color": "#000000" }] // Change water color if needed
  },
  {
    "featureType": "landscape",
    "elementType": "geometry",
    "stylers": [{ "color": "#212121" }] // Background color of the land
  }
];



function App() {
  const locations = [
    {key: 'operaHouse', location: { lat: -33.8567844, lng: 151.213108  }},
    {key: 'tarongaZoo', location: { lat: -33.8472767, lng: 151.2188164 }},
    {key: 'manlyBeach', location: { lat: -33.8209738, lng: 151.2563253 }},
    {key: 'hyderPark', location: { lat: -33.8690081, lng: 151.2052393 }},
    {key: 'theRocks', location: { lat: -33.8587568, lng: 151.2058246 }},
    {key: 'circularQuay', location: { lat: -33.858761, lng: 151.2055688 }},
    {key: 'harbourBridge', location: { lat: -33.852228, lng: 151.2038374 }},
    {key: 'kingsCross', location: { lat: -33.8737375, lng: 151.222569 }},
    {key: 'botanicGardens', location: { lat: -33.864167, lng: 151.216387 }},
    {key: 'museumOfSydney', location: { lat: -33.8636005, lng: 151.2092542 }},
    {key: 'maritimeMuseum', location: { lat: -33.869395, lng: 151.198648 }},
    {key: 'kingStreetWharf', location: { lat: -33.8665445, lng: 151.1989808 }},
    {key: 'aquarium', location: { lat: -33.869627, lng: 151.202146 }},
    {key: 'darlingHarbour', location: { lat: -33.87488, lng: 151.1987113 }},
    {key: 'barangaroo', location: { lat: - 33.8605523, lng: 151.1972205 }},
      {key: 'marinaBeach', location: { lat: 13.0500, lng: 80.2824 }},
      {key: 'meenakshiTemple', location: { lat: 9.9195, lng: 78.1190 }},
      {key: 'brihadeeswararTemple', location: { lat: 10.7829, lng: 79.1312 }},
      {key: 'mahabalipuram', location: { lat: 12.6208, lng: 80.1945 }},
      {key: 'ootyLake', location: { lat: 11.4054, lng: 76.6947 }},
      {key: 'kodaikanalLake', location: { lat: 10.2346, lng: 77.4890 }},
      {key: 'velloreFort', location: { lat: 12.9192, lng: 79.1333 }},
      {key: 'rameswaramTemple', location: { lat: 9.2881, lng: 79.3174 }},
      {key: 'hogenakkalFalls', location: { lat: 12.1103, lng: 77.7666 }},
      {key: 'mukurthiNationalPark', location: { lat: 11.2737, lng: 76.4861 }},
      {key: 'mudumalaiWildlifeSanctuary', location: { lat: 11.6210, lng: 76.5851 }},
      {key: 'kanyakumari', location: { lat: 8.0883, lng: 77.5385 }},
      {key: 'valluvarKottam', location: { lat: 13.0607, lng: 80.2437 }},
      {key: 'thanjavurPalace', location: { lat: 10.7828, lng: 79.1353 }},
      {key: 'coimbatoreVOCPark', location: { lat: 11.0168, lng: 76.9558 }},
    
  ];

  
  return (
    <>
    <h1>MAP</h1>
    <div  >
      <APIProvider apiKey="AIzaSyDt0nwQeb58yFnrbEp56LJufMISdXBlIOQ">
      <Map
      mapId='VISHNU_MAP'
       style={{width: '100vw', height: '100vh'}}
       defaultZoom={3}
       gestureHandling={'greedy'}
       disableDefaultUI={true}
       mapTypeControl={false}
       
      defaultCenter={ { lat: -33.860664, lng: 151.208138 } }
      options={{ styles: mapStyles }} 
      onCameraChanged={ (ev) =>
        console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom)
      }
      >
        <PoiMarkers pois={locations} />
      </Map>
    </APIProvider>
    </div>
    </>
  )
}

export default App