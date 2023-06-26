import React from "react";
import ProfileInfo from "./ProfileInfo.js";
import ProfilePost from "./ProfilePost.js";
import "./Profile.css";


function Profile() {
    return (
        <div className = "profile">
            <ProfileInfo />
            <ProfilePost />
        </div>
    );
};

export default Profile;