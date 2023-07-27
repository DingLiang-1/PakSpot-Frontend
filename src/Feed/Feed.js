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

    function openLoadingPopup(event) {
        setIsLoading(true);
    };
    
    function closeLoadingPopup(event) {
        setIsLoading(false);
    };

   //function to add variables and functions from PostModule into PostIcons going inside the PostModule
    function postIcons(toggleEventForm,openLoadingPopup,closeLoadingPopup,bookmarked,postId) {
        return <PostIcons 
            toggleEventForm = {toggleEventForm}
            openLoadingPopup = {openLoadingPopup}
            closeLoadingPopup = {closeLoadingPopup}
            bookmarked = {bookmarked}
            postId = {postId}
        />
    };

    useEffect(() => {
        openLoadingPopup();
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
                    console.log("Please refresh the page");
                    return;
                };
            } catch(err) {
                console.log(err);
                return;
            };
        };
        getImages();
    }, []);

    return (
        <div className = "feed">
            {isLoading && <Notification 
                login = {true}
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
                        tagContainerClass = "post-tag-container"
                        searchPage = {false}
                    />
                )})}
        </div>
    ); 
};


export default Feed;
