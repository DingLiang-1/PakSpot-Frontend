import React, {useReducer, useCallback} from "react";

function formReducer(state, action) {
    let formValid = true;
    switch(action.type) {
        case "onChange":
            state = {
                ...state,
                inputs: {
                    ...state.inputs,
                    [action.id] : {
                        value : action.val,
                        isValid : action.isValid
                    }
                }
            };
            for (const inputId in state.inputs) {
                if (state.inputs[inputId]) {
                    formValid = formValid && state.inputs[inputId].isValid;
                }
                else {
                    continue;
                };
            };
            return {
                ...state,
                formValid : formValid
            };
        case "removeInputs": 
            for (const ids of action.ids) {
                state = {
                    ...state,
                    inputs : {
                        ...state.inputs,
                        [ids] : undefined
                    }
                };
            };
            for (const inputId in state.inputs) {
                if (state.inputs[inputId]) {
                    formValid = formValid && state.inputs[inputId].isValid;
                }
                else {
                    continue;
                };
            };
            return {
                ...state,
                formValid : formValid
            };
        default :
            return state;
    };
};

function useForm(initialInputs, initialValidity) {

    const [formState, dispatch] = useReducer(formReducer, {
        inputs: {
            ...initialInputs
        },
        formValid: initialValidity
    });

    const handleOverallValidity = useCallback((id, value, isValid) => {
        dispatch({id : id, val:value, isValid:isValid, type : "onChange"});
    }, []);

    const removeInputs = useCallback((ids) => {
        dispatch({ ids : ids, type : "removeInputs"});
    },[]);

    return [formState, handleOverallValidity, removeInputs];
};

export default useForm;
