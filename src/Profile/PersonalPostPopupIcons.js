import React from "react";
import "./PersonalPostPopupIcons.css";

function PersonalPostPopupIcons(props) {

    function toggleEditPostPopup (event) {
        event.stopPropagation();
        props.toggleEditPostPopup();
    };

    function openDeleteNotifPopup(event) {
        event.stopPropagation();
        props.openDeleteNotifPopup();
    };

    return (
    <div className = "postpopup-icons">
        <i className="fa-solid fa-pen-to-square fa-xl" onClick = {toggleEditPostPopup}></i>
        <i className="fa-solid fa-trash fa-xl" onClick = {openDeleteNotifPopup}></i>
    </div>
    );
};

export default PersonalPostPopupIcons;