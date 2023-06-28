import React, {useState, useContext, useEffect} from "react";
import "./PersonalPost.css";
import PostPopup from "./PostPopup.js";
import { AuthContext } from "../Shared/AuthContext";

function PersonalPost(props) {
    const [gridFormat, setGridFormat] = useState(true);
    const [personalPost, setPersonalPost] = useState([]);
    const [firstImages, setFirstImages] = useState([]);
    const [popupImageIndex, setPopupImageIndex] = useState(0);
    const auth = useContext(AuthContext);
    useEffect(() => {
        async function getImages() {
            let response;
            try {
                response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/shared/personalpost/users/${auth.userId}`, {
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
            await response.json().then(postArray => {
                let reversedPostArray = postArray.reverse();
                setPersonalPost(reversedPostArray);
                setFirstImages(reversedPostArray.map(post => {
                    let imageUrls = post.images;
                    return (imageUrls.length ? imageUrls[0] : null);
                }));
        });
        };
        getImages();
    }, []);

    function postPopup(event) {
        setGridFormat(false);
        setPopupImageIndex(parseInt(event.currentTarget.id.slice(-1)));
    };

    function setToGrid() {
        setGridFormat(true);
    };

    if (personalPost.length) {
        return (
            (gridFormat ? (
                <div className = "post-grid">
                    {firstImages.map( (image,index) => (
                        <div key = {index} id = {"personal-post-id-" + index} className = "post-grid-image" onClick = {postPopup}>
                            <img src = {image} />
                        </div>))}
                </div> ):
               (<div className = "expand-post">
                    <div className = "back-to-grid">
                        <i className="fa-solid fa-arrow-left fa-2x" onClick = {setToGrid}></i>
                    </div>
                    <PostPopup
                        post = {personalPost[popupImageIndex]}
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

