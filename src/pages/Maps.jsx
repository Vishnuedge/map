import React, { useRef, useState } from "react";
import GeoMap from "../components/Geo";

const Maps = () => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const geoMapRef = useRef(null);

  const handleCountrySelect = (countryId) => {
    setSelectedCountry(countryId);
    setSelectedState(null);
  };

  const handleStateSelect = (stateId) => {
    setSelectedState(stateId);
  };

  const handleZoomOut = () => {
    if (geoMapRef.current) {
      geoMapRef.current.zoomOut();
    }
    if (selectedState) {
      setSelectedState(null);
    } else if (selectedCountry) {
      setSelectedCountry(null);
    }
  };

  return (
    <div>
      <GeoMap
        ref={geoMapRef}
        selectedCountry={selectedCountry}
        selectedState={selectedState}
        onCountrySelect={handleCountrySelect}
        onStateSelect={handleStateSelect}
      />
      {(selectedCountry || selectedState) && (
        <button onClick={handleZoomOut}>Zoom Out</button>
      )}
    </div>
  );
};

export default Maps;
