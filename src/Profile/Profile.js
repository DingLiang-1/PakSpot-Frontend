import React , {useState} from "react";
import ProfileInfo from "./ProfileInfo.js";
import ProfilePost from "./ProfilePost.js";
import "./Profile.css";
import Notification from "../Shared/Notification.js";




function Profile() {
    const [notifPopup, setNotifPopup] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
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
            <ProfileInfo />
            <ProfilePost 
                closeLoadingPopup = {closeLoadingPopup}
                openLoadingPopup = {openLoadingPopup}
                openNotifPopup = {openNotifPopup}
            />
        </div>
    );
};

export default Profile;