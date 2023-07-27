import React, {useContext, useReducer, useState, useEffect, useRef} from "react";
import "./ProfileHeader.css";
import { AuthContext } from "../Shared/AuthContext";
import {Link} from "react-router-dom";
import Input from "../Shared/Input.js";
import useForm from "../Shared/FormHook.js";


function profileInfoReducer(state, action) {
    return action;
};

function ProfileHeader(props) {
    const auth = useContext(AuthContext);
    const [profileInfo, dispatchProfileInfo] = useReducer(profileInfoReducer, {profilePicLink:'' , username :''});
    const [refreshProfile, setRefreshProfile] = useState(false);
    const [dropdownState, setDropdownState] = useState(false);
    const [editProfileState, setEditProfileState] = useState(false);
    const previewRef = useRef();
    const [imageFile, updateImageFile] = useState();
    const [imagePreviewUrl, setImagePreviewUrl] = useState();
    const [formState, handleOverallValidity] = useForm({    
        editProfileUsername : {
            value : profileInfo.username,
            isValid : true,
        }
    },true);

    function toggleDropdown() {
        setDropdownState(initial => (!initial));
    };
    
    function openEditProfile() {
        setEditProfileState(true);
    };

    function closeEditProfile() {
        setEditProfileState(false);
        updateImageFile(undefined);
        setDropdownState(false);
        setImagePreviewUrl(profileInfo.profilePicLink);
    };

    function refreshPage() {
        setRefreshProfile(initial => (!initial));
    };

    async function getProfileInfo() {
        if (!auth.userId) {
            return;
        };
        let response;
        props.openLoadingPopup();
        try { 
            response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/shared/getprofileinfo/${auth.entity}/${auth.userId}`, {
                method: "GET",
                headers : {
                    "Authorization" : ("Bearer " + auth.token)
                }
            });
            if (response.ok) {
                props.closeLoadingPopup();
                response.json().then(info => {dispatchProfileInfo(info);setImagePreviewUrl(info.profilePicLink);});
                return;
            } else {
                response.json().then(error => {props.openNotifPopup(error.error);});
                return;
            };
        } catch(err) {
            props.openNotifPopup("An error occured, please refresh the page");
            return;
        }
    };
    useEffect(() => {getProfileInfo();}, [refreshProfile,auth]);

    function addImage(event) {
        updateImageFile(event.target.files[0]);
        console.log(event.target.files[0]);
        const fileReader = new FileReader();
        fileReader.onload = () => {
            setImagePreviewUrl(fileReader.result);
        };
        fileReader.readAsDataURL(event.target.files[0]);
    };

    async function submitEditProfileForm(event) {
        event.preventDefault();
        event.stopPropagation();
        props.openLoadingPopup();
        try { 
            let formData = new FormData();
            formData.append("newProfPic", imageFile);
            formData.append("username", formState.inputs.editProfileUsername.value);
            let response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/shared/editprofileinfo/${auth.entity}/${auth.userId}`, {
                method: "POST",
                headers : {
                    "Authorization" : ("Bearer " + auth.token)
                },
                body : formData
            });
            if (response.ok) {
                closeEditProfile();
                props.closeLoadingPopup();
                refreshPage();
                response.json().then(res => {props.openNotifPopup(res.message);});
                return;
            } else {
                props.closeLoadingPopup();
                response.json().then(error => {props.openNotifPopup(error.error);});
                return;
            };
        } catch(err) {
            props.closeLoadingPopup();
            props.openNotifPopup("An error occured, please try the again");
            return;
        }
    };

    function accessImageInput() {
        previewRef.current.click();
    };

    return (<div className = "profile-header">
        {editProfileState ? 
            <React.Fragment>
                <i className="fa-solid fa-xmark fa-2x edit-profile-form-cross" onClick = {closeEditProfile}></i>
                <form className = "edit-profile-form" onSubmit = {submitEditProfileForm} >
                    <input
                        ref = {previewRef}
                        className = "edit-profile-info-preview hide-input"
                        id = "images"
                        type = "file"
                        accept = ".png,.jpeg,.jpg"
                        onInput = {addImage}
                        value = ""
                    >
                    </input>
                    <img className = "profile-pic" src = {imagePreviewUrl} onClick = {accessImageInput}/>
                    <Input 
                        className = "edit-profile-username"
                        id = "editProfileUsername"
                        label = "Username"
                        type = "input"
                        inputType = "text"
                        placeholder = "Username" 
                        errorAlert = "Please enter a username"
                        validators = {[
                        ((value) => value.length > 0)
                        ]}
                        onInput = {handleOverallValidity}
                        initialiseValue = {profileInfo.username}
                    />
                    <div className = "edit-profile-submit-button">
                        <button type = "submit" disabled = {!formState.formValid}>Edit</button>
                    </div>
                </form>
            </React.Fragment>
        :(
        <React.Fragment>
            <div className = {"profile-dropdown-container" + (dropdownState ? " profile-dropdown-true" : "")}>
                <div className = "profile-dropdown-icon" onClick = {toggleDropdown}><i className= "fa-solid fa-ellipsis-vertical fa-2x"></i></div>
                {dropdownState &&
                <React.Fragment>
                    <Link to = "/" style={{ textDecoration: 'none' }}>
                        <div className = "edit-profile-button" onClick = {auth.logout} >Logout</div>
                    </Link>
                    <div className = "edit-profile-button" onClick = {openEditProfile}>Edit Profile</div>
                </React.Fragment>}
            </div>
            <div className = "profile-info">
                <img className = "profile-pic" src = {profileInfo.profilePicLink}/>
                <h3>{profileInfo.username}</h3>
            </div>
        </React.Fragment>)}
        <hr className = "profile-info-hr"/>
    </div>);
};

export default ProfileHeader;