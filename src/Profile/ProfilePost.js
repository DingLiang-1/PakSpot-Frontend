import React, {useState} from "react";
import "./ProfilePost.css";
import PersonalPost from "./PersonalPost.js";
import BookmarkPost from "./BookmarkPost.js";
import Upload from "./Upload.js";

function ProfilePost(props) {
    const [postType, setPostType] = useState("PERSONAL"); 
    function setPersonalType() {
        setPostType("PERSONAL");
        console.log("PERSONAL");
    };
    function setBookmarkType() {
        setPostType("BOOKMARKED");
        console.log("BOOKMARKED");
    };
    function setUploadType() {
        setPostType("UPLOAD");
        console.log("UPLOAD");
    };

    return (
        <div className = "profile-post">
            <div className = "profile-post-buttons">
                <i className= "fal fa-image fa-2x" onClick = {setPersonalType}></i>
                <i className = "fa-solid fa-bookmark fa-2x" onClick = {setBookmarkType}></i>
                <i className="fa-regular fa-square-plus fa-2x" onClick = {setUploadType}></i>
            </div>
            {postType === "PERSONAL" && <PersonalPost 
                closeLoadingPopup = {props.closeLoadingPopup}
                openLoadingPopup = {props.openLoadingPopup}
                openNotifPopup = {props.openNotifPopup}
                openDeleteNotifPopup = {props.openDeleteNotifPopup}
                closeDeleteNotifPopup = {props.closeDeleteNotifPopup}
            />}
            {postType === "BOOKMARKED" && <BookmarkPost 
                closeLoadingPopup = {props.closeLoadingPopup}
                openLoadingPopup = {props.openLoadingPopup}
                openNotifPopup = {props.openNotifPopup}
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
