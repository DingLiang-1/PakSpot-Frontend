import React, { useState, useEffect, useContext } from "react";
import Post from "./Post.js";
import "./Feed.css";
import { AuthContext } from "../Shared/AuthContext.js";
import Notification from "../Shared/Notification.js";

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
    console.log(process.env.REACT_APP_BACKEND_URL + "/shared/feed");
    return (
        <div className = "feed">
            {isLoading && <Notification 
                    login = {true}
                    type = "loading"
                />}
            {businessFeed.map((post,index) => {
                return (
                <Post 
                    location = {post.location}
                    images = {post.images}
                    id = {index}
                    description = {post.description}
                    address = {post.address}
                />
                )})}
        </div>
    ); 
};


export default Feed;
