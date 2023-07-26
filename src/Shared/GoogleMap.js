import React, {useRef} from "react";
import "./GoogleMap.css";

function GoogleMap(props) {
    const mapRef = useRef();
    let container = (<div ref = {mapRef} className = {"map " + props.className} ></div>);
    async function initMap() {
        const position = { lat: props.lat, lng: props.lng };
        const { Map } = await window.google.maps.importLibrary("maps");
        const { AdvancedMarkerElement } = await window.google.maps.importLibrary("marker");
      
        let map = new Map(mapRef.current, {
          zoom: 15,
          center: position,
          mapId: ("" + props.lat + props.lng)
        });
      
        const marker = new AdvancedMarkerElement({
          map: map,
          position: position,
          title: "",
        });
    };
    initMap();

    return container;
};

export default GoogleMap;