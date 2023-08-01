import React, { useState, useReducer } from "react";
import {Link} from "react-router-dom";
import MediaModule from "./MediaModule.js";
import EventForm from "./EventForm.js";
import "./DefaultPostModule.css";
import Notification from "./Notification.js";

const notifPopupReducer = (state, action) => {
    return action;
};

function PostModule(props) {
    const [eventFormPopupState, setEventFormPopupState] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [notifPopupState, setNotifPopupState] = useReducer(notifPopupReducer, {popup : false, message :""});

    function toggleEventForm() {
        setEventFormPopupState(initial => !initial); 
        return;
    };

    function closeOnSubmit() {
        setEventFormPopupState(false);
    };

    function openLoadingPopup() {
        setIsLoading(true);
    };

    function closeLoadingPopup() {
        setIsLoading(false);
    };

    function closeNotifPopup() {
        setNotifPopupState({popup : false, message : ""});
    };

    function openNotifPopup(message) {
        setNotifPopupState({popup : true, message : message});
    };

    return (
        <div className = {props.postClassName}>
            {notifPopupState.popup && <Notification
                login = {true}
                type = "eventNotification"
                message = {notifPopupState.message}
                handleNotifPopup = {closeNotifPopup}
            />}

            {props.form && (eventFormPopupState) && <EventForm 
                closeOnSubmit = {closeOnSubmit}
                address = {props.address}
                location = {props.location}
                type = {props.type}
                formHeader = {props.formHeader}
                eventFormClassName = {props.eventFormClassName}
                openLoadingPopup = {openLoadingPopup}
                closeLoadingPopup = {closeLoadingPopup}
                openNotifPopup = {openNotifPopup}
            />}
            {isLoading && <Notification 
                login = {true}
                type = "loading"
            />}
            <h3>{props.location}</h3>
            <h6>{props.address}</h6>
            <MediaModule  
                images = {props.images}
                mediaClassName = {props.mediaClassName}
                postIcons = {props.postIcons(toggleEventForm,openLoadingPopup,closeLoadingPopup,props.bookmarked,props.postId)}
            />
            <div className = "post-description-container">
            <div className = "post-description">{props.description}</div>
            </div>
                <div className = {props.tagContainerClass}>
                    {props.tags.map((tag,index) => {
                        return (
                            (props.searchPage) ? (
                                <div id = {index} className = "post-tag" onClick = {props.updateTagSearch} value = {tag}>{"#" + tag}</div>
                            ) : (
                            <Link id = {index} to = "/search" state = {tag} style={{ textDecoration: 'none' }}>
                                <div className = "post-tag">{"#" + tag}</div>
                            </Link>)
                        );
                    })}
                </div>
         </div>
    );
};

export default PostModule;