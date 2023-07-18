import React, {useState} from "react";
import "./PostPopup.css";
import "./MediaPopup.css";
import PostModule from "../Shared/PostModule.js";
import PersonalPostPopupIcons from "./PersonalPostPopupIcons.js";
import EditPost from "./EditPost.js";

function PostPopup(props) {
    let currentImageKeyAndLinks = [];

    function postIcons(toggle) {
        return (<PersonalPostPopupIcons
            toggleEditPostPopup = {props.toggleEditPostPopup}
        />);
    };

    for (let i = 0; i < props.post.imageLinks.length; i++) {
        currentImageKeyAndLinks.push({link : props.post.imageLinks[i], key : props.post.images[i]});
    };

    return (
        props.editPostState ? (
            <EditPost
                closeLoadingPopup = {props.closeLoadingPopup}
                openLoadingPopup = {props.openLoadingPopup}
                openNotifPopup = {props.openNotifPopup}
                location = {props.post.location}
                address = {props.post.address}
                description = {props.post.description}
                id = {props.post._id}
                currentImageKeyAndLinks = {currentImageKeyAndLinks}
                closeEditPostPopup = {props.closeEditPostPopup}
                refreshPage = {props.refreshPage}
                setToGrid = {props.setToGrid}
            />) :
        (<PostModule 
            form = {false}
            postClassName = "post-popup"
            mediaClassName = "media-popup"
            location = {props.post.location}
            images = {props.post.imageLinks}
            description = {props.post.description}
            address = {props.post.address}
            postIcons = {postIcons}
        />)
    );
};

export default PostPopup;