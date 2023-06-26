import React, {useState, useReducer } from "react";
import "./Activities.css";
import EventBar from "./EventBar.js";

function Activities(props) {
    let currentDate = "" + props.currentDateYear + "-" + (props.currentDateMonth < 10 ? "0" + props.currentDateMonth : props.currentDateMonth ) + "-" + (props.currentDateNumber < 10 ? "0" + props.currentDateNumber : props.currentDateNumber);
    let currentDay = new Date(currentDate).getDay();
    const day = ["SUN","MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const month = ["JAN","FEB","MAR","APR","MAY","JUNE","JULY","AUG","SEP","OCT","NOV","DEC"];

    return (
    <div className = "events-container">
        <div className = "current-date">
            <h3>{day[currentDay] + " " + props.currentDateNumber + " " + month[props.currentDateMonth - 1] + " " + props.currentDateYear}</h3>
        </div>
        <div className = {(props.eventDay) ? (props.eventDay.events.length) ? "events" : "no-events": "no-events"}>
            {(props.eventDay) ?
                (props.eventDay.events.length) ?
                    props.eventDay.events.map((event,index) => 
                        (<EventBar
                            key = {event._id}
                            id = {event._id}
                            location = {event.location}
                            address = {event.address}
                            startTime = {event.startTime}
                            endTime = {event.endTime}
                            description = {event.description}
                            lat = {event.coor.lat}
                            lng = {event.coor.lng}
                            handleMapPopup = {props.handleMapPopup}
                        />)) :
                    <h3>NO EVENTS SCHEDULED</h3>
                :
                <h3>NO EVENTS SCHEDULED</h3>
            }
        </div>
    </div>);         
};

export default Activities;