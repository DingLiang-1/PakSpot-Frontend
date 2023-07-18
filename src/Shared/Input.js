import React, {useReducer, useEffect} from "react";
import "./Input.css";

function inputReducer(state, action) {
    switch (action.type) {
        case "CHANGE" :
            let isValid = true;
            action.validators.forEach(validator => {
                isValid = isValid && validator(action.val);
                return;
            });
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
    const [inputState, dispatch] = useReducer(inputReducer, {isTouched:false, value: (props.initialiseValue || ""), isValid: (props.initialiseValue ? true : false)})

    const {isValid, value} = inputState;
    const {onInput, id} = props;

    useEffect(() => {
        onInput(id, value, isValid);
    }, [onInput, id, isValid, value]);

    function handleChange(event) {
        dispatch({type:"CHANGE", val:event.target.value, validators:props.validators});
        (props.cachePassword && props.cachePassword(event.target.value));
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