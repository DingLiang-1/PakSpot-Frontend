import React, {useContext} from "react";
import "./EventForm.css";
import Input from "./Input.js";
import useForm from "./FormHook.js";
import { AuthContext } from "./AuthContext.js";

function EventForm(props) {
    const auth = useContext(AuthContext);
    
    const [formState, handleOverallValidity] =
        useForm({
            eventformdateinput : {
                value : "",
                isValid : false
            },
            eventformstarttimeinput : {
                value : "",
                isValid : false
            },
            eventformendtimeinput : {
                value : "",
                isValid : false
            },
            eventformdescriptioninput : {
                value : "",
                isValid : true
            }
        },
        false);

        async function submitForm(event) {
            event.preventDefault();
            props.openLoadingPopup();
            let response;
            try { 
                switch (props.type) {
                    case "addEvent" :
                        response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/${auth.entity}/addscheduledevent/${auth.userId}`, {
                            method: "POST",
                            headers : {
                            "Content-Type" : "application/json",
                            "Authorization" : ("Bearer " + auth.token),
                            },
                            body: JSON.stringify({
                                date : formState.inputs.eventformdateinput.value,
                                startTime : formState.inputs.eventformstarttimeinput.value,
                                endTime : formState.inputs.eventformendtimeinput.value,
                                description : formState.inputs.eventformdescriptioninput.value,
                                location : props.location,
                                address : props.address
                            })
                            });
                        if (response.ok) {
                            props.closeOnSubmit();
                            props.closeLoadingPopup();
                            props.openNotifPopup("Event scheduled");
                        } else {
                            props.closeLoadingPopup();
                            props.openNotifPopup("An error occured, please try again!");
                            return;
                        };
                        return;
                    case "editEvent" :
                        props.openLoadingPopup();
                        response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/${auth.entity}/editscheduledevent/${auth.userId}`, {
                            method: "POST",
                            headers : {
                            "Content-Type" : "application/json",
                            "Authorization" : ("Bearer " + auth.token),
                            },
                            body: JSON.stringify({
                                date : formState.inputs.eventformdateinput.value,
                                startTime : formState.inputs.eventformstarttimeinput.value,
                                endTime : formState.inputs.eventformendtimeinput.value,
                                description : formState.inputs.eventformdescriptioninput.value,
                                eventId : props.eventId,
                                eventDayId : props.eventDayId
                            })
                            }); 
                        if (response.ok) {
                            props.closeOnSubmit();
                            props.closeLoadingPopup();
                            props.refreshPage();
                            response.json().then(res => {props.openNotifPopup(res.message);});
                        } else {
                            props.closeLoadingPopup();
                            response.json().then(res => {props.openNotifPopup(res.error);});
                        };
                        return;
                    default :
                        return;
                };  
        } catch(err) {
            return;
        }
    };

    return ( 
        <form className = {"event-form " + props.eventFormClassName} onSubmit = {submitForm} >
                <h3>{props.formHeader}</h3>
                <Input 
                    className = "event-form-input"
                    id = "eventformdateinput"
                    label = "Date"
                    type = "input"
                    inputType = "date"
                    placeholder = "YYYY-MM-DD" 
                    errorAlert = "required field"
                    validators = {[
                        ((value) => value.length === 10),
                        ((value) => {
                            let date;
                            try {
                                if (value.length !== 10) {
                                    return false;
                                };
                                date = new Date(value);
                                if (date) {
                                    return (date.toString() !== "Invalid Date");
                                } else {
                                    return false;
                                };
                            } catch (err) {
                                return false;
                            };
                        }),
                    ]}
                    onInput = {handleOverallValidity}
                />
                <div className = "event-form-time">

                <Input 
                    className = "event-form-time-input"
                    id = "eventformstarttimeinput"
                    label = "Start Time"
                    type = "input"
                    inputType = "time"
                    placeholder = "HH:MM"
                    errorAlert = "required field"
                    validators = {[
                            (value) => (value.length === 5),
                            (value) => (value.slice(2,3) === ":"),
                            (value) => {
                                let HH = value.slice(0,2);
                                try {
                                    HH = parseInt(HH);
                                    return (HH < 24 && HH >= 0);
                                } catch (err) {
                                    return false;
                                };
                            },
                            (value) => {
                                let MM = value.slice(-2);
                                try {
                                    MM = parseInt(MM);
                                    return (MM < 60 && MM >= 0);
                                } catch (err) {
                                    return false;
                                };
                            }
                    ]}
                    onInput = {handleOverallValidity}
                />
                

                <Input 
                    className = "event-form-time-input"
                    id = "eventformendtimeinput"
                    label = "End Time"
                    type = "input"
                    inputType = "time"
                    placeholder = "HH:MM"
                    validators = {[
                        (value) => (value.length === 5),
                        (value) => (value.slice(2,3) === ":"),
                        (value) => {
                            let HH = value.slice(0,2);
                            try {
                                HH = parseInt(HH);
                                return (HH < 24 && HH >= 0);
                            } catch (err) {
                                return false;
                            };
                        },
                        (value) => {
                            let MM = value.slice(-2);
                            try {
                                MM = parseInt(MM);
                                return (MM < 60 && MM >= 0);
                            } catch (err) {
                                return false;
                            };
                        }
                ]}
                    errorAlert = "required field"
                    onInput = {handleOverallValidity}
                />

                </div>

                <Input 
                    className = "event-form-input"
                    id = "eventformdescriptioninput"
                    label = "Description"
                    type = "textarea"
                    inputType = "text"
                    placeholder = "Max 250 Characters"            
                    rows = "3"
                    validators = {[
                        ((value) => (value.length > 0 && value.length <= 250))
                    ]}
                    errorAlert = "Please enter a maximum of 250 characters"
                    onInput = {handleOverallValidity}
                />
                <div className = "event-form-submit-button">
                    <button type = "submit" className = "post1" disabled = {!formState.formValid}>Submit</button>
                </div>
        </form>
    );
};

export default EventForm;