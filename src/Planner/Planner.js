import React, { useReducer, useState, useEffect, useContext} from "react";
import Calendar from "./Calendar.js";
import Activities from "./Activities.js";
import EventForm from "../Shared/EventForm.js";
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

function editEventFormReducer(state,action) {
    switch (action.type) {
        case "TOGGLE" :
            state = {
                popup : !state.popup,
                id : action.id,
                eventDayId : action.eventDayId
            };
            return state;
        case "CLOSE" :
            state = {
                popup : false,
                id : undefined,
                eventDayId : undefined
            };
            return state;
        default :
        return state;
    };
};

function notifPopupReducer(state,action) {
    switch (action.type) {
        case "OPEN" :
            state = {
                popup : true,
                message : action.message
            };
            return state;
        case "CLOSE" :
            state = {
                popup : false,
                message : undefined
            };
            return state;
        default :
            return state;
    }
};

function deleteEventNotifStateReducer(state,action) {
    switch (action.type) {
        case "OPEN" :
            state = {
                popup : true,
                eventDayId : action.eventDayId,
                eventId : action.eventId,
                message : "Please confirm delete"
            };
            return state;
        case "CLOSE" :
            state = {
                popup : false,
                eventDayId: undefined,
                eventId : undefined,
                message : undefined
            };
            return state;
        default :
            return state;
    };
};

