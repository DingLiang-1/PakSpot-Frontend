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
        let formData = new FormData();
        for (let i = 0; i < imageFiles.length; i++) {
            formData.append("uploads", imageFiles[i]);
        };
        formData.append("location", formState.inputs.location.value);
        formData.append("description", formState.inputs.description.value);
        formData.append("address", formState.inputs.address.value);
        let response;
            try { response = await fetch(`http://localhost:3000/shared/uploadpersonalpost/users/${auth.userId}`, {
                method: "POST",
                headers : {
                    "Authorization" : ("Bearer " + auth.token)
                },
                body: formData
            });
            if (response.ok) {
                console.log("stored succesfully");
            } else {
                console.log("please try again");
            };
        } catch(err) {
            console.log(err);
        }
        console.log("send to backend");
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
                errorAlert = "Invalid Format"
                validators = {{ 
                    requiredField : ((value) => value.length > 0),
                }}
                onInput = {handleOverallValidity}
            />
            <Input 
                className = "personal-upload-location"
                id = "address"
                label = "Address"
                type = "input"
                inputType = "text"
                placeholder = "Address" 
                errorAlert = "Invalid Format"
                validators = {{ 
                    requiredField : ((value) => value.length > 0),
                }}
                onInput = {handleOverallValidity}
            />
            <Input 
                className = "personal-upload-description"
                id = "description"
                label = "Description"
                type = "textarea"
                inputType = "text"
                placeholder = "Max 50 Characters" 
                errorAlert = "Invalid Format"
                validators = {{ 
                    requiredField : ((value) => value.length > 0),
                }}
                onInput = {handleOverallValidity}
            />
            <div className = "upload-submit-button">
                <button type = "submit" disabled = {!formState.formValid || !imageFiles.length}>Submit</button>
            </div>
        </form>
    );
};

export default Upload;



