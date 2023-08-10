import React, { useEffect, useState, useContext, useReducer, useRef } from 'react';

import Comment from './Comment';
import Notification from './Notification';
import Input from './Input.js';
import useForm from './FormHook';
import { AuthContext } from "../Shared/AuthContext";

import './CommentModule.css';

function replyReducer(state,action) {
    switch(action.type) {
        case "REPLYINPUT" :
            return {
                replyState : true,
                commentId : action.commentId,
                setReplies : action.setReplies
            };
        case "COMMENTINPUT" :
            return {
                replyState : false,
                commentId : undefined,
                setReplies : undefined
            };
        default :
            return state;
    };
};


const CommentModule = props => {
    const [comments, setComments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const auth = useContext(AuthContext);
    const [resetInput,setResetInput] =useState(false);
    const [resetComment, setResetComment] = useState(false);
    const [replying, dispatchIsReplying] = useReducer(replyReducer, {replyState : false});
    const replyInputRef = useRef();
    const [formState, handleOverallValidity, removeInputs] = useForm({
        commentId: {
            value: "",
            validty: false
        }
    }, false);

    const closeError = () => {
        setError(undefined);
    }

    const toggleResetInput = () => {
        setResetInput(prev => !prev);
    }
    
    const { postId, postEntity } = props;

    const toggleResetComment = () => {
        setResetComment(prev => !prev);
    }

    const postCommentHandler = async event => {
        event.preventDefault();
        let response;
        try {
            response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/shared/postcomment/${auth.entity}/${auth.userId}`, {
                method: "POST",
                headers : {
                "Content-Type" : "application/json",
                "Authorization" : ("Bearer " + auth.token),
                },
                body: JSON.stringify(
                    {
                        postId: postId,
                        commentText: formState.inputs.commentId.value,
                        postEntity: postEntity
                    }
                )
            });
            if (response.ok) {
                toggleResetComment();
                toggleResetInput();
            }
        } catch (err) {
            setError(err);
        }
    };

    const submitReplyHandler = async event => {
        event.preventDefault();
        setIsLoading(true);
        let response;
        try {
            response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/shared/replyComment/${auth.entity}/${auth.userId}`, {
                method: "POST",
                headers : {
                "Content-Type" : "application/json",
                "Authorization" : ("Bearer " + auth.token),
                },
                body: JSON.stringify({
                    postId: props.postId,
                    postEntity: props.postEntity,
                    commentId: replying.commentId,
                    body: formState.inputs.replyId.value
                })
            });
            if (response.ok) {
                const responseData = await response.json();
                replying.setReplies(responseData);
                dispatchIsReplying({type : "COMMENTINPUT"});
                removeInputs(["replyId"]);
                setIsLoading(false);
                setResetInput(initial => !initial);
            }
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
        }
    };

    function replyToComment(commentId,setReplies) {
        dispatchIsReplying({type : "REPLYINPUT", commentId : commentId, setReplies : setReplies});
        removeInputs(["commentId"]);
    };

    function returnToComment() {
        if (!formState.inputs.replyId.value) {
            dispatchIsReplying({type : "COMMENTINPUT"});
            removeInputs(["replyId"]);
        };
        return;
    };
    

    useEffect(
        () => {
            if (replying.replyState) {
                replyInputRef.current.focus();
            }
            return;
    }, [replying.replyState])
    
    useEffect(() => {
        const getComments = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(
                    `${process.env.REACT_APP_BACKEND_URL}/shared/getComment/${postId}/${postEntity}/${auth.userId}`, {
                        method: "GET",
                        headers : {
                            "Authorization" : ("Bearer " + auth.token)
                        },
                    });

                const responseData = await response.json();
                console.log(responseData);

                if (!response.ok) {
                    throw new Error(responseData.message);
                }
                setComments(responseData);
                setIsLoading(false);
            } catch(err) {
                setIsLoading(false);
                setError(err.message);
            }
        };
        getComments();
    }, [postId, postEntity, auth, resetComment]);

    return (
        <React.Fragment>
        {isLoading &&
            <Notification 
                login = {true}
                type = "loading"
            />
        }
        
        {error && 
            <Notification 
                type="message" 
                message={error.message} 
                login={true}
                handleNotifPopUp={closeError} 

            />
        }
        {
            !error && (
                <div className="comment-module-container">
                    <div className="comment-header">
                        <button className="close-comment-button" onClick={props.closeCommentPopUp}><i className="fa fa-angle-left"></i></button>
                        <h3 className="comment-title">Comments</h3>
                    </div>
                    <div className="comment-container">
                        {
                             comments.length === 0 ?
                             <div className = "no-comments">
                                <h3>No Comments</h3>
                             </div> :
                             <div className="comment-body">
                            {comments.map((comment, index) => {
                                return (
                                    <Comment 
                                        key={index}
                                        id={comment.id}
                                        imgurl={comment.profilePicture}
                                        username={comment.doc.username}
                                        numLikes={comment.numLikes}
                                        text={comment.body}
                                        commentLikedBy={comment.commentLikedBy}
                                        width="40"
                                        height="40"
                                        setIsLoading={setIsLoading}
                                        postId={postId}
                                        postEntity={postEntity}
                                        setError={setError}
                                        replies={comment.replies}
                                        replyToComment = {replyToComment}
                                    />
                                )
                            })}
                            </div>
                        }
                    </div>
                    <form className="post-comment-elements">
                        {replying.replyState ? (
                            <Input 
                                reference = {replyInputRef}
                                type="textarea"
                                className="post-comment-input"
                                id= "replyId"
                                inputType= "text"
                                placeholder=  "Reply"
                                rows = {2}
                                validators= {[
                                    value => value.length >= 1
                                ]}
                                onInput={handleOverallValidity}
                                onBlur = {returnToComment}
                                resetInput = {resetInput}
                            />
                        ) : (
                            <Input 
                                type="textarea"
                                className="post-comment-input"
                                id= "commentId"
                                inputType= "text"
                                placeholder= "Add comment"
                                rows = {2}
                                validators= {[
                                    value => value.length >= 1
                                ]}
                                onInput={handleOverallValidity}
                                resetInput = {resetInput}
                            />
                        )}
                        <button className="post-comment-button" type="submit" onClick={replying.replyState ? submitReplyHandler : postCommentHandler}><i className="fa-solid fa-arrow-right fa-2x"></i></button>
                    </form>
                </div>
                
            )
        }
        
        </React.Fragment>
        
    );
}
export default CommentModule;
