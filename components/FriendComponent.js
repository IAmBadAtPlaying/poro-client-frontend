import styles from '../styles/FriendComponent.module.css';
import {useEffect, useRef} from "react";
import * as Globals from "../globals"
import Image from "next/image";

export default function FriendComponent({friend}) {
    const friendDiv = useRef();
    useEffect(() => {
        const handleRightClick = (event) => {
            if (event.button === 2) {
                event.preventDefault();
                console.log(`${friend.summonerId}`)
                // Handle right-click event here
            }
        };
        const handleMiddleClick = (event) => {
            if (event.button === 1) {
                event.preventDefault();
                console.log(`Invite ${friend.summonerId}`);
            }
        };
        if (friendDiv.current) {
            friendDiv.current.addEventListener('contextmenu', handleRightClick);
            friendDiv.current.addEventListener('mousedown', handleMiddleClick)
        }


        return () => {
            if (friendDiv.current) {
                friendDiv.current.removeEventListener('contextmenu', handleRightClick);
                friendDiv.current.removeEventListener('mousedown', handleMiddleClick);
            }

        };
    }, []);

    const renderActivity = (availability, lol) => {
        if (!lol) return renderDefaultActivity(availability);
        if (Globals.isJsonObjectEmpty(lol) || Globals.isJsonObjectEmpty(lol.gameMode) || Globals.isJsonObjectEmpty(lol.gameStatus)) return renderDefaultActivity(availability);
        if (lol.gameStatus === "outOfGame") return (<div className={styles.status}>Lobby</div>)
        let displayGameStatus = Globals.GAME_STATUS_TO_STRING[lol.gameStatus]
        if (!displayGameStatus) displayGameStatus = lol.gameStatus;
        return (<div className={styles.status}>{lol.gameMode} - {displayGameStatus}</div>)
    }

    const renderDefaultActivity = (availability) => {
        return (<div className={styles.status}>{friend.availability}</div>);
    }

    return (
        <div className={styles.friendComponent} id={"friendComponent"} ref={friendDiv}>
            <div className={styles.imageContainer}><Image
                src={`${Globals.PROXY_STATIC_PREFIX}/lol-game-data/assets/v1/profile-icons/${friend.iconId}.jpg`}
                alt="Icon"
                className={styles.icon}
                fill
                draggable={false}
                style={{objectFit:"cover"}}
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
    );
}