import React, {useReducer, useEffect} from "react";
import "./Input.css";

function inputReducer(state, action) {
    switch (action.type) {
        case "CHANGE" :
            let isValid = true;
            for (const validators in action.validators) {
                isValid = isValid && action.validators[validators](action.val);
            }
            return ({
                ...state,
                value: action.val,
                isValid : isValid
            });
        case "TOUCH" :
            return ({
                ...state,
                isTouched:true
            });
        default:
            return state;
    };
};


function Input(props) {
    const [inputState, dispatch] = useReducer(inputReducer, {isTouched:false, value:"", isValid:false})

    const {isValid, value} = inputState;
    const {onInput, id} = props;

    useEffect(() => {
        onInput(id, value, isValid);
    }, [onInput, id, isValid, value]);

    function handleChange(event) {
        dispatch({type:"CHANGE", val:event.target.value, validators:props.validators});
    };

    function handleTouch(event) {
        dispatch({type:"TOUCH"});
    };

    return (
        <div className = {props.className + ((inputState.isTouched) ? (((!inputState.isValid) ? " input-error" : "")) : "") + (props.hide ? " hide-input" : "")}>
            <label htmlFor = {props.id}>{props.label}</label>
            {(props.type === "textarea") ? 
                <textarea
                    id = {props.id}
                    type = {props.inputType}
                    placeholder = {props.placeholder}
                    rows = {props.rows}
                    value = {inputState.value}
                    onChange = {handleChange}
                    onBlur = {handleTouch}
                />
                :
                <input
                    id = {props.id}
                    type = {props.inputType}
                    placeholder = {props.placeholder}
                    value = {inputState.value}
                    onChange = {handleChange}
                    onBlur = {handleTouch}
                />
            }
            {(inputState.isTouched) && (!inputState.isValid) && <p className = "input-error">{props.errorAlert}</p>}
        </div>
    );
};

export default Input;