import React , {useState} from "react";
import "./EventBar.css"

function EventBar(props) {
    const [dropDown, setDropDown] = useState(false);

    function toggleEditEventForm(event) {
        event.stopPropagation();
        props.toggleEditEventForm(props.eventId,props.eventDayId);
    };

    function handleDropDown() {
        setDropDown(prev => !prev);
    };

    function handleMapPopup(event) {
        event.stopPropagation();
        props.handleMapPopup(parseFloat(props.lat),parseFloat(props.lng),props.location,props.address);
    }; 

    function openDeleteEventPopup(event) {
        event.stopPropagation();
        props.openDeleteEventNotif(props.eventId,props.eventDayId);
    };

    return (
    <div className = {"event" + (dropDown ? " event-drop-down" : "")} onClick ={handleDropDown}>
        <div className = "event-bar-icons">
            <i className="fa-solid fa-map-location-dot fa-xl" onClick = {handleMapPopup}></i>
            <i className="fa-solid fa-pen-to-square fa-xl" onClick = {toggleEditEventForm}></i>
            <i className="fa-solid fa-trash fa-xl" onClick = {openDeleteEventPopup}></i>
        </div>
        <div className = "event-details"><h4>Location :</h4> <p>{props.location}</p></div>
        <div className = "event-details"><h4>Address     :</h4> <p>{props.address}</p></div>
        <div className = "event-details"><h4>Time     :</h4> <p>{props.startTime + " - " + props.endTime}</p></div>
        {dropDown && <div className = "event-details"><h4>Description :</h4> <p className = "event-description">{props.description}</p></div>}
    </div>);
};

export default EventBar;