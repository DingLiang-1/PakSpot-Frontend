import React , {useState, useCallback, useContext, useEffect} from "react";
import "./Authenticate.css";
import Input from "../Shared/Input.js";
import useForm from "../Shared/FormHook.js";
import {AuthContext} from "../Shared/AuthContext.js";
import {redirect} from "react-router-dom";
import Notification from "../Shared/Notification.js";


function Authenticate() {
    const auth = useContext(AuthContext);
    const [hasAccount, updateAccountStatus] = useState(true);
    const [formState, handleOverallValidity, removeInputs] = useForm({email : {value: "", isValid:false}, password : {value: "", isValid:false}},false);
    const [notifPopup, setNotifPopup] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [notifMessage, setNotifMessage] = useState("");
    const [password, cachePassword] = useState("");
    const [entity, setEntity] = useState("users");

    function closeNotifPopup(event) {
        setNotifPopup(false);
    };
    function openNotifPopup(message) {
        setNotifPopup(true);
        setNotifMessage(message);
        
    };
    function openLoadingPopup(event) {
        setIsLoading(true);
    };
    function closeLoadingPopup(event) {
        setIsLoading(false);
    };
    
    function handleAccountStatus(event) {
        updateAccountStatus(initial => !initial);
    };

    function setEntityToUsers() {
        setEntity(initial => ("users"));
    };

    function setEntityToBusinesses() {
        setEntity(initial => ("businesses"));
    };

    async function handleSubmit(event) {
        event.preventDefault();
        openLoadingPopup();
        let response;
        if (hasAccount) {
            try { response = await fetch((process.env.REACT_APP_BACKEND_URL + `/shared/auth/${entity}/login`), {
                method: "POST",
                headers : {
                "Content-Type" : "application/json"
                },
                body: JSON.stringify({
                    email : formState.inputs.email.value,
                    password : formState.inputs.password.value
                })
            });
            if (response.ok) {
                closeLoadingPopup();
                await response.json().then(data => {
                    auth.login(data.userId,data.token,entity, data.username, data.profilePicLink);
                });
                return;
            } else {
                closeLoadingPopup();
                response.json().then(err => {openNotifPopup(err.error);});
                return;
            };
        } catch(err) {
            closeLoadingPopup();
            openNotifPopup("An unknown error occurred, please try again!");
            return;
        };
        } else {
            try { response = await fetch((process.env.REACT_APP_BACKEND_URL + `/shared/auth/${entity}/register`), {
                method: "POST",
                headers : {
                "Content-Type" : "application/json"
                },
                body: JSON.stringify({
                    username : formState.inputs.username.value,
                    email : formState.inputs.email.value,
                    password : formState.inputs.password.value
                })
            });
            if (response.ok) {
                closeLoadingPopup();
                removeInputs(["username", "reEnterPassword"]);
                response.json().then(res => {openNotifPopup(res.message);})
                updateAccountStatus(initial => !initial);
                return;
            } else {
                closeLoadingPopup();
                response.json().then(err => {openNotifPopup(err.error);});
                return;
            };
            } catch(err) {
                closeLoadingPopup();
                openNotifPopup("Unknown error occurred, please try again!");
                return;
            };
        };
    };

useEffect(() => {   
    if (hasAccount) {
        removeInputs(["username", "reEnterPassword"]);
    };},
    [removeInputs, hasAccount]);
    

return (
<div className = "background-auth">
    {notifPopup && 
            <Notification 
                message = {notifMessage}
                login = {false}
                type = "message"
                handleNotifPopup = {closeNotifPopup}
            />}
    {isLoading && 
        <Notification 
            login = {false}
            type = "loading"
            handleNotifPopup = {closeNotifPopup}
        />}
    <div className="authForm">
        <div className = "auth-entity-button-container">
            <div className = {"auth-entity-button auth-entity-button-left" + (entity === "users" ? " auth-entity-selected" : "")} onClick = {setEntityToUsers}>USER</div>
            <div className = {"auth-entity-button auth-entity-button-right" + (entity === "businesses" ? " auth-entity-selected" : "")} onClick = {setEntityToBusinesses}>BUSINESS</div>
        </div>
        <div className = "logo"><img src = {require("../Resources/Icons/appIcon.png")}/></div>
        <form action = "/login" method = "POST">
        {!hasAccount && 
        <Input 
            className="authInput"
            id = "username"
            type = "input"
            label = "Username"
            inputType="text" 
            placeholder="Username"
            errorAlert = "Username needs to have at least 8 characters"
            validators = {[
                ((value) => value.length >= 8)
            ]}
            onInput = {handleOverallValidity}
        />
        }
        <Input 
            className="authInput"
            id = "email"
            type = "input"
            label = "Email Address"
            inputType="email" 
            placeholder="Username@gmail.com"
            errorAlert = "Please enter a valid email address"
            validators = {[
                ((value) => value.length > 0)
            ]}
            onInput = {handleOverallValidity}
        />
        <Input 
            className="authInput"
            id = "password"
            type = "input"
            label = "Password"
            inputType="password" 
            placeholder="Password"
            errorAlert = "Password needs to have at least 8 characters"
            validators = {[
                ((value) => value.length >= 8)
            ]}
            onInput = {handleOverallValidity}
            cachePassword = {cachePassword}
        />
        {!hasAccount && 
        <Input 
            className="authInput"
            id = "reEnterPassword"
            type = "input"
            label = "Re-enter Password"
            inputType="password" 
            placeholder="Password"
            errorAlert = "Password does not match."
            validators = {[
                ((value) => (value === password))
            ]}
            onInput = {handleOverallValidity}
        />}
            <button type = "submit" className={"login" + (!formState.formValid ? " buttonDisable" : "")} disabled = {!formState.formValid} onClick = {handleSubmit}>{hasAccount ? "Login" : "Signup"}</button>
        </form>
        <form action = "/noAccount" method = "POST">
            <div className="footer"><button type = "button" onClick = {handleAccountStatus}>{hasAccount ? "Don't have an account? Signup" : "Have an account? Login"}</button>{hasAccount && <span>Forgot Password?</span>}</div>
        </form>
    </div>
</div> 
);
};

export default Authenticate;