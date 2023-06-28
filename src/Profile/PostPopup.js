import React, { useState } from "react";
import "./PostPopup.css";
import MediaPopup from "./MediaPopup.js";


function PostPopup(prop) {
    return (
        prop ? 
            (<div className = "post-popup">
                <h3>{prop.post.location}</h3>
                <MediaPopup
                    images = {prop.post.images}
                />
                <p>{prop.post.description}</p>
            </div>) :
        (<p>No post yet</p>)
    );
};

export default PostPopup;