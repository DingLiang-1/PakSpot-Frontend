import React, {useState} from "react";
import {useLocation} from "react-router-dom";
import "./SearchPage.css";
import PostModule from "../Shared/PostModule.js";
import Notification from "../Shared/Notification.js";
import PostIcons from "../Feed/PostIcons.js";
import SearchBar from "./SearchBar.js";

function SearchPage() {
    const [loadedData, setLoadedData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [notifPopup, setNotifPopup] = useState(false);
    const [notifMessage, setNotifMessage] = useState("");
    const [manualUpdateSearchbarInput, setManualUpdateSearchbarInput] = useState();
    const location = useLocation();
    const [searched, setSearched] = useState(({...location}.state ? true : false));

    function updateSearchInput(event) {
        setSearched(true);
        setManualUpdateSearchbarInput(event.currentTarget.value);
    };

    function openLoadingPopup() {
        setIsLoading(true);
    };

    function closeLoadingPopup() {
        setIsLoading(false);
    };


    function postIcons(toggleEventForm,openLoadingPopup,closeLoadingPopup,bookmarked,postId) {
        return <PostIcons 
            toggleEventForm = {toggleEventForm}
            openLoadingPopup = {openLoadingPopup}
            closeLoadingPopup = {closeLoadingPopup}
            bookmarked = {bookmarked}
            postId = {postId}
        />
    };
   
    function closeNotifPopup() {
        setNotifPopup(false);
    };

    function openNotifPopup(message) {
        setNotifPopup(true);
        setNotifMessage(message);
    }


    return (
        <div className = "search-page-container">
            {isLoading && <Notification 
                    type = "loading"
                />
            }
            {notifPopup && 
                <Notification 
                    content = {<h4>{notifMessage}</h4>}
                    type = "message"
                    handleNotifPopup = {closeNotifPopup}
                />
            }
            <SearchBar 
                setLoadedData = {setLoadedData}
                openLoadingPopup = {openLoadingPopup}
                closeLoadingPopup = {closeLoadingPopup}
                openNotifPopup = {openNotifPopup}
                manualUpdateSearchbarInput = {manualUpdateSearchbarInput}
                setManualUpdateSearchbarInput = {setManualUpdateSearchbarInput}
                locationState = {{...location}.state}
                updateSearchInput = {updateSearchInput}
                searched = {searched}
                setSearched = {setSearched}
            />
            {searched ? (
                <div className = "filtered-post">
                    {loadedData.length ?
                        loadedData.map((post,index) => {
                            return (
                                <PostModule 
                                    id = {index}
                                    form = {true}
                                    postClassName = "post"
                                    type = "addEvent"
                                    mediaClassName = "media"
                                    location = {post.location}
                                    images = {post.images}
                                    description = {post.description}
                                    address = {post.address}
                                    postIcons = {postIcons}
                                    tags = {post.tags}
                                    formHeader = "Set Date"
                                    eventFormClassName = "feedEventFormPopup"
                                    searchPage = {true}
                                    bookmarked = {post.bookmarked}
                                    postId = {post._id}
                                    updateTagSearch = {updateSearchInput}
                                    tagContainerClass = "post-tag-container"
                                />
                            );
                        }
                    ) : (
                        (<div className = "empty-search-return">
                            <h3>NO POST FOUND</h3>
                        </div>)
                    )}
                </div>
            ) : (
                <div className = "no-search">
                    <h3>START SEARCHING NOW</h3>
                </div>
            )}
        </div>
    )
;};

export default SearchPage;