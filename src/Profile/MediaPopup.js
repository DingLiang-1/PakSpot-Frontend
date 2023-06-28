import React from "react";
import PostPopupIcons from "./PostPopupIcons.js";
import "./MediaPopup.css";
import { Splide, SplideSlide } from '@splidejs/react-splide';


function MediaPopup(prop) {

    return (
        <div className = "media-popup">
            <Splide aria-label="Media Post">
                {prop.images.map((image,index) => { 
                    return (
                        <SplideSlide key = {index}>
                            <img src = {image} />
                        </SplideSlide>
                    );
                })}
            </Splide>
            <PostPopupIcons popped = {prop.popped} popup = {prop.popup}/>
        </div> 
        );
};

export default MediaPopup;