import React, {useState} from "react";
import "./PersonalPost.css";
import PostPopup from "./PostPopup.js";

function PersonalPost(props) {
    const [gridFormat, setGridFormat] = useState(true);
    const [postID, setPostID] = useState();
    let personalPost = [1]; /*props.personalPost*/
    let firstImagePost = [1];

    function postPopup(event) {
        setGridFormat(false);
        setPostID(event.target.id);
    };

    function setToGrid() {
        setGridFormat(true);
    };

    if (personalPost) {
        return (
            (gridFormat ? (
                <div className = "post-grid">
                    <div className = "post-grid-image" onClick = {postPopup}>
                        <img id ="uid123" src = {require("../Resources/Images/TanjongBeachClub/Image3.jpg")} />
                    </div>
                    <div className = "post-grid-image"  onClick = {postPopup}>
                        <img src = {require("../Resources/Images/TanjongBeachClub/Image4.jpg")} />
                    </div>
                    <div className = "post-grid-image" onClick = {postPopup}>
                        <img src = {require("../Resources/Images/TanjongBeachClub/Image3.jpg")} />
                    </div>
                    <div className = "post-grid-image" onClick = {postPopup}>
                        <img src = {require("../Resources/Images/TanjongBeachClub/Image4.jpg")} />
                    </div>
                </div>) :
               (<div className = "expand-post">
                    <div className = "back-to-grid">
                        <i className="fa-solid fa-arrow-left fa-2x" onClick = {setToGrid}></i>
                    </div>
                    <PostPopup
                        placeName = "Tanjong beach club"
                        images = {[1,2,3]}
                        description = "test"
                    />
                </div>) 


            /*(<React.Fragment>
            <div className = "back-to-grid">
                <i className="fa-solid fa-arrow-left fa-2x" onClick = {setToGrid}></i>
            </div>
            <div className = "post-scroll">
                    <div className = "post-scroll-image" >
                        <img src = {require("../Resources/Images/TanjongBeachClub/Image3.jpg")} />
                    </div>
                    <div className = "post-scroll-image" >
                        <img src = {require("../Resources/Images/TanjongBeachClub/Image4.jpg")} />
                    </div>
                    <div className = "post-scroll-image" >
                        <img src = {require("../Resources/Images/TanjongBeachClub/Image3.jpg")} />
                    </div>
                    <div className = "post-scroll-image" >
                        <img src = {require("../Resources/Images/TanjongBeachClub/Image4.jpg")} />
                    </div>
            </div>
            </React.Fragment>)*/));
    } else {
        return (<h2>NO POST YET</h2>);
    };
};

export default PersonalPost;

/*firstImagePost.map((image,index) => {
                    <div className = "post-grid-image" key = {index} onClick = {setToScroll}>
                        <img src = {image} />
                    </div>
                })*/

                /*personalPost.map((image,index) => {
                    <div className = "post-scroll-image" key = {index}>
                        <img src = {image} />
                    </div>
                })*/

