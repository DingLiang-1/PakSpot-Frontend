import React, { useState, useContext } from "react";
import "./PostIcons.css";
import { AuthContext } from "../Shared/AuthContext";



function PostIcons(props) {
    const [like, liked] = useState(false);
    const [comment, addComment] = useState(false);
    const [bookmark, bookmarked] = useState(props.bookmarked);
    const auth = useContext(AuthContext);

    //placeholder function, remove this with update "like" function
    function toggleLike() {
        liked(!like);
        return;
    };

    async function toggleBookmark() {
        props.openLoadingPopup();
        try {
            let response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/shared/addbookmark/${auth.entity}/${auth.userId}`, {
                method: "POST",
                headers : {
                "Content-Type" : "application/json",
                "Authorization" : ("Bearer " + auth.token),
                },
                body: JSON.stringify({
                    postId : props.postId,
                    bookmarked : !bookmark
                })
            });
            if (response.ok) {
                props.closeLoadingPopup();
                bookmarked(!bookmark);
                return;
            } else {
                props.closeLoadingPopup();
                console.log("err");
                return;
            }
        } catch (err) {
            props.closeLoadingPopup();
            console.log("catch");
            return;
        };
    };

    return (
    <div className = "postIcons">
        <button className = "post1" type = "button" onClick = {toggleLike}><i className =
        { ((like) ? "fa-solid" : "fa-regular") + " fa-heart fa-2x"}></i></button>
        <button className = "post1" type = "button"><i className ="fa-regular fa-comment fa-2x"></i></button>
        <button className = "post1" type = "button" onClick = {toggleBookmark}><i className =
        {((bookmark) ? "fa-solid" : "fa-regular") + " fa-bookmark fa-2x"}></i></button>
        <button className = "post1" type = "button" onClick = {props.toggleEventForm}><i className ="fa-regular fa-calendar-days fa-2x"></i></button>
    </div>
    );
};

export default PostIcons;