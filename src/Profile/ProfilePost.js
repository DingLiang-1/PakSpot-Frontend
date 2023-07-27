import React, {useState} from "react";
import "./ProfilePost.css";
import PersonalUpload from "./PersonalUpload.js";
import Upload from "./Upload.js";

function ProfilePost(props) {
    const [postType, setPostType] = useState("PERSONAL"); 
    const [bookmarkState, setBookmarkState] = useState(false);

    function setPersonalType() {
        if (postType !== "PERSONAL") {
            setPostType("PERSONAL");
        };
        setBookmarkState(false);
    };
   
   function setBookmarkType() {
        if (postType !== "PERSONAL") {
            setPostType("PERSONAL");
        };
        setBookmarkState(true);
    };

    function setUploadType() {
        setPostType("UPLOAD");
    };

    return (
        <div className = "profile-post">
            <div className = "profile-post-buttons">
                <i className= "far fa-image fa-2x" onClick = {setPersonalType}></i>
                <i className = "fa-solid fa-bookmark fa-2x" onClick = {setBookmarkType}></i>
                <i className="fa-regular fa-square-plus fa-2x" onClick = {setUploadType}></i>
            </div>
            {postType === "PERSONAL" && <PersonalUpload 
                closeLoadingPopup = {props.closeLoadingPopup}
                openLoadingPopup = {props.openLoadingPopup}
                openNotifPopup = {props.openNotifPopup}
                openDeleteNotifPopup = {props.openDeleteNotifPopup}
                closeDeleteNotifPopup = {props.closeDeleteNotifPopup}
                bookmarkState = {bookmarkState}
            />}
            
            {postType === "UPLOAD" && <Upload 
                closeLoadingPopup = {props.closeLoadingPopup}
                openLoadingPopup = {props.openLoadingPopup}
                openNotifPopup = {props.openNotifPopup}
            />}
        </div>
    );
}
export default ProfilePost;
