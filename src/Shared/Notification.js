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
                    <h4>{props.message}</h4>
                    <div className = "confirmation-notification-button-div">
                        <div className = "notification-delete-button-div">
                            <button type = "button" onClick = {props.handleNotifPopup}>CANCEL</button>
                        </div>
                        <div className = "notification-button-div">
                            <button type = "button" onClick = {props.handleDelete}>CONFIRM</button>
                        </div>
                    </div>
                </div>
                )
            default :
                return (<div className = "notification-box">
                    <h4>{props.message}</h4>
                    <div className = "notification-button-div">
                        <button type = "button" className = "notification-button" onClick = {props.handleNotifPopup}>CLOSE</button>
                    </div>
                </div>);
        };
    };
    return (
    <div className = {"notification-container" + (props.login ? "" : " auth")} >
        {notificationType()}
    </div>);
    };

export default Notification;