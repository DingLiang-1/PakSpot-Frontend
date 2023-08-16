import React, { useState, useContext} from 'react';
import Avatar from '@mui/material/Avatar';
import { AuthContext } from "../Shared/AuthContext";
import Reply from './Reply.js';

import './Comment.css';

const Comment = props => {
    const [likeState, setLikeState] = useState(props.commentLikedBy);
    const [numLikes, setNumLikes] = useState(props.numLikes);
    const [viewReplies, setViewReplies] = useState(false);
    const [replies, setReplies] = useState(props.replies);
    const auth = useContext(AuthContext);

    const toggleLike = async () => {
        props.setIsLoading(true);
        try {
            let response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/shared/likeComment/${auth.entity}/${auth.userId}`, {
                method: "POST",
                headers : {
                "Content-Type" : "application/json",
                "Authorization" : ("Bearer " + auth.token),
                },
                body: JSON.stringify({
                    postId: props.postId,
                    postEntity: props.postEntity,
                    commentId: props.id,
                    likeState: !likeState
                })
            });
            if (response.ok) {
                setLikeState(prev => !prev);
                if (likeState) {
                    setNumLikes(prev => prev - 1);
                } else {
                    setNumLikes(prev => prev + 1);
                }
                props.setIsLoading(false);
                return;
            } else {
                props.setIsLoading(false);
                console.log("error liking comment");
                throw new Error("Error Liking Comment");
            }
        } catch (err) {
            props.setError(err.message);
        }
        return;
    }

    const replyHandler = () => {
        props.replyToComment(props.id,setReplies);
    }

    function viewRepliesHandler() {
        setViewReplies(true);
    };

    function hideRepliesHandler() {
        setViewReplies(false);
    };

    const deleteComment = async () => {
        props.setIsLoading(true);

        try {
            let response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/shared/deleteComment/${auth.entity}/${auth.userId}`, {
                method: "POST",
                headers : {
                "Content-Type" : "application/json",
                "Authorization" : ("Bearer " + auth.token),
                },
                body: JSON.stringify({
                    postId: props.postId,
                    postEntity: props.postEntity,
                    commentId: props.id
                })
            });

            if (response.ok) {
                props.setIsLoading(false);
                props.toggleResetComment();
            } else {
                props.setError("Unknown Error Occured");
            }
        } catch (err) {
            throw new Error("Unknown Error Occured");
        }
    };

    return (
        <div className="comment-post-container">
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
                <div className = "comment-buttons">
                    {
                        (props.userId === auth.userId) &&
                        <button className="delete-comment-button" onClick={deleteComment} type = "button">
                            <i className="fa fa-trash fa-2x"></i>
                        </button>
                    }
                    <button className={likeState ? "redHeart heart" : "heart"} onClick={toggleLike} type = "button">
                        <i className="fa fa-heart fa-2x"></i>
                    </button>
                </div>
            </div>
            { 
                (replies.length !== 0) &&
                (!viewReplies ? 
                    (<div className = "view-replies-button">
                        <button type = "button" onClick = {viewRepliesHandler}><h3>View Replies</h3></button>
                    </div>) 
                :
                    (<div className="comment-post-replies">
                        {replies.map(reply => {
                            return (
                                <Reply 
                                    id = {reply.id}
                                    userId={reply.doc.id}
                                    imgurl={reply.profilePicture}
                                    username={reply.doc.username}
                                    width="40"
                                    height="40"
                                    text={reply.body}
                                    commentId={props.id}
                                    setReplies={setReplies}
                                    postEntity={props.postEntity}
                                    postId={props.postId}
                                    setIsLoading={props.setIsLoading}
                                />
                            )
                        })}
                        <div className = "view-replies-button">
                            <button type = "button" onClick = {hideRepliesHandler}><h3>Hide Replies</h3></button>
                        </div>
                    </div>)
                )
            }
            <div className="comment-post-accessories">
                <div className="reply-comment-button"><button type="button" onClick={replyHandler}><h3>Reply</h3></button></div>
            </div>
        </div>
       
    );
}

export default Comment;

//<span><b>{`${numLikes} likes`}</b></span>