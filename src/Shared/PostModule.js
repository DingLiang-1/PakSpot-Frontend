import React, { useState } from "react";
import {Link} from "react-router-dom";
import MediaModule from "./MediaModule.js";
import EventForm from "./EventForm.js";
import "./DefaultPostModule.css";
import Notification from "./Notification.js";

function PostModule(props) {
    const [popup, popped] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    function toggleEventForm() {
        popped(initial => !initial); 
        return;
    };
    function closeOnSubmit() {
        popped(false);
    };

    function openLoadingPopup() {
        setIsLoading(true);
    };

    function closeLoadingPopup() {
        setIsLoading(false);
    };

    return (
        <div className = {props.postClassName}>
            {props.form && (popup) && <EventForm 
                closeOnSubmit = {closeOnSubmit}
                address = {props.address}
                location = {props.location}
                type = {props.type}
                formHeader = {props.formHeader}
                eventFormClassName = {props.eventFormClassName}
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
            <div className = "post-description">{props.description}</div>
            <div className = "post-tag-container">
                {props.tags.map((tag,index) => {
                    return (
                    (props.searchPage) ? (
                        <div className = "post-tag" onClick = {props.updateTagSearch} value = {tag}>{"#" + tag}</div>
                    ) : (
                    <Link id = {index} to = "/search" state = {tag} style={{ textDecoration: 'none' }}>
                        <div className = "post-tag">{"#" + tag}</div>
                    </Link>
                    ));
                })}
            </div>
        </div>
    );
};

export default PostModule;