import React, {useState, useEffect, useContext} from "react";
import { AuthContext } from "../Shared/AuthContext";
import useForm from "../Shared/FormHook";
import Input from "../Shared/Input.js";
import "./SearchBar.css";

function SearchBar(props) {
    const [autocompleteSuggestion, setAutocompleteSuggestion] = useState([]);
    const [searchbarFocus, setSearchbarFocus] = useState(false);
    const auth = useContext(AuthContext);
    const [autoSearch, triggerAutoSearch] = useState(false);

    const [formState, handleOverallValidity] = useForm({
        searchBarInput : {
            value : (props.locationState ? props.locationState : ""),
            isValid : props.locationState ? true : false
        }
        }, props.locationState ? true : false);
   
    function searchbarOnFocus() {
        setSearchbarFocus(true);
    };

    function searchbarOnBlur() {
        setTimeout(() => setSearchbarFocus(false),100);
    };
    
    async function autocompleteOnInput(id, value,isValid) {
        handleOverallValidity(id, value,isValid);
        let response;
        try {
            response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/shared/autocomplete`, {
                method: "POST",
                headers : {
                "Content-Type" : "application/json",
                "Authorization" : ("Bearer " + auth.token),
                },
                body: JSON.stringify({
                    query : value,
                })
                });
            if (response.ok) {
                await response.json().then(suggestions => {
                    let tagSuggestions = [];
                    let locationSuggestions = [];
                    suggestions.forEach(obj => {
                        locationSuggestions.push(obj.location);
                        obj.tags.filter(tag => (tag.slice(0, (value.length)) === value)).forEach(tag => {!tagSuggestions.includes(tag) && tagSuggestions.push(tag)});
                    });
                    setAutocompleteSuggestion(tagSuggestions.concat(locationSuggestions));
                });
                return;
            } else {
                return;
            };
        } catch (err) {
            return;
        };
    };

    async function submitQuery(event) {
        if (!auth.entity) {
            return;
        };
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        };
        props.openLoadingPopup();
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
                    props.setLoadedData(FeedArray);
                });
                props.setSearched(true);
                props.closeLoadingPopup();
                return;
            } else {
                await response.json().then(error => {
                    props.openNotifPopup(error.error);
                });
                props.closeLoadingPopup();
                return;
            };
        } catch (err) {
            props.openNotifPopup("An unknow error occurred, please try again!");
            props.closeLoadingPopup();
            return;
        };
    };
    useEffect(() => {
        if (props.manualUpdateSearchbarInput) {
            handleOverallValidity("searchBarInput", props.manualUpdateSearchbarInput, true);
            triggerAutoSearch(initial => (!initial));
        };
    }, [props.manualUpdateSearchbarInput]);

    useEffect(() => {
        if (props.searched) {
            submitQuery();
        };
    }, [autoSearch]);

return (
    <React.Fragment>
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
            onInput = {autocompleteOnInput}
            onFocus = {searchbarOnFocus}
            onBlur = {searchbarOnBlur}
            updateValue = {props.manualUpdateSearchbarInput}
            initialiseValue = {props.locationState}
        />
        <div className = "search-bar-submit-div">
            <button type = "submit" disabled = {!formState.formValid}>SEARCH</button>
        </div>
        </form>
        {searchbarFocus && 
        <div className = "autocomplete-suggestions-container">
            {autocompleteSuggestion.map((suggestion,index) => {
                return <button type = "button" className = "autocomplete-suggestion" id = {index} value = {suggestion} onClick = {props.updateSearchInput}><h4>{suggestion}</h4></button>
            })}
        </div>
        }
    </React.Fragment>);
};

export default SearchBar;