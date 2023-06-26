import "./App.css";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import React , {useState, useCallback, useEffect } from "react";
import Planner from "./Planner/Planner.js";
import Authenticate from "./Authentication/Authenticate.js";
import {AuthContext} from "./Shared/AuthContext.js";
import Background from "./Shared/Background.js";
import Feed from "./Feed/Feed.js";
import Profile from "./Profile/Profile.js";
let logoutTimer;

function App() {
  const [token,setToken] = useState(false);
  const [userId, setUserId] = useState(false);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();

  const login = useCallback((uid,tokenNew, expirationDate) => {
    setToken(tokenNew);
    setUserId(uid);
    const tokenExpirationDate = expirationDate || new Date(new Date().getTime() +1000 * 60 * 60);
    setTokenExpirationDate(tokenExpirationDate);
    localStorage.setItem("userData", JSON.stringify({userId : uid, token : tokenNew, expiration:tokenExpirationDate.toISOString()}));
  },[]);

  const logout = useCallback(() => {
    setToken(false);
    setUserId(false);
    localStorage.removeItem("userData");
  }
  ,[]);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (storedData && storedData.token && (new Date(storedData.expiration) > new Date())) {
      login(storedData.userId, storedData.token, new Date(storedData.expiration));
    };
  }, [login]);

  let authPath = ((token) ? 
    {
      path : "/",
      element: <Background />,
      children: [
        {
          index : true,
          element : <Feed />
        },
        {
          path : "feed",
          element : <Feed />,
        },
        {
          path:"planner",
          element:<Planner />,
        },
        {
          path : "profile",
          element:<Profile />
        },
      ],
    } : 
    {
      path : "/",
      element: <Authenticate />,
    });
    const router = createBrowserRouter([ 
      {...authPath}
    ,]);
  return (
    <AuthContext.Provider 
      value = {{
        isLoggedIn:!!token,
        userId : userId,
        token : token,
        login:login, 
        logout:logout}}>
      <RouterProvider router = {router} />
    </AuthContext.Provider>
  );
};

export default App;