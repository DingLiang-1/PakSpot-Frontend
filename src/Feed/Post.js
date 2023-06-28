import React, { useState } from "react";
import Media from "./Media.js";
import PlannerForm from "./PlannerForm.js";
import "./Post.css";


function Post(prop) {
    const [popup, popped] = useState(false);
    function togglePopup(boo) {
        popped(boo); 
        return;
    };
    function closeOnSubmit() {
        popped(false);
    };

    return (
        <div className = "post">
            {(popup) && <PlannerForm closeOnSubmit = {closeOnSubmit}/>}
            <h3>{prop.location}</h3>
            <Media  
                images = {prop.images}
                popped = {togglePopup}
                popup = {popup}
            />
            <p>{prop.description}</p>
        </div>
    );
};

export default Post;