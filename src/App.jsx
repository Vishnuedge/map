import { useEffect, useRef, useState } from "react";
import GeoMap from "./components/Geo";

 

function App() {
  return (
    <>
      <h1>Charts</h1>
      <div style={{padding : "1rem"}} >
        <GeoMap />
      </div>
     
    </>
  );
}

export default App;
