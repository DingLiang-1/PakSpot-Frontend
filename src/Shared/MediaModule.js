import React from "react";
import { Splide, SplideSlide } from '@splidejs/react-splide';


function MediaModule(props) {

    return (
        <div className = {props.mediaClassName}>
            <Splide aria-label = {props.mediaClassName}>
                {props.images.map((image,index) => { 
                    return (
                        <SplideSlide key = {index}>
                            <img src = {image} />
                        </SplideSlide>
                    );
                })}
            </Splide>
            {props.postIcons}
        </div> 
        );
};

export default MediaModule;