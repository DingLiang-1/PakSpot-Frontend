import React , {useRef, useState, useEffect, useContext} from "react";
import "./Upload.css";
import useForm from "../Shared/FormHook.js";
import Input from "../Shared/Input.js";
import { AuthContext } from "../Shared/AuthContext.js";


function EditPost(props) {
    const auth = useContext(AuthContext);
    const previewRef = useRef();
    const [imageFiles, updateImageFiles] = useState([]);
    const [sliderIndex, setSliderIndex] = useState(0);
    const [previewURL, setPreviewURL] = useState();
    const [currentImageKeyAndLinks, editCurrentImageKeyAndLinks] = useState(props.currentImageKeyAndLinks);
    const [formState, handleOverallValidity] = useForm({
        location : {
            value : props.location,
            isValid : true,
        },
        description : { 
            value : props.description,
            isValid :true,
        },
        address : {
            value : props.address,
            isValid : true,
        },
        stringTag : {
            value : props.stringTag,
            isValid : true,
        }
    },false);
    
    async function submitForm(event) {
        event.preventDefault();
        props.openLoadingPopup();
        let formData = new FormData();
        imageFiles.forEach(file => {
            formData.append("uploads", file);
        });
        currentImageKeyAndLinks.forEach(imageAndKeys => {formData.append("remainingImageKeys", imageAndKeys.key);});
        formData.append("location", formState.inputs.location.value);
        formData.append("description", formState.inputs.description.value);
        formData.append("address", formState.inputs.address.value);
        formData.append("id", props.id);
        formData.append("stringTag", formState.inputs.stringTag.value )
        let response;
        try { response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/shared/editpersonalpost/${auth.entity}/${auth.userId}`, {
            method: "POST",
            headers : {
                "Authorization" : ("Bearer " + auth.token)
            },
            body: formData
        });
        if (response.ok) {
            props.closeLoadingPopup();
            props.closeEditPostPopup();
            props.setToGrid();
            props.refreshPage();
            await response.json().then(res => {props.openNotifPopup(res.message);});
            return;
        } else {
            props.closeLoadingPopup();
            await response.json().then(res => {props.openNotifPopup(res.error);});
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
        let latestFilesList = event.target.files;
        let latestFilesLength = latestFilesList.length;
        if (latestFilesLength) {
            setSliderIndex(initial => ((currentImageKeyAndLinks.length + imageFiles.length + latestFilesLength) - 1));
            if (imageFiles.length) {
                updateImageFiles(initial => (initial.concat(Array.from(latestFilesList))));
            } else {
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
        setSliderIndex(initial => (initial === (currentImageKeyAndLinks.length + imageFiles.length - 1) ? initial : initial + 1));
    };

    function removeImage() {
        if (imageFiles.length + currentImageKeyAndLinks.length) {
            if (sliderIndex > (currentImageKeyAndLinks.length - 1)) {
                let trueIndex = sliderIndex - currentImageKeyAndLinks.length;
                updateImageFiles(initial => {
                    let deepcopy = [...initial];
                    deepcopy.splice(trueIndex,1);
                    return deepcopy;
                });
            } else {
                editCurrentImageKeyAndLinks(initial => {
                    let deepCopy = [...initial];
                    deepCopy.splice(sliderIndex,1);
                    return deepCopy;
                });
            };
            setSliderIndex(initial => ((initial - 1 < 0) ? 0 : initial - 1));
            return;
        } else {
            return;
        }
    };

    useEffect(() => {
        if (imageFiles.length + currentImageKeyAndLinks.length) {
            if (sliderIndex > (currentImageKeyAndLinks.length - 1)) {
                let trueIndex = sliderIndex - currentImageKeyAndLinks.length;
                const fileReader = new FileReader();
                fileReader.onload = () => {
                    setPreviewURL(fileReader.result);
                };
                fileReader.readAsDataURL(imageFiles[trueIndex]);
            } else {
                setPreviewURL(currentImageKeyAndLinks[sliderIndex].link);
            };
        } else {
            return;
        };
    }, [imageFiles ,sliderIndex, currentImageKeyAndLinks])

    return (
        <form className = "personal-upload" onSubmit = {submitForm}>

            <div className = "image-selector">
                {imageFiles.length + currentImageKeyAndLinks.length ?  (
                    <React.Fragment>
                        <i className = "fa-solid fa-chevron-left fa-1x" onClick = {slideImageLeft}></i>
                        <img src = {previewURL} />
                        <i className = "fa-solid fa-chevron-left fa-rotate-180 fa-1x" onClick = {slideImageRight}></i>
                    </React.Fragment>) :
                    <img src = {require("../Resources/Icons/NoImage.png")} />
                }
            </div>
            <div className = "image-selector-button">
                <button type = "button" id = "upload-add-button" onClick = {accessImageInput}>ADD</button>
                <button type = "button" id = "upload-remove-button" onClick = {removeImage} disabled = {!(imageFiles.length + currentImageKeyAndLinks.length)}>REMOVE</button>
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
                initialiseValue = {props.location}
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
                initialiseValue = {props.address}
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
                initialiseValue = {props.description}
            />

            <Input 
                className = "personal-upload-description"
                id = "stringTag"
                label = "Tags"
                type = "textarea"
                inputType = "text"
                placeholder = "e.g. #dinner #east #dinner" 
                errorAlert = "Required field"
                validators = {[ 
                ]}
                onInput = {handleOverallValidity}
                initialiseValue = {props.stringTag}
            />
            <div className = "upload-submit-button">
                <button type = "submit" disabled = {!formState.formValid || !(imageFiles.length + currentImageKeyAndLinks.length)}>Submit</button>
            </div>
        </form>
    );
};

export default EditPost;