import React, {useState, useContext, useEffect} from "react";
import "./PersonalUpload.css";
import PostPopup from "./PostPopup.js";
import { AuthContext } from "../Shared/AuthContext";


function PersonalUpload(props) {
    const [gridFormatPersonal, setGridFormatPersonal] = useState(true);
    const [gridFormatBookmark, setGridFormatBookmark] = useState(true);
    const [personalPost, setPersonalPost] = useState([]);
    const [bookmarkedPost, setBookmarkedPost] = useState([]);
    const [firstImagesPersonal, setFirstImagesPersonal] = useState([]);
    const [firstImagesBookmark, setFirstImagesBookmark] = useState([]);
    const [popupImageIndexPersonal, setPopupImageIndexPersonal] = useState(0);
    const [popupImageIndexBookmark, setPopupImageIndexBookmark] = useState(0);
    const [editPostState, setEditPostState] = useState(false);
    const [refreshPersonalPostPageState, toggleRefreshPersonalPostPageState] = useState(false);
    const [refreshBookmarkPostPageState, toggleRefreshBookmarkPostPageState] = useState(false);
    const auth = useContext(AuthContext);

    async function getImages(route) {
        let response;
        try {
            console.log("runned");
            response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/shared/${route}/${auth.entity}/${auth.userId}`, {
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
            if (route === "personalpost") {
                setPersonalPost(reversedPostArray);
                setFirstImagesPersonal(reversedPostArray.map(post => {
                    let imageUrls = post.imageLinks;
                    return (imageUrls.length ? imageUrls[0] : null);
                }));
            } else {
                setBookmarkedPost(reversedPostArray);
                setFirstImagesBookmark(reversedPostArray.map(post => {
                    let imageUrls = post.imageLinks;
                    return (imageUrls.length ? imageUrls[0] : null);
                }));
            }
            props.closeLoadingPopup();
            return;
        });
    };

    function refreshPersonalPostPage() {
        toggleRefreshPersonalPostPageState(initial => !initial);
    };

    useEffect(() => {
        props.openLoadingPopup();
        getImages("personalpost");
    }, [refreshPersonalPostPageState]);

    function postPopupPersonal(event) {
        setGridFormatPersonal(false);
        setPopupImageIndexPersonal(parseInt(event.currentTarget.id.slice(-1)));
    };

    function setToGridPersonal() {
        setGridFormatPersonal(true);
    };

    function closeEditPostPopup() {
        setEditPostState(false);
    };

    function toggleEditPostPopup() {
        setEditPostState(initial => !initial);
    };


    function refreshBookmarkPostPage() {
        toggleRefreshBookmarkPostPageState(initial => !initial);
    };

    useEffect(() => {
        props.openLoadingPopup();
        getImages("bookmarkpost");
    }, [refreshBookmarkPostPageState]);

    function postPopupBookmark(event) {
        setGridFormatBookmark(false);
        setPopupImageIndexBookmark(parseInt(event.currentTarget.id.slice(-1)));
    };

    function setToGridBookmark() {
        setGridFormatBookmark(true);
        refreshBookmarkPostPage();
    };

    useEffect(() => {
        if (props.bookmarkState) {
            setEditPostState(false);
            setToGridPersonal();
        } else {
            setToGridBookmark();
        }
    },[props.bookmarkState]);

    if (props.bookmarkState ? bookmarkedPost : personalPost) {
        return (
            ((props.bookmarkState ? gridFormatBookmark : gridFormatPersonal) ? (
                <div className = "post-grid">
                    {(props.bookmarkState ? firstImagesBookmark : firstImagesPersonal).map( (image,index) => (
                        <div key = {index} id = {"personal-post-id-" + index} className = "post-grid-image" onClick = {(props.bookmarkState ? postPopupBookmark : postPopupPersonal)}>
                            <img src = {image} />
                        </div>))}
                </div> ):
               (<div className = "expand-post">
                    <div className = "back-to-grid">
                        <i className="fa-solid fa-arrow-left fa-2x" onClick = {editPostState ? closeEditPostPopup : (props.bookmarkState ? setToGridBookmark : setToGridPersonal)}></i>
                    </div>
                    <PostPopup
                        post = {(props.bookmarkState ? bookmarkedPost[popupImageIndexBookmark] : personalPost[popupImageIndexPersonal])}
                        closeLoadingPopup = {props.closeLoadingPopup}
                        openLoadingPopup = {props.openLoadingPopup}
                        openNotifPopup = {props.openNotifPopup}
                        toggleEditPostPopup = {toggleEditPostPopup}
                        closeEditPostPopup = {closeEditPostPopup}
                        editPostState = {editPostState}
                        refreshPage = {(props.bookmarkState ? refreshBookmarkPostPage : refreshPersonalPostPage)}
                        setToGrid = {(props.bookmarkState ? setToGridBookmark : setToGridPersonal)}
                        openDeleteNotifPopup = {props.openDeleteNotifPopup}
                        closeDeleteNotifPopup = {props.closeDeleteNotifPopup}
                        bookmarkState = {props.bookmarkState}
                        searchPage = {true}
                    />
                </div>) 
            ));
    } else {
        return (<h2>NO POST YET</h2>);
    };
};

export default PersonalUpload;


