import React , {useState, useCallback, useContext, useEffect} from "react";
import "./Authenticate.css";
import Input from "../Shared/Input.js";
import useForm from "../Shared/FormHook.js";
import {AuthContext} from "../Shared/AuthContext.js";
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
    const [forgetPassword, setForgetPasswordState] = useState(false);
    const [verified, setVerified] = useState(false);
    const [resetInput, toggleResetInput] = useState(false);

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
    
    function handleAccountStatus() {
        updateAccountStatus(initial => !initial);
        setForgetPasswordState(false);
        setVerified(false);
        toggleResetInput(false);
        removeInputs(["reEnterPassword","verificationCode","password"]);
    };

    function setEntityToUsers() {
        setEntity("users");
    };

    function setEntityToBusinesses() {
        setEntity("businesses");
    };

    function setForgetPassword() {
        setForgetPasswordState(true);
        removeInputs(["password"]);
        updateAccountStatus(true);
    };

    async function handleSubmit(event) {
        event.preventDefault();
        openLoadingPopup();
        let response;
        if (forgetPassword && !verified) {
            try { response = await fetch((process.env.REACT_APP_BACKEND_URL + `/shared/auth/matchverificationcode/${entity}/`), {
                    method: "POST",
                    headers : {
                    "Content-Type" : "application/json"
                    },
                    body: JSON.stringify({
                        email : formState.inputs.email.value,
                        verification : formState.inputs.verificationCode.value
                    })
                });
                if (response.ok) {
                    closeLoadingPopup();
                    setVerified(true);
                    return;
                } else {
                    closeLoadingPopup();
                    await response.json().then(err => {openNotifPopup(err.error);});
                    return;
                };
            } catch(err) {
                closeLoadingPopup();
                openNotifPopup("An unknown error occurred, please try again!");
                return;
            };
            
        } else if (forgetPassword && verified) {
            try { response = await fetch((process.env.REACT_APP_BACKEND_URL + `/shared/auth/resetpassword/${entity}`), {
                    method: "POST",
                    headers : {
                    "Content-Type" : "application/json"
                    },
                    body: JSON.stringify({
                        email : formState.inputs.email.value,
                        password : formState.inputs.password.value,
                        verificationCode : formState.inputs.verificationCode.value
                    })
                });
                if (response.ok) {
                    closeLoadingPopup();
                    await response.json().then(message => {
                        openNotifPopup(message.message);
                    });
                    setForgetPasswordState(false);
                    setVerified(false);
                    removeInputs(["reEnterPassword","verificationCode"]);
                    updateAccountStatus(true);
                    return;
                } else {
                    closeLoadingPopup();
                    await response.json().then(err => {openNotifPopup(err.error);});
                    return;
                };
            } catch(err) {
                closeLoadingPopup();
                openNotifPopup("An unknown error occurred, please try again!");
                return;
            };
        } else if (hasAccount) {
            try { response = await fetch((process.env.REACT_APP_BACKEND_URL + `/shared/auth/login/${entity}`), {
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
                    auth.login(data.userId,data.token,entity);
                });
                return;
            } else {
                closeLoadingPopup();
                await response.json().then(err => {openNotifPopup(err.error);});
                return;
            };
        } catch(err) {
            closeLoadingPopup();
            openNotifPopup("An unknown error occurred, please try again!");
            return;
        };
        } else {
            try { response = await fetch((process.env.REACT_APP_BACKEND_URL + `/shared/auth/register/${entity}`), {
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
                    updateAccountStatus(true);
                    toggleResetInput(true);
                    await response.json().then(res => {openNotifPopup(res.message);});
                    return;
                } else {
                    closeLoadingPopup();
                    await response.json().then(err => {openNotifPopup(err.error);});
                    return;
                };
            } catch(err) {
                closeLoadingPopup();
                openNotifPopup("Unknown error occurred, please try again!");
                return;
            };
        };
    };

    async function sendVerificationCode() {
        openLoadingPopup();
        let response;
        if (hasAccount) {
            try { 
                response = await fetch((process.env.REACT_APP_BACKEND_URL + `/shared/auth/getverificationcode/${entity}/${formState.inputs.email.value}`), {
                    method: "GET",
                    headers : {
                    "Content-Type" : "application/json"}
                });
            if (response.ok) {
                closeLoadingPopup();
                await response.json().then(message => {openNotifPopup(message.message);});
                return;
            } else {
                closeLoadingPopup();
                await response.json().then(err => {openNotifPopup(err.error);});
                return;
            };
            } catch(err) {
                closeLoadingPopup();
                openNotifPopup("An unknown error occurred, please try again!");
                return;
            };
        };
    };

    useEffect(() => {   
        if (hasAccount) {
            removeInputs(["username", "reEnterPassword"]);
        };
    },[removeInputs, hasAccount]);
        

    return (
    <div className = "background-auth">
        {notifPopup && 
                <Notification 
                    content = {<h4>{notifMessage}</h4>}
                    type = "message"
                    handleNotifPopup = {closeNotifPopup}
            />}
    {isLoading && 
        <Notification 
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
            resetInput = {resetInput}
            validators = {[
                ((value) => value.length > 0)
            ]}
            onInput = {handleOverallValidity}
        />
        {(forgetPassword && !verified) && (
            <div className = "verification-code-input-container">
                <Input 
                    className="verification-code-input"
                    id = "verificationCode"
                    type = "input"
                    label = "Enter Verification Code"
                    inputType="text" 
                    placeholder="Verification Code"
                    errorAlert = "Please enter the verification code"
                    validators = {[
                        ((value) => value.length > 0)
                    ]}
                    onInput = {handleOverallValidity}
                />
                <div className = "send-verification-code-div">
                    <button type = "button" disabled = {!formState.inputs.email.value.length} onClick = {sendVerificationCode}>SEND CODE</button>
                </div>
            </div>
        )}
        {(!forgetPassword || verified) && (
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
                resetInput = {resetInput}
            />
        )}
        {(!hasAccount || verified) && 
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
        <div className = "auth-form-button">
            <button type = "submit" disabled = {!formState.formValid} onClick = {handleSubmit}>{(forgetPassword && !verified) ? "Verify" : ((forgetPassword && verified ? "Reset" : (hasAccount) ? "Login" : "Register"))}</button>
        </div>
        </form>
        <div className="footer">
            <button type = "button" onClick = {handleAccountStatus}>{hasAccount ? "Don't have an account? Signup" : "Have an account? Login"}</button>
            {hasAccount && <button type = "button" onClick = {setForgetPassword}>Forgot Password?</button>}
        </div>
    </div>
    </div> 
);
};

export default Authenticate;

