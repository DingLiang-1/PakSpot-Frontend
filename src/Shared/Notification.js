import React from React;


function Notification(props) {
    return (
    <div className = "notification-container">
        <div className = "notification-box">
            <h3>{props.message}</h3>
            <button type = "button" className = "notification-close" />
        </div>
    </div>);
}