import React , {createContext}from "react"



export const AuthContext = createContext({
    isLoggedIn:false, 
    login : () => {}, 
    logout : () => {},
    userId : null,
    token: null,
    entity: null,
    username:null,
    profilePicLink:null,
});

