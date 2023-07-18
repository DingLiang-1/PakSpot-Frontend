import React from "react";
import "./Notification.css";



function Notification(props) {
    function notificationType() {
        switch (props.type) {
            case "loading" :
                return (<React.Fragment>
                    <i className ="fas fa-circle-notch fa-spin fa-2x"></i>
                    <h5>Loading</h5>
                </React.Fragment>);
            case "confirmation" :
                return (<React.Fragment>
                    <h5>{props.message}</h5>
                    <div className = "confirmation-notification-button-div">
                        <div className = "notification-button-div button-red">
                            <button type = "button" className = "notification-button" onClick = {props.handleNotifPopup}>CLOSE</button>
                        </div>
                        <div className = "notification-button-div">
                            <button type = "button" className = "notification-button" onClick = {props.handleDelete}>CONFIRM</button>
                        </div>
                    </div>
                </React.Fragment>
                )
            default :
                return (<React.Fragment>
                    <h5>{props.message}</h5>
                    <div className = "notification-button-div">
                        <button type = "button" className = "notification-button" onClick = {props.handleNotifPopup}>CLOSE</button>
                    </div>
                </React.Fragment>);
        };
    };
    return (
    <div className = {"notification-container" + (props.login ? "" : " auth")} >
        <div className = "notification-box">
            {notificationType()}
        </div>
    </div>);
    };

export default Notification;