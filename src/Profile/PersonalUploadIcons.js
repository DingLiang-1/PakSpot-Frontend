import React from "react";
import "./PersonalUploadIcons.css";

function PersonalUploadIcons(props) {

    function toggleEditPostPopup (event) {
        event.stopPropagation();
        props.toggleEditPostPopup();
    };

    function openDeleteNotifPopup(event) {
        event.stopPropagation();
        props.openDeleteNotifPopup();
    };

    return (
    <div className = "personal-upload-icons">
        <i className="fa-solid fa-pen-to-square fa-xl" onClick = {toggleEditPostPopup}></i>
        <i className="fa-solid fa-trash fa-xl" onClick = {openDeleteNotifPopup}></i>
    </div>
    );
};

export default PersonalUploadIcons;