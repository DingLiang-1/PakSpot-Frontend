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
            try { response = await fetch(`http://localhost:3000/users/addscheduledevent/${auth.userId}`, {
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
                    location : "Tangjong Beach Club",
                    address : "120 Tanjong Beach Walk, 098942"
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
                    errorAlert = "Invalid Format"
                    validators = {{
                        requiredField : ((value) => value.length === 10),
                        checkformat : ((value) => {
                            let date;
                            try {
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
                    }}
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
                    errorAlert = "Invalid Format"
                    validators = {{
                        requiredField : ((value) => value.length === 5),
                    }}
                    onInput = {handleOverallValidity}
                />
                

                <Input 
                    className = "plannerPopupTimeInput"
                    id = "plannerPopupEndTime"
                    label = "End Time"
                    type = "input"
                    inputType = "text"
                    placeholder = "HH:MM"
                    validators = {{
                        requiredField : ((value) => value.length === 5 ),
                    }}
                    errorAlert = "Invalid Format"
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
                    validators = {{
                        requiredField : ((value) => value.length > 0),
                    }}
                    errorAlert = "Please enter a maximum of 50 characters"
                    onInput = {handleOverallValidity}
                />
                <button type = "submit" className = "post1" disabled = {!formState.formValid}>Submit</button>
        </form>
    );
};

export default PlannerForm;