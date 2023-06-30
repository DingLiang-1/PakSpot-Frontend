import React , {useRef, useState, useEffect, useContext} from "react";
import "./Upload.css";
import useForm from "../Shared/FormHook.js";
import Input from "../Shared/Input.js";
import { AuthContext } from "../Shared/AuthContext.js";


function Upload(props) {
    const auth = useContext(AuthContext);
    const previewRef = useRef();
    const [imageFiles, updateImageFiles] = useState([]);
    const [sliderIndex, setSliderIndex] = useState(0);
    const [previewURL, setPreviewURL] = useState();
    const [isLoading, setLoading] = useState(false);
    const [formState, handleOverallValidity] = useForm({
        location : {
            value : "",
            isValid : false,
        },
        description : { 
            value : "",
            isValid :false,
        },
        address : {
            value : "",
            isValid : false,
        }
    },false);
    
    async function submitForm(event) {
        event.preventDefault();
        props.openLoadingPopup();
        console.log("pass2");
        let formData = new FormData();
        for (let i = 0; i < imageFiles.length; i++) {
            formData.append("uploads", imageFiles[i]);
        };
        formData.append("location", formState.inputs.location.value);
        formData.append("description", formState.inputs.description.value);
        formData.append("address", formState.inputs.address.value);
        let response;
        try { response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/shared/uploadpersonalpost/users/${auth.userId}`, {
            method: "POST",
            headers : {
                "Authorization" : ("Bearer " + auth.token)
            },
            body: formData
        });
        if (response.ok) {
            props.closeLoadingPopup();
            props.openNotifPopup("Post uploaded successfully, view your post in your personal uploads.")
            console.log("stored sucesfully");
            return;
        } else {
            props.closeLoadingPopup();
            response.json().then(resObj => {props.openNotifPopup(resObj.error);});
            return;
        };
        } catch(err) {
            console.log(err);
            return;
        };
    }; 

    function accessImageInput() {
        previewRef.current.click();
    };

    function addFileList(event) {
        console.log("processed");
        let latestFilesList = event.target.files;
        let latestFilesLength = latestFilesList.length;
        if (latestFilesList) {
            if (imageFiles.length) {
            setSliderIndex(initial => ((imageFiles.length + latestFilesLength) - 1));
            updateImageFiles(initial => (initial.concat(Array.from(latestFilesList))));
            } else {
                setSliderIndex(initial => (latestFilesLength- 1));
                updateImageFiles(initial => (Array.from(latestFilesList)));
            };
        } else {
            return;
        };
    };

    function slideImageLeft() {
        setSliderIndex(initial => (initial === 0 ? initial : initial - 1));
    };

    function slideImageRight() {
        setSliderIndex(initial => (initial === (imageFiles.length - 1) ? initial : initial + 1));
    };

    function removeImage() {
        if (imageFiles.length) {
            updateImageFiles(initial => {
                let deepcopy = [...initial];
                deepcopy.splice(sliderIndex,1);
                console.log("removed");
                return deepcopy;
            });
            setSliderIndex(initial => ((initial - 1 < 0) ? 0 : initial - 1));
        } else {
            return;
        }
    };

    useEffect(() => {
        if (imageFiles.length) {
            const fileReader = new FileReader();
            fileReader.onload = () => {
                setPreviewURL(fileReader.result);
            };
            fileReader.readAsDataURL(imageFiles[sliderIndex]);
            console.log("loaded");
        } else {
            return;
        };
    }, [imageFiles ,sliderIndex])

    return (
        <form className = "personal-upload" onSubmit = {submitForm}>

            <div className = "image-selector">
                {imageFiles.length ?  (
                    <React.Fragment>
                        <i className = "fa-solid fa-chevron-left fa-1x" onClick = {slideImageLeft}></i>
                        <img src = {previewURL}></img>
                        <i className = "fa-solid fa-chevron-left fa-rotate-180 fa-1x" onClick = {slideImageRight}></i>
                    </React.Fragment>) :
                    <img src = {require("../Resources/Icons/NoImage.png")} />
                }
            </div>
            <div className = "image-selector-button">
                <button type = "button" id = "upload-add-button" onClick = {accessImageInput}>ADD</button>
                <button type = "button" id = "upload-remove-button" onClick = {removeImage} disabled = {!imageFiles.length}>REMOVE</button>
            </div>
            <input
                ref = {previewRef}
                className = "personal-upload-images hide-input"
                id = "images"
                type = "file"
                accept = ".png,.jpeg,.jpg"
                onInput={addFileList}
                multiple 
                value = ""
            >
            </input>
            <Input 
                className = "personal-upload-location"
                id = "location"
                label = "Location"
                type = "input"
                inputType = "text"
                placeholder = "Location" 
                errorAlert = "Please enter a valid location"
                validators = {[
                  ((value) => value.length > 0)
                ]}
                onInput = {handleOverallValidity}
            />
            <Input 
                className = "personal-upload-location"
                id = "address"
                label = "Address"
                type = "input"
                inputType = "text"
                placeholder = "Address" 
                errorAlert = "Please enter a valid address"
                validators = {[
                    ((value) => value.length > 0)
                ]}
                onInput = {handleOverallValidity}
            />
            <Input 
                className = "personal-upload-description"
                id = "description"
                label = "Description"
                type = "textarea"
                inputType = "text"
                placeholder = "Description" 
                errorAlert = "Required field"
                validators = {[ 
                    ((value) => value.length > 0)
                ]}
                onInput = {handleOverallValidity}
            />
            <div className = "upload-submit-button">
                <button type = "submit" disabled = {!formState.formValid || !imageFiles.length}>Submit</button>
            </div>
        </form>
    );
};

export default Upload;



