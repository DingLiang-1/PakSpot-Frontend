import React, {useState, useContext, useRef, useEffect} from "react";
import {useLocation} from "react-router-dom";
import "./SearchPage.css";
import useForm from "../Shared/FormHook.js";
import Input from "../Shared/Input.js";
import PostModule from "../Shared/PostModule.js";
import Notification from "../Shared/Notification.js";
import PostIcons from "../Feed/PostIcons.js";
import { AuthContext } from "../Shared/AuthContext";

function SearchPage() {
    const [searched, setSearched] = useState(false);
    const location = useLocation();
    const [formState, handleOverallValidity] = useForm({
            searchBarInput : {
                value : ({...location}.state ? {...location}.state : ""),
                isValid : false
            }
        }, false);
    const [loadedData, setLoadedData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [notifPopup, setNotifPopup] = useState(false);
    const [notifMessage, setNotifMessage] = useState("");
    const [locationStateDelay, setLocationStateDelay] = useState();
    const auth = useContext(AuthContext);

    function tagSearch() {
        submitQuery();
    };

    if (location.state) {
        setLocationStateDelay({...location}.state);
        location.state = false;
    };
    useEffect(() => {
       tagSearch();
    }, [locationStateDelay]);

    function openLoadingPopup() {
        setIsLoading(true);
    };

    function closeLoadingPopup() {
        setIsLoading(false);
    };

    function postIcons(toggle) {
        return <PostIcons 
            togglePopup = {toggle}
        />
    };


    async function submitQuery(event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        };
        openLoadingPopup();
        let response;
        try {
            response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/shared/filterpost`, {
                method: "POST",
                headers : {
                "Content-Type" : "application/json",
                "Authorization" : ("Bearer " + auth.token),
                },
                body: JSON.stringify({
                    query : formState.inputs.searchBarInput.value,
                })
                });
            if (response.ok) {
                await response.json().then(FeedArray => {
                    setLoadedData(FeedArray);
                });
                setSearched(true);
                closeLoadingPopup();
                return;
            } else {
                await response.json().then(error => {
                    setNotifMessage(error.error);
                });
                setNotifPopup(true);
                closeLoadingPopup();
                return;
            };
        } catch (err) {
            setNotifMessage("An unknow error occurred, please try again!");
            setNotifPopup(true);
            closeLoadingPopup();
            return;
        };
    };

    function closeNotifPopup() {
        setNotifPopup(false);
    };

    return (
        <div className = "search-page-container">
            {isLoading && <Notification 
                    login = {true}
                    type = "loading"
                />
            }
            {notifPopup && 
                <Notification 
                    message = {notifMessage}
                    login = {true}
                    type = "message"
                    handleNotifPopup = {closeNotifPopup}
                />
            }
            <form className = "search-bar-form" onSubmit = {submitQuery}>
                <Input 
                    className = "search-bar-input"
                    id = "searchBarInput"
                    type = "input"
                    inputType = "text"
                    placeholder = "Search" 
                    errorAlert = ""
                    validators = {[
                        ((value) => value.length > 0),
                    ]}
                    onInput = {handleOverallValidity}
                    initialiseValue = {locationStateDelay}
                />
                <div className = "search-bar-submit-div">
                    <button type = "submit" disabled = {!formState.formValid}>SEARCH</button>
                </div>
            </form>  
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
                                />
                            );
                        }
                    ) : (
                        (<div className = "empty-search-return">Sorry there are no post based on your query</div>)
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