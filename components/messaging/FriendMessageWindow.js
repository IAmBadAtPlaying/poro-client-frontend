import React, {useEffect, useRef, useState} from "react";
import styles from "../../styles/messaging/FriendMessageWindow.module.css";
import {axiosSend, subscribeToMessageUpdates, unsubscribeFromMessageUpdates} from "../../pages";
import { REST_PREFIX } from "../../globals";
import axios from "axios";
import ExternalLink from "./ExternalLink";

export default function FriendMessageWindow({ friend, onClose}) {
    const [messages, setMessages] = useState([]);

    const intermediateMessages = [];

    const bottomRef = useRef();
    const messageInputRef = useRef();

    const newMessageReceived = (message) => {
        console.log("New message received")
        if (Array.isArray(message)) {
                console.log("New message array received");
             intermediateMessages.length = 0;
             intermediateMessages.push(...message);
             setMessages(intermediateMessages);
        } else {
            console.log("New message received");
            updateMessages(message)
        }
    }

    const scrollToBottom = () => { bottomRef.current.scrollIntoView ( { behavior: 'smooth'}) }

    const updateMessages = (message) => {
        intermediateMessages.push(message);
        setMessages([...intermediateMessages]);
    }



    useEffect(() => {
        console.log("Component mounted");
        if (friend) fetchMessages(friend.id);
        subscribeToMessageUpdates(friend.id, newMessageReceived);

        return () => {
            console.log("Component unmounted");
            console.log("Unsubscribing from message updates");
            unsubscribeFromMessageUpdates(friend.id, newMessageReceived);
        }
    }, [friend]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchMessages = (id) => {
        if (id) {
            console.log("Fetching messages for " + id);
            axios.get(REST_PREFIX + "/conversations/" + id).then((response) => {
                if (response.data.messages) {
                    response.data.messages.forEach((message) => {
                        intermediateMessages.push(message);
                    });
                    setMessages(response.data.messages);
                }
            }).catch((error) => {
                console.log(error);
                setMessages([])
            });
        }
    }

    const urlRegex = /(www\.\S+)|(https?:\/\/\S+)/g;

    const replaceURLs = (message) => {
        if (message === undefined) return;
        const messageParts = message.split(urlRegex).map((part, index) => {
            if (part === undefined) return ("");
            if (part.match(urlRegex)) {
                // If it's a URL, wrap it in ExternalLink
                return <ExternalLink key={index} link={part} text={part}/>;
            } else {
                // Otherwise, return the original text
                return part;
            }
        });
        return messageParts;
    }

    const isFriendAuthor = (messageAuthorId) => {
        console.log(messageAuthorId + " " + friend.id)
        return messageAuthorId === friend.id;
    }


    const closeWindow = () => {
        onClose();
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            const inputValue = messageInputRef.current.value;

            messageInputRef.current.value = '';

            if(inputValue === '' || inputValue.trim() === '') return;
            console.log("Sending message: " + inputValue);
            axios.post(REST_PREFIX + "/conversations/" + friend.id, JSON.stringify({body: inputValue})).then((response) => {
                console.log(response.data);
            }).catch((error) => {});

        }
    };

    return (
        <div className={styles.mainWindow}>
            <div className={styles.header}>
                {friend.name}
                <button onClick={closeWindow}>Close</button>
            </div>
            <div className={styles.messageDisplay}>
                {
                    messages.length === 0 ? <div className={styles.noMessages}>No messages</div> :
                    messages.map((message, index) => {
                        console.log(message)
                        if (message === undefined) return (<div key={"Undefined Message" + index}></div>)
                        if (message.id === undefined) return (<div key={"Undefined Message ID" + index}></div>)
                        let currentClass = (isFriendAuthor(message.fromPid)) ?  styles.receivedMessage : styles.ownMessage ;
                        let isSystemMessage = (message.fromPi);
                        return (
                            <div key={message.id} className={styles.messageContainer}>
                                <div  className={currentClass}>
                                    {replaceURLs(message.body)}
                                </div>
                            </div>
                        )
                    })
                }
                <div ref={bottomRef}/>
            </div>
            <div className={styles.inputContainer}>
                <input type={"text"} placeholder={"Message"} className={styles.messageInput} ref={messageInputRef} onKeyDown={handleKeyDown}></input>
            </div>
        </div>
    )
}