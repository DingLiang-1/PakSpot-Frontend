import React, {useState, useContext} from "react";
import "./PostPopup.css";
import PostModule from "../Shared/PostModule.js";
import PersonalUploadIcons from "./PersonalUploadIcons.js";
import EditPost from "./EditPost.js";
import { AuthContext } from "../Shared/AuthContext.js";
import PostIcons from "../Feed/PostIcons.js";

function PostPopup(props) {
    let currentImageKeyAndLinks = [];
    const auth = useContext(AuthContext);

    function openDeleteNotifPopup() {
        async function deleteEventReq() {
            let response;
            props.closeDeleteNotifPopup();
            props.openLoadingPopup();
            try { response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/shared/deletepersonalpost/${auth.entity}/${auth.userId}`, {
                method: "POST",
                headers : {
                "Content-Type" : "application/json",
                "Authorization" : "Bearer " + (auth.token),
                },
                body: JSON.stringify({
                    postId : props.post._id
                })
                });
                if (response.ok) {
                    props.closeLoadingPopup();
                    props.setToGrid();
                    props.refreshPage();
                    await response.json().then(data => {props.openNotifPopup(data.message);});
                    return;
                } else {
                    props.closeLoadingPopup();
                    await response.json().then(error => {props.openNotifPopup(error.error);});
                    return;
                };
            } catch(err) {
                console.log("An error occurred, please try again");
            };
        };
        props.openDeleteNotifPopup({message : "Please confirm delete!", handleDelete : deleteEventReq});
    };


    function postIconsPersonal(toggleEventForm,openLoadingPopup,closeLoadingPopup,bookmarked,postId) {
        return (<PersonalUploadIcons
            toggleEditPostPopup = {props.toggleEditPostPopup}
            openDeleteNotifPopup = {openDeleteNotifPopup}
        />);
    };

    //function to add variables and functions from PostModule into PostIcons going inside the PostModule
    function postIconsBookmark(toggleEventForm,openLoadingPopup,closeLoadingPopup,bookmarked,postId) {
        return <PostIcons 
            toggleEventForm = {toggleEventForm}
            openLoadingPopup = {openLoadingPopup}
            closeLoadingPopup = {closeLoadingPopup}
            bookmarked = {bookmarked}
            postId = {postId}
        />
    };

    for (let i = 0; i < props.post.imageLinks.length; i++) {
        currentImageKeyAndLinks.push({link : props.post.imageLinks[i], key : props.post.images[i]});
    };

    function toStringTags(tags) {
        let stringTag = "";
        for (let i = 0; i < tags.length; i++) {
            stringTag += ("#" + tags[i] + " ");
        }
        return stringTag;
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
                stringTag = {toStringTags(props.post.tags)}
                id = {props.post._id}
                currentImageKeyAndLinks = {currentImageKeyAndLinks}
                closeEditPostPopup = {props.closeEditPostPopup}
                refreshPage = {props.refreshPage}
                setToGrid = {props.setToGrid}
            />) :
        (<PostModule 
            form = {props.bookmarkState}
            postClassName = "post"
            mediaClassName = "media"
            formHeader = "Set Date"
            eventFormClassName = "feedEventFormPopupBookmark"
            location = {props.post.location}
            images = {props.post.imageLinks}
            description = {props.post.description}
            address = {props.post.address}
            postIcons = {props.bookmarkState ? postIconsBookmark : postIconsPersonal}
            tags = {props.post.tags}
            bookmarked = {props.post.bookmarked}
            postId = {props.post._id}
            tagContainerClass = "post-tag-container"
            searchPage = {true}
        />)
    )
};

export default PostPopup;