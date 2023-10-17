import styles from '../styles/FriendComponent.module.css';
import {useEffect, useRef, useState} from "react";
import * as Globals from "../globals"
import Image from "next/image";
import {axiosSend} from "../pages";
import FriendComponentContextMenu from "./FriendComponentContextMenu";

export default function FriendComponent({friend, setCurrentConversationFriend}) {
    const [contextMenuVisible, setContextMenuVisible] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState({x: 0, y: 0});
    const contextMenuRef = useRef(null);
    const friendDiv = useRef();

    const closeContextMenu = () => {
        setContextMenuVisible(false);
    };

    const handleLeftClick = (event) => {
        event.preventDefault();
        if (setCurrentConversationFriend === undefined) return;
        setCurrentConversationFriend(friend);
    }

    const handleContextMenu = (event) => {
            event.preventDefault();
            console.log(`${friend.summonerId}`);
            const x = event.clientX ;
            const y = event.clientY ;

            setContextMenuPosition({x: x, y: y});
            setContextMenuVisible(true);
            console.log("Menu visible");
            console.log(x);
            console.log(y);
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (contextMenuRef.current && !contextMenuRef.current.contains(e.target)) {
                setContextMenuVisible(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            // Remove the event listener when the component unmounts
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {

        if (friendDiv.current) {
            friendDiv.current.addEventListener('contextmenu', handleContextMenu);
            friendDiv.current.addEventListener('mousedown', handleClick)
        }


        return () => {
            if (friendDiv.current) {
                friendDiv.current.removeEventListener('contextmenu', handleContextMenu);
                friendDiv.current.removeEventListener('mousedown', handleClick);
            }

        };
    }, []);



    const handleClick = (event) => {
        console.log(event.button);
        switch (event.button) {
            case 0:
                handleLeftClick(event);
                break;
            case 1:
                event.preventDefault();
                let bodyWrapper = new Array();
                let body = new Object();
                console.log(`Invite ${friend.summonerId}`);
                console.log(`Invite ${friend.puuid}`);
                body["toSummonerId"] = friend.summonerId;
                body["toSummonerName"] = friend.displayName;
                bodyWrapper.push(body);
                axiosSend("POST", "/lol-lobby/v2/lobby/invitations", JSON.stringify(bodyWrapper));
            break;
            default:
                event.preventDefault();
            break;
        }
    };

    const renderActivity = (availability, lol) => {
        if (!lol) return renderDefaultActivity();
        if (Globals.isJsonObjectEmpty(lol) || Globals.isJsonObjectEmpty(lol.gameMode) || Globals.isJsonObjectEmpty(lol.gameStatus)) return renderDefaultActivity();
        if (lol.gameStatus === "outOfGame") return (<div className={styles.status}>Lobby</div>)
        let displayGameStatus = Globals.GAME_STATUS_TO_STRING[lol.gameStatus]
        if (!displayGameStatus) displayGameStatus = lol.gameStatus;
        return (<div className={styles.status}>{lol.gameMode} - {displayGameStatus}</div>)
    }

    const renderDefaultActivity = () => {
        return (<div className={styles.status}>{friend.availability}</div>);
    }


    return (
        <><div className={styles.friendComponent} id={"friendComponent"} ref={friendDiv}>
            <div className={styles.imageContainer}><Image
                src={`${Globals.PROXY_STATIC_PREFIX}/lol-game-data/assets/v1/profile-icons/${friend.iconId}.jpg`}
                alt="Icon"
                className={styles.icon}
                fill
                draggable={false}
                style={{objectFit:"scale-down"}}
                loading="lazy"
            />
            </div>
            <div className={styles.friendTextComponents}>
                <div className={styles.displayName}>{friend.name}</div>
                {
                    renderActivity(friend.availability, friend.lol)
                }
            </div>
        </div>
            {contextMenuVisible ? (
                <div ref={contextMenuRef}>
                    <FriendComponentContextMenu x={contextMenuPosition.x} y={contextMenuPosition.y} onClose={() => setContextMenuVisible(false)} friend={friend}/>
                </div>
                ) : <></>}
        </>
    );
}