import React, { useState, useEffect, useContext } from "react";
import PostModule from "../Shared/PostModule.js";
import "./Feed.css";
import "./Media.css";
import "./Post.css";
import { AuthContext } from "../Shared/AuthContext.js";
import Notification from "../Shared/Notification.js";
import PostIcons from "./PostIcons.js";

function Feed() {
    const [businessFeed, setBusinessFeed] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    function openLoadingPopup(event) {
        setIsLoading(true);
    };
    function closeLoadingPopup(event) {
        setIsLoading(false);
    };
    const auth = useContext(AuthContext);
    useEffect(() => {
        openLoadingPopup();
        async function getImages() {
            let response;
            try {
                response = await fetch(process.env.REACT_APP_BACKEND_URL + "/shared/feed", {
                        method: "GET",
                        headers : {
                            "Authorization" : ("Bearer " + auth.token)
                        },
                    });
                    if (response.ok) {
                        console.log("retrieved sucesfully");
                    } else {
                        console.log("please try again");
                        return;
                    };
            } catch(err) {
                    console.log(err);
                    return;
            };
            await response.json().then(FeedArray => {
                setBusinessFeed(FeedArray);
            });
            closeLoadingPopup();
            return;
        };
        getImages();
    }, []);

    function postIcons(toggle) {
        return <PostIcons 
            togglePopup = {toggle}
        />
    };

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
                    formHeader = "Set Date"
                    eventFormClassName = "feedEventFormPopup"
                />
                )})}
        </div>
    ); 
};


export default Feed;
