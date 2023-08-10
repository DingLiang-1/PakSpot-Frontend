import React from 'react';
import Avatar from '@mui/material/Avatar';
import './Reply.css';
const Reply = props => {
    return (
       <div className="comment-post-main">
            <Avatar 
                src={props.imgurl}
                alt={props.username}
                sx={{ width: props.width, height: props.height }}
            />
            <div className="comment-post-text">
                <h6>{props.username}</h6>
                <span className = "comment-text">{props.text}</span>
            </div>
        </div>
      
    )
};

export default Reply;
