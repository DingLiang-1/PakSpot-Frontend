import React from "react";
import "./PersonalPostPopupIcons.css";

function PersonalPostPopupIcons(props) {
    return (
    <div className = "postpopup-icons">
        <i className="fa-solid fa-pen-to-square fa-xl" onClick = {props.toggleEditPostPopup}></i>
        <i className="fa-solid fa-trash fa-xl"></i>
    </div>
    );
};

export default PersonalPostPopupIcons;