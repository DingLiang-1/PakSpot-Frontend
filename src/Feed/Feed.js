import React, { useState } from "react";
import Post from "./Post.js";
import "./Feed.css";

const dummyBusinessPost = [
    {
        placeName:"Tanjong Beach Club",
        images:["../Resources/Images/TanjongBeachClub/Image1.jpg","../Resources/Images/TanjongBeachClub/Image2.jpg","../Resources/Images/TanjongBeachClub/Image3.jpg","../Resources/Images/TanjongBeachClub/Image4.jpg"],
        description: "Our surf plays host to a myriad of celebrations and private events. " +
        "Tanjong Beach Club is the most sought-after event venue for good reason—pristine views " +
        "for unforgettable weddings, golden sand for euphoric Sentosa beach parties and intimate " +
        "corporate events that leave lasting impressions. Let your hair down, we'll take care of the rest."
    },
    {
        placeName:"The Fragment Room",
        images:[1,2,3,4],
        description:"The Fragment Room is a rage room where you are encouraged to let down your walls " +
        "and release your inner frustrations. So your boss shouted at you. So your train broke down today. Wouldn't " +
        "it be great to go somewhere and release your rage? Let's smash that anger to fragments."
    },
    {
        placeName:"Arudio Studio",
        images:[1,2,3,4],
        description:"Hand-building is one of the simplest methods for pottery making.  By using zero machinery but only your own hands, hand-built " +
        "pottery are highly customizable and unique. You will learn various basic hand building techniques, such as: Pinching, Coiling, " +
        "Slab making and Hollowing to create your own masterpiece! "
    },
    {
        placeName:"Cozy Place",
        images:[1,2,3,4],
        description:"At CozyPlace, we believe fun and entertainment is more about the company than the activities. " +
        "Enjoy catching up on the latest movies/series in HD in a private cozy room with good company. " +
        "We provide the private and coziest environment for you while you provide the good company."
    }
];
function Feed() {
    return (
        <div className = "feed">
            {dummyBusinessPost.map((post,index) => {
                return (
                <Post 
                    placeName = {post.placeName}
                    images = {post.images}
                    id = {index}
                    description = {post.description}
                />
                )
            })}
        </div>
    ); 
};

export default Feed;