function Planner() {
    const auth = useContext(AuthContext);
    const todayDate = new Date();
    let todayDateNumber = todayDate.getDate();
    let todayDateYear = todayDate.getFullYear();
    let todayDateMonth = todayDate.getMonth() + 1; //Plus 1 here because Jan is represented by 0;
    const [dateState, dispatchDate] = useReducer(plannerReducer, {currentDateNumber : todayDateNumber, currentDateMonth : todayDateMonth, currentDateYear : todayDateYear });
    const [eventUpdate, toggleEventUpdate] = useState(false);
    const [loadedData, setLoadedData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [notifPopupState, dispatchNotifPopupState] = useReducer(notifPopupReducer,{popup : false});
    const [editEventFormState, dispatchEditEventForm] = useReducer(editEventFormReducer, {popup:false});
    const [mapPopupState, dispatchMap] = useReducer(mapPopupReducer, {popup:false});
    const [deleteEventNotifState, dispatchDeleteEventNotifState] = useReducer(deleteEventNotifStateReducer, {popup : false});

    function refreshPage() {
        toggleEventUpdate(initial => !initial);
    };
    
    function handleYearUpdate(year) {
        dispatchDate({type : "UPDATEYEAR", dateYear : year});
    };
    function handleMonthUpdate(month) {
        dispatchDate({type : "UPDATEMONTH", dateMonth : month});
    };

    function handleDateUpdate(dateObj) {
        dispatchDate({type : "UPDATEDATE", dateInputs : {...dateObj}});
    };

    function openLoadingPopup(event) {
        setIsLoading(true);
    };
    
    function closeLoadingPopup(event) {
        setIsLoading(false);
    };

    function openNotifPopup(message) {
        dispatchNotifPopupState({type : "OPEN", message : message});
    };

    function closeNotifPopup() {
        dispatchNotifPopupState({type : "CLOSE"});
    };

    async function scheduledEvents() {
        if (!auth.userId) {
            return;
        };
        let response;
        openLoadingPopup();
        try { 
            response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/users/getscheduledevents/${auth.userId}`, {
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
                closeLoadingPopup();
                openNotifPopup("An error occurred, please refresh the page!");
                return;
            }
        } catch(err) {
            closeLoadingPopup();
            openNotifPopup("An error occurred, please refresh the page!");
        };
    };


    function handleMapPopup(lat, lng, location, address) {
        dispatchMap({lat : lat, lng : lng, type : "POPUP", location : location, address :address});
    };

    function closeMapPopup() {
        dispatchMap({type : "CLOSE"});
    };

    function toggleEditEventForm(id, eventDayId) {
        dispatchEditEventForm({id : id, eventDayId : eventDayId, type : "TOGGLE"});
    }

    function closeEditEventForm() {
        dispatchEditEventForm({type : "CLOSE"});
    };

    useEffect(() => {closeEditEventForm();}, [dateState.currentDateNumber]);

    function openDeleteEventNotif(eventId, eventDayId) {
        dispatchDeleteEventNotifState({type : "OPEN", eventDayId : eventDayId, eventId : eventId});
    };

    function closeDeleteEventNotif() {
        dispatchDeleteEventNotifState({type : "CLOSE"});
    };

    async function deleteEventReq() {
        let response;
        closeEditEventForm();
        closeDeleteEventNotif();
        openLoadingPopup();
        try { response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/users/deletescheduledevent/${auth.userId}`, {
            method: "POST",
            headers : {
            "Content-Type" : "application/json",
            "Authorization" : "Bearer " + (auth.token),
            },
            body: JSON.stringify({
                eventDayId : deleteEventNotifState.eventDayId,
                eventId : deleteEventNotifState.eventId
            })
            });
            if (response.ok) {
                closeLoadingPopup();
                refreshPage();
                await response.json().then(data => {openNotifPopup(data.message);});
                return;
            } else {
                closeLoadingPopup();
                await response.json().then(error => {openNotifPopup(error.error);});
                return;
            };
        } catch(err) {
            closeLoadingPopup();
            openNotifPopup("An error occurred, please refresh the page!");
            return;
        };
    };

    useEffect(() => {scheduledEvents();}, [dateState.currentDateMonth, dateState.currentDateYear, eventUpdate,auth]);

    return (
        <div className = "calendar-map-container">
            {notifPopupState.popup && <Notification
                type = "eventNotification"
                content = {<h4>{notifPopupState.message}</h4>}
                handleNotifPopup = {closeNotifPopup}
            />}

            {isLoading && <Notification 
                type = "loading"
            />}

            {deleteEventNotifState.popup && <Notification
                type = "confirmation"
                content = {<div className = "delete-event-notif-content"><h4>{deleteEventNotifState.message}</h4></div>}
                handleConfirm = {deleteEventReq}
                handleNotifPopup = {closeDeleteEventNotif}
            />}
            <div className = "planner">
                <Calendar 
                    currentDateYear = {dateState.currentDateYear}
                    currentDateMonth = {dateState.currentDateMonth}
                    currentDateNumber = {dateState.currentDateNumber}
                    handleYearUpdate = {handleYearUpdate}
                    handleMonthUpdate = {handleMonthUpdate}
                    handleDateUpdate = {handleDateUpdate}
                    eventDays = {loadedData.map(date => (date.day))}
                />

                <Activities
                    currentDateYear = {dateState.currentDateYear}
                    currentDateMonth = {dateState.currentDateMonth}
                    currentDateNumber = {dateState.currentDateNumber}
                    handleMapPopup = {handleMapPopup}
                    toggleEditEventForm = {toggleEditEventForm}
                    openDeleteEventNotif = {openDeleteEventNotif}
                    eventDay = {loadedData.filter(docs => (docs.day === dateState.currentDateNumber.toString()))[0]}
                />
                {editEventFormState.popup && <EventForm 
                    closeOnSubmit = {closeEditEventForm}
                    eventId = {editEventFormState.id}
                    eventDayId = {editEventFormState.eventDayId}
                    type = "editEvent"
                    formHeader = "Edit Date"
                    eventFormClassName = "edit-event-form"
                    openLoadingPopup = {openLoadingPopup}
                    closeLoadingPopup = {closeLoadingPopup}
                    openNotifPopup = {openNotifPopup}
                    refreshPage = {refreshPage}
                />}
            </div>
            {mapPopupState.popup && (
                <MapPopup 
                    lat = {mapPopupState.lat}
                    lng = {mapPopupState.lng}
                    location = {mapPopupState.location}
                    address = {mapPopupState.address}
                    closeMapPopup = {closeMapPopup}
                />)
            } 
        </div>
    );
};

export default Planner;


