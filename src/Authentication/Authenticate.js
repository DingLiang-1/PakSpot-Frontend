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

    async function handleSubmit(event) {
        event.preventDefault();
        openLoadingPopup();
        let response;
        if (hasAccount) {
            try { response = await fetch((process.env.REACT_APP_BACKEND_URL + "/shared/auth/users/login"), {
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
                    auth.login(data.userId,data.token);
                });
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
        } else {
            try { response = await fetch((process.env.REACT_APP_BACKEND_URL + "/shared/auth/users/register"), {
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
    <div className="authForm">
        <div className = "logo"><img src = {require("../Resources/Icons/appIcon.png")}/></div>
        <form action = "/login" method = "POST">
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
        {!hasAccount && 
        <Input 
            className="authInput"
            id = "username"
            type = "input"
            label = "Username"
            inputType="text" 
            placeholder="Username"
            errorAlert = "Invalid Format"
            validators = {{
                requiredField : ((value) => value.length > 0),
            }}
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
            errorAlert = "Invalid Format"
            validators = {{
                requiredField : ((value) => value.length > 0),
            }}
            onInput = {handleOverallValidity}
        />
        <Input 
            className="authInput"
            id = "password"
            type = "input"
            label = "Password"
            inputType="password" 
            placeholder="Password"
            errorAlert = "Invalid Format"
            validators = {{
                requiredField : ((value) => value.length > 0),
            }}
            onInput = {handleOverallValidity}
        />
        {!hasAccount && 
        <Input 
            className="authInput"
            id = "reEnterPassword"
            type = "input"
            label = "Re-enter Password"
            inputType="text" 
            placeholder="Password"
            errorAlert = "Invalid Format"
            validators = {{
                requiredField : ((value) => value.length > 0),
            }}
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