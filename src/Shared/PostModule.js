import React, { useState } from "react";
import MediaModule from "./MediaModule.js";
import EventForm from "./EventForm.js";



function PostModule(props) {
    const [popup, popped] = useState(false);

    function togglePopup() {
        popped(initial => !initial); 
        return;
    };
    function closeOnSubmit() {
        popped(false);
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
            <h3>{props.location}</h3>
            <MediaModule  
                images = {props.images}
                mediaClassName = {props.mediaClassName}
                postIcons = {props.postIcons(togglePopup)}
            />
            <p>{props.description}</p>
        </div>
    );
};

export default PostModule;