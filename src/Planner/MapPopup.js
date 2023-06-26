import React from "react";
import GoogleMap from "../Shared/GoogleMap.js";
import "./MapPopup.css";

function MapPopup(props) {
    return (<div className = "event-map-popup">
                <div className = "event-map-popup-location">
                    <h3>{props.location}</h3>
                </div>
                <div className = "event-map-popup-address">
                    <h3>{props.address}</h3>
                </div>
                <GoogleMap 
                    lat = {props.lat}
                    lng = {props.lng}
                    className = {"event-map"}
                />
                <div className = "event-map-popup-button">
                    <button onClick = {props.closeMapPopup}>CLOSE</button>
                </div>
            </div>);
    };

export default MapPopup;