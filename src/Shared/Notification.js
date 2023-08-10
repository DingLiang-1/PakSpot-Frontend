import React from "react";
import "./Notification.css";



function Notification(props) {
    function notificationType() {
        switch (props.type) {
            case "loading" :
                return (<div className = "loading-spinner-box">
                    <i className ="fas fa-circle-notch fa-spin fa-2x"></i>
                    <h5>Loading</h5>
                </div>);
            case "confirmation" :
                return (<div className = "notification-box">
                    {props.content}
                    <div className = "confirmation-notification-button-div">
                        <div className = "notification-button-div">
                            <button type = "button" onClick = {props.handleConfirm}>CONFIRM</button>
                        </div>
                        <div className = "notification-delete-button-div">
                            <button type = "button" onClick = {props.handleNotifPopup}>CANCEL</button>
                        </div>
                    </div>
                </div>
                )
            default :
                return (<div className = "notification-box">
                    {props.content}
                    <div className = "notification-button-div">
                        <button type = "button" className = "notification-button" onClick = {props.handleNotifPopup}>CLOSE</button>
                    </div>
                </div>);
        };
    };
    return (
    <div className = {"notification-container"} >
        {notificationType()}
    </div>);
    };

export default Notification;