import React, { useState } from "react";
import "./PostPopup.css";
import MediaPopup from "./MediaPopup.js";


function Post(prop) {
    return (
        <div className = "post-popup">
            <h3>{prop.placeName}</h3>
            <MediaPopup
                images = {prop.images}
            />
            <p>{prop.description}</p>
        </div>
    );
};

export default Post;