import styles from '../styles/FriendComponent.module.css';
import {useEffect, useRef} from "react";
import * as Globals from "../globals"

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
    return (
        <div className={styles.friendComponent} id={"friendComponent"} ref={friendDiv}>
            <img src={`${Globals.PROXY_STATIC_PREFIX}/lol-game-data/assets/v1/profile-icons/${friend.iconId}.jpg`} alt={"Icon"} className={styles.icon}/>
            <div className={styles.friendTextComponents}>
                <div className={styles.displayName}>{friend.name}</div>
                <div className={styles.status}>{friend.availability}</div>
            </div>
        </div>
    );
}