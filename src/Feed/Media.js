import React from "react";
import PostIcons from "./PostIcons.js";
import "./Media.css";
import { Splide, SplideSlide } from '@splidejs/react-splide';


function Media(prop) {

    return (
        <div className = "media">
            <Splide aria-label="Media Post">
                {prop.images.map((image,index) => { 
                    return (
                        <SplideSlide key = {index}>
                            <img src = {image} />
                        </SplideSlide>
                    );
                })}
            </Splide>
            <PostIcons popped = {prop.popped} popup = {prop.popup}/>
        </div> 
        );
};

export default Media;


