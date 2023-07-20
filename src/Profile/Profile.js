import React , {useState, useReducer} from "react";
import ProfileInfo from "./ProfileInfo.js";
import ProfilePost from "./ProfilePost.js";
import "./Profile.css";
import Notification from "../Shared/Notification.js";


function deleteNotifPopupReducer(state, action) {
    switch (action.type) {
        case "OPEN" :
            state = {
                popup :true,
                message : action.message,
                handleDelete : action.handleDelete
            };
            return state;
        case "CLOSE" :
            state = {
                popup : false,
                message : undefined,
                handleDLete : undefined
            };
            return state;
        default :
            return;
        };
};

function Profile() {
    const [notifPopup, setNotifPopup] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [deleteNotifPopup, dispatchDeleteNotifPopup] = useReducer(deleteNotifPopupReducer, {popup : false});
    const [notifMessage, setNotifMessage] = useState("");

    function closeNotifPopup(event) {
        setNotifPopup(false);
    };
    function openNotifPopup(message) {
        setNotifPopup(true);
        setNotifMessage(message);
        
    };
    function openLoadingPopup(event) {
        setIsLoading(true);
    };
    function closeLoadingPopup(event) {
        setIsLoading(false);
    };

    function openDeleteNotifPopup(obj) {
        dispatchDeleteNotifPopup({type : "OPEN", message : obj.message, handleDelete : obj.handleDelete});
    };


    function closeDeleteNotifPopup() {
        dispatchDeleteNotifPopup({type : "CLOSE"});
    };

    return (
        <div className = "profile">
            {notifPopup && 
                <Notification 
                    message = {notifMessage}
                    login = {true}
                    type = "message"
                    handleNotifPopup = {closeNotifPopup}
                />}
            {isLoading && 
                <Notification 
                    login = {true}
                    type = "loading"
                />}
            {deleteNotifPopup.popup && 
                <Notification 
                    message = {deleteNotifPopup.message}
                    login = {true}
                    type = "confirmation"
                    handleNotifPopup = {closeDeleteNotifPopup}
                    handleDelete = {deleteNotifPopup.handleDelete}
                />
            }
            <ProfileInfo />
            <ProfilePost 
                closeLoadingPopup = {closeLoadingPopup}
                openLoadingPopup = {openLoadingPopup}
                openNotifPopup = {openNotifPopup}
                openDeleteNotifPopup = {openDeleteNotifPopup}
                closeDeleteNotifPopup = {closeDeleteNotifPopup}
            />
        </div>
    );
};

export default Profile;