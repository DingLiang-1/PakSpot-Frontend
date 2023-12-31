import React, { useState, useEffect, useContext } from "react";
import PostModule from "../Shared/PostModule.js";
import "./Feed.css";
import { AuthContext } from "../Shared/AuthContext.js";
import Notification from "../Shared/Notification.js";
import PostIcons from "./PostIcons.js";

function Feed() {
    const [businessFeed, setBusinessFeed] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const auth = useContext(AuthContext);

    function openLoadingPopup() {
        setIsLoading(true);
    };
    
    function closeLoadingPopup() {
        setIsLoading(false);
    };

    function postIcons(toggleEventForm, openLoadingPopup, closeLoadingPopup, bookmarked, postId, postEntity, like, toggleCommentPopUp, commentState) {
        return <PostIcons 
            toggleEventForm = {toggleEventForm}
            openLoadingPopup = {openLoadingPopup}
            closeLoadingPopup = {closeLoadingPopup}
            toggleCommentPopUp= {toggleCommentPopUp}
            bookmarked = {bookmarked}
            postId = {postId}
            postEntity = {postEntity}
            like={like}
            commentState={commentState}
        />
    };

    useEffect(() => {
        openLoadingPopup();
        if (!auth.userId) {
            return;
        };
        async function getImages() {
            let response;
            try {
                response = await fetch(process.env.REACT_APP_BACKEND_URL + `/shared/feed/${auth.entity}/${auth.userId}`, {
                    method: "GET",
                    headers : {
                        "Authorization" : ("Bearer " + auth.token)
                    },
                });
                if (response.ok) {
                    await response.json().then(FeedArray => {
                        setBusinessFeed(FeedArray.reverse());
                    });
                    closeLoadingPopup();
                    return;
                } else {
                    return;
                };
            } catch(err) {
                return;
            };
        };
        getImages();
    }, [auth]);

    return (
        <div className = "feed">
            {isLoading && <Notification 
                type = "loading"
            />}
            {businessFeed.map((post,index) => {
                return (
                    <PostModule 
                        id = {index}
                        form = {true}
                        postClassName = "post"
                        type = "addEvent"
                        mediaClassName = "media"
                        location = {post.location}
                        images = {post.images}
                        description = {post.description}
                        address = {post.address}
                        postIcons = {postIcons}
                        tags = {post.tags}
                        formHeader = "Set Date"
                        eventFormClassName = "feedEventFormPopup"
                        bookmarked = {post.bookmarked}
                        postId = {post._id}
                        postEntity={post.postEntity}
                        tagContainerClass = "post-tag-container"
                        searchPage = {false}
                        liked={post.liked}
                    />
                )})}
        </div>
    ); 
};


export default Feed;
