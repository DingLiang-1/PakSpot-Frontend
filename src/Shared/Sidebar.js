import React from "react";
import {Link} from "react-router-dom";
import "./Sidebar.css";


function Sidebar() {
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
                <form action = "/searchIcon" method = "post">
                    <button type = "submit"><li className="icon fa fa-compass" id="dos"></li></button>
                </form>
                {/*<form action = "/postIcon" method = "post">
                    <button type = "submit"><li className="icon fa fa-plus-square-o" id="tres"></li></button>
                </form>*/}
                <Link to = "/planner">
                    <button type = "submit"><li className="icon fa fa-calendar-o" id="cuatro"></li></button>
                </Link>
                <Link to = "/profile">
                    <button type = "submit"><li className="icon fa fa-user" id="cuatro"></li></button>
                </Link>
            </ul>
        </div>
    );
};

export default Sidebar;