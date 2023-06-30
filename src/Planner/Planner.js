import React, { useReducer, useState, useEffect, useCallback, useContext} from "react";
import Calendar from "./Calendar.js";
import Activities from "./Activities.js";
import "./Planner.css";
import MapPopup from "./MapPopup.js";
import { AuthContext } from "../Shared/AuthContext.js";
import Notification from "../Shared/Notification.js";

function plannerReducer(state, action) {
    switch (action.type) {
        case "UPDATEMONTH":
            state = {
                ...state,
                currentDateMonth : action.dateMonth
            };
            return state;
        case "UPDATEYEAR":
            state = {
                ...state,
                currentDateYear : action.dateYear
            };
            return state;
        case "UPDATEDATE":
            state = {
                ...state,
                ...action.dateInputs
            };
            return state;
        default:
            return state;
    };
};

function mapPopupReducer(state,action) {
    switch(action.type) {
        case("POPUP"):
            state = {
                popup : true,
                lat : action.lat,
                lng : action.lng,
                location : action.location,
                address : action.address
            };
            return state;
        case("CLOSE"):
            state = {
                popup :false,
                lat : undefined,
                lng : undefined,
                location : undefined,
                address : undefined
            };
            return state;
        default :
            return state;
    };
};

function Planner() {
    const auth = useContext(AuthContext)
    const todayDate = new Date();
    let todayDay = todayDate.getDay();
    let todayDateNumber = todayDate.getDate();
    let todayDateYear = todayDate.getFullYear();
    let todayDateMonth = todayDate.getMonth() + 1;
    const [dateState, dispatchDate] = useReducer(plannerReducer, {currentDateNumber : todayDateNumber, currentDateMonth : todayDateMonth, currentDateYear : todayDateYear });
    function handleYearUpdate(year) {
        dispatchDate({type : "UPDATEYEAR", dateYear : year});
    };
    function handleMonthUpdate(month) {
        dispatchDate({type : "UPDATEMONTH", dateMonth : month});
    };

    function handleDateUpdate(dateObj) {
        dispatchDate({type : "UPDATEDATE", dateInputs : {...dateObj}});
    };
    
    const [loadedData, setLoadedData] = useState([]);

    const [isLoading, setIsLoading] = useState(true);

    function openLoadingPopup(event) {
        setIsLoading(true);
    };
    function closeLoadingPopup(event) {
        setIsLoading(false);
    };

    const scheduledEvents = useCallback(async function () {
        let response;
        openLoadingPopup();
        try { response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/users/getscheduledevents/${auth.userId}`, {
            method: "POST",
            headers : {
            "Content-Type" : "application/json",
            "Authorization" : "Bearer " + (auth.token),
            },
            body: JSON.stringify({
                year : dateState.currentDateYear.toString(),
                month : dateState.currentDateMonth.toString()
            })
            });
            if (response.ok) {
                await response.json().then(data => setLoadedData(data.events));
                closeLoadingPopup();
                return;
            } else {
                console.log("an error occured");
            }
        } catch(err) {
            console.log("error");
        }}, [dateState.currentDateMonth,dateState.currentDateYear]);

    useEffect(() => {scheduledEvents();}, [dateState.currentDateMonth, dateState.currentDateYear]);

    const [mapPopupState, dispatchMap] = useReducer(mapPopupReducer, {popup:false});
    function handleMapPopup(lat, lng, location, address) {
        dispatchMap({lat : lat, lng : lng, type : "POPUP", location : location, address :address});
    };
    function closeMapPopup() {
        dispatchMap({type : "CLOSE"});
    };

    return (
    <div className = "planner">
        {isLoading && <Notification 
                    login = {true}
                    type = "loading"
                />}
        {mapPopupState.popup ? (
            <MapPopup 
                lat = {mapPopupState.lat}
                lng = {mapPopupState.lng}
                location = {mapPopupState.location}
                address = {mapPopupState.address}
                closeMapPopup = {closeMapPopup}
            />) :
            (<Calendar 
            currentDateYear = {dateState.currentDateYear}
            currentDateMonth = {dateState.currentDateMonth}
            currentDateNumber = {dateState.currentDateNumber}
            handleYearUpdate = {handleYearUpdate}
            handleMonthUpdate = {handleMonthUpdate}
            handleDateUpdate = {handleDateUpdate}
            eventDays = {loadedData.map(date => (date.day))}
            />)
        };

        <Activities
            currentDateYear = {dateState.currentDateYear}
            currentDateMonth = {dateState.currentDateMonth}
            currentDateNumber = {dateState.currentDateNumber}
            handleMapPopup = {handleMapPopup}
            eventDay = {loadedData.filter(docs => (docs.day === dateState.currentDateNumber.toString()))[0]}
            />
    </div>
)};

export default Planner;


