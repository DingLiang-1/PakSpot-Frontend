import React from "react";
import Sidebar from "./Sidebar.js";
import "./Background.css";
import { Outlet } from "react-router-dom";

function Background() {
    return (
    <div className = "background">
        <div className = "wrapper">
            <Sidebar />
            <div className = "outlet">
                <Outlet />
            </div>
        </div> 
    </div>
    );
};

export default Background;