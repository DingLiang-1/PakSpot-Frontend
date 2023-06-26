import React, {useContext} from "react";
import "./ProfileInfo.css";
import { AuthContext } from "../Shared/AuthContext";
import {Link} from "react-router-dom";

function ProfileInfo() {
    const auth = useContext(AuthContext);
    return (<div className = "profile-header">
        <div className = "profile-info">
            <img className = "profile-pic" src = {require("../Resources/Icons/EmptyProfile.png")}/>
            <h3>Developer</h3>
            <Link to = "/">
                <button className = "logout-button" onClick = {auth.logout}><h4>Logout</h4></button>
            </Link>
        </div>
        <hr className = "profile-info-hr"/>
    </div>);
};

export default ProfileInfo;