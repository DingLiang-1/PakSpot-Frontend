import React, {useContext} from "react";
import {Link} from "react-router-dom";
import "./Sidebar.css";
import { AuthContext } from "./AuthContext";


function Sidebar() {
    const auth = useContext(AuthContext);
    return (
        <div className="mynav">
            <div className = "logo">
                <img src = {require("../Resources/Icons/appIcon.png")}/>
                <h2>PakSpot</h2>
            </div>
            <ul>
                <Link to = "/">
                    <button type = "submit"><li className="icon fa fa-home" id="uno"></li></button>
                </Link>
                <Link to = "/search">
                    <button type = "submit"><li className="icon fa fa-compass" id="dos"></li></button>
                </Link>
                {auth.entity === "users" &&
                <Link to = "/planner">
                    <button type = "submit"><li className="icon fa fa-calendar-o" id="cuatro"></li></button>
                </Link>}
                <Link to = "/profile">
                    <button type = "submit"><li className="icon fa fa-user" id="cuatro"></li></button>
                </Link>
            </ul>
        </div>
    );
};

export default Sidebar;