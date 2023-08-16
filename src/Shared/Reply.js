import React, { useContext }from 'react';
import Avatar from '@mui/material/Avatar';
import './Reply.css';
import { AuthContext } from "../Shared/AuthContext";
const Reply = props => {
    const auth = useContext(AuthContext);
    const deleteReply = async () => {
        props.setIsLoading(true);


        try {
            let response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/shared/deleteReply/${auth.entity}/${auth.userId}`, {
                method: "POST",
                headers : {
                "Content-Type" : "application/json",
                "Authorization" : ("Bearer " + auth.token),
                },
                body: JSON.stringify({
                    postId: props.postId,
                    postEntity: props.postEntity,
                    commentId: props.commentId,
                    replyId: props.id
                })
            });

            if (response.ok) {
                const responseData = await response.json();
                props.setReplies(responseData);
                props.setIsLoading(false);
            } else {
                props.setError("Unknown Error Occured");
            }
        } catch (err) {
            throw new Error("Unknown Error Occured");
        }
    };

    
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
            {
                        (props.userId === auth.userId) &&
                        <div className="comment-buttons">
                             <button className="delete-comment-button" onClick={deleteReply} type = "button">
                                <i className="fa fa-trash fa-2x"></i>
                            </button>
                        </div>
                    }
        </div>
      
    )
};

export default Reply;
