import React, { useState, useReducer } from "react";
import {Link} from "react-router-dom";
import MediaModule from "./MediaModule.js";
import EventForm from "./EventForm.js";
import "./DefaultPostModule.css";
import Notification from "./Notification.js";
import CommentModule from './CommentModule.js';

const notifPopupReducer = (state, action) => {
    return action;
};

function PostModule(props) {
    const [eventFormPopupState, setEventFormPopupState] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [notifPopupState, setNotifPopupState] = useReducer(notifPopupReducer, {popup : false, message :""});
    const [commentPopUp, setCommentPopUp] = useState(false);

    function toggleEventForm() {
        setEventFormPopupState(initial => !initial); 
        return;
    };

    function closeOnSubmit() {
        setEventFormPopupState(false);
    };

    const toggleCommentPopUp = () => {
        setCommentPopUp(prev => !prev);
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
                type = "eventNotification"
                content = {<h4>{notifPopupState.message}</h4>}
                handleNotifPopup = {closeNotifPopup}
            />}
            {isLoading && <Notification 
                type = "loading"
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
            {
             commentPopUp && <CommentModule
                closeCommentPopUp={toggleCommentPopUp}
                postId={props.postId}
                postEntity={props.postEntity}
             />
            }
            <h3>{props.location}</h3>
            <h6>{props.address}</h6>
            <MediaModule  
                images = {props.images}
                mediaClassName = {props.mediaClassName}
                postIcons = {
                    props.postIcons(
                        toggleEventForm, 
                        openLoadingPopup, 
                        closeLoadingPopup,
                        props.bookmarked, 
                        props.postId,
                        props.postEntity,
                        props.liked,
                        toggleCommentPopUp,
                        commentPopUp
                    )   
                }
            />
            <div className = "post-description-container">
            <div className = "post-description">{props.description}</div>
            </div>
                <div className = {props.tagContainerClass}>
                    {props.tags.map((tag,index) => {
                        return (
                            (props.searchPage) ? (
                                <button type = "button" id = {index} className = "post-tag" onClick = {props.updateTagSearch} value = {tag}>{"#" + tag}</button>
                            ) : (
                            <Link id = {index} to = "/search" state = {tag} style={{ textDecoration: 'none' }}>
                                <button type = "button" className = "post-tag">{"#" + tag}</button>
                            </Link>)
                        );
                    })}
                </div>
         </div>
    );
};

export default PostModule;