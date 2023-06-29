import React from "react";
import "./Notification.css";



function Notification(props) {
    return (
    <div className = {"notification-container" + (props.login ? "" : " auth")} >
        <div className = "notification-box">
            {props.type === "loading" ?
                (<React.Fragment>
                    <i className ="fas fa-circle-notch fa-spin fa-2x"></i>
                    <h5>Loading</h5>
                </React.Fragment>) :
            <React.Fragment>
                <h5>{props.message}</h5>
                <div className = "notification-button-div">
                    <button type = "button" className = "notification-button" onClick = {props.handleNotifPopup}>CLOSE</button>
                </div>
            </React.Fragment>}
        </div>
    </div>);
};

export default Notification;