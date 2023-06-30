import React, { useCallback, useReducer, useContext} from "react";
import "./PlannerForm.css";
import Input from "../Shared/Input.js";
import useForm from "../Shared/FormHook.js";
import { AuthContext } from "../Shared/AuthContext.js";

function PlannerForm(prop) {
    const auth = useContext(AuthContext);
    
    const [formState, handleOverallValidity] =
        useForm({
            plannerPopupDate : {
                value : "",
                isValid : false
            },
            plannerPopupStartTime : {
                value : "",
                isValid : false
            },
            plannerPopupEndTime : {
                value : "",
                isValid : false
            },
            plannerPopupeDescription : {
                value : "",
                isValid : false
            }
        },
        false);

        async function submitForm(event) {
            console.log("running");
            event.preventDefault();
            let response;
            try { response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/users/addscheduledevent/${auth.userId}`, {
                method: "POST",
                headers : {
                "Content-Type" : "application/json",
                "Authorization" : ("Bearer " + auth.token),
                },
                body: JSON.stringify({
                    date : formState.inputs.plannerPopupDate.value,
                    startTime : formState.inputs.plannerPopupStartTime.value,
                    endTime : formState.inputs.plannerPopupEndTime.value,
                    description : formState.inputs.plannerPopupeDescription.value,
                    location : prop.location,
                    address : prop.address
                })
            });
            if (response.ok) {
    
                prop.closeOnSubmit();
                
            } else {
                console.log("please try again");
            };
        } catch(err) {
            console.log(err);
        }
    };

    return ( 
        <form className = "plannerPopup" onSubmit = {submitForm} >
                <h3>Set a date!</h3>
                <Input 
                    className = "plannerPopupInput"
                    id = "plannerPopupDate"
                    label = "Date"
                    type = "input"
                    inputType = "text"
                    placeholder = "YYYY-MM-DD" 
                    errorAlert = "Invalid Format, please try again"
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
                <div className = "plannerPopupTime">

                <Input 
                    className = "plannerPopupTimeInput"
                    id = "plannerPopupStartTime"
                    label = "Start Time"
                    type = "input"
                    inputType = "text"
                    placeholder = "HH:MM"
                    errorAlert = "Invalid format, please try again"
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
                    className = "plannerPopupTimeInput"
                    id = "plannerPopupEndTime"
                    label = "End Time"
                    type = "input"
                    inputType = "text"
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
                    errorAlert = "Invalid format, please try again"
                    onInput = {handleOverallValidity}
                />

                </div>

                <Input 
                    className = "plannerPopupInput"
                    id = "plannerPopupeDescription"
                    label = "Description"
                    type = "textarea"
                    inputType = "text"
                    placeholder = "Max 50 Characters"            
                    rows = "3"
                    validators = {[
                        ((value) => value.length > 0 && value.length <= 250)
                    ]}
                    errorAlert = "Please enter a maximum of 250 characters"
                    onInput = {handleOverallValidity}
                />
                <button type = "submit" className = "post1" disabled = {!formState.formValid}>Submit</button>
        </form>
    );
};

export default PlannerForm;