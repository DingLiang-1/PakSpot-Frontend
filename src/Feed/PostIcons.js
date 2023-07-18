import React, { useState } from "react";
import "./PostIcons.css";



function PostIcons(props) {
    const [like, liked] = useState(false);
    const [comment, addComment] = useState(false);
    const [bookmark, bookmarked] = useState(false);

    function toggleLike() {
        liked(!like);
        return;
    };

    function toggleBookmark() {
        bookmarked(!bookmark);
        return;
    };

    return (
    <div className = "postIcons">
        <button className = "post1" type = "button" onClick = {toggleLike}><i className =
        { ((like) ? "fa-solid" : "fa-regular") + " fa-heart fa-2x"}></i></button>
        <button className = "post1" type = "button"><i className ="fa-regular fa-comment fa-2x"></i></button>
        <button className = "post1" type = "button" onClick = {toggleBookmark}><i className =
        {((bookmark) ? "fa-solid" : "fa-regular") + " fa-bookmark fa-2x"}></i></button>
        <button className = "post1" type = "button" onClick = {props.togglePopup}><i className ="fa-regular fa-calendar-days fa-2x"></i></button>
    </div>
    );
};

export default PostIcons;