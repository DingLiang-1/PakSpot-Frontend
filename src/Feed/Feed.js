import React, { useState, useEffect, useContext } from "react";
import Post from "./Post.js";
import "./Feed.css";
import { AuthContext } from "../Shared/AuthContext.js";


function Feed() {
    const [businessFeed, setBusinessFeed] = useState([]);
    const auth = useContext(AuthContext);
    useEffect(() => {
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
                    };
            } catch(err) {
                    console.log(err);
            };
            await response.json().then(FeedArray => {
                setBusinessFeed(FeedArray);
            });
        };
        getImages();
    }, []);
    return (
        <div className = "feed">
            {businessFeed.map((post,index) => {
                return (
                <Post 
                    location = {post.location}
                    images = {post.images}
                    id = {index}
                    description = {post.description}
                />
                )})}
        </div>
    ); 
};


export default Feed;
