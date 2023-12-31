import {useEffect} from "react";
import {PROXY_STATIC_PREFIX} from "../globals";
import {axiosSend, send} from "../pages";


export default function ReadyCheckContainer() {

    useEffect(() => {
        const queuePopAudio = new Audio();
        queuePopAudio.src = PROXY_STATIC_PREFIX + "/lol-game-data/assets/assets/events/shq2021/audio/sfx-shq-action-targonthunder.ogg";
        queuePopAudio.load();
        queuePopAudio.volume = 0.5;
        queuePopAudio.play();

        return () => {
            queuePopAudio.pause();
            queuePopAudio.removeAttribute("src");
        }
    })


    const declineReadyCheck = () => {
        axiosSend("POST", "/lol-matchmaking/v1/ready-check/decline", "");
    }

    const acceptReadyCheck = () => {
        axiosSend("POST", "/lol-matchmaking/v1/ready-check/accept", "");
    }


    return (
        <div>READY - CHECK
        <div>
            <button onClick={() => {acceptReadyCheck()}}> Accept</button>
            <button onClick={() => {declineReadyCheck()}}>Decline</button>
        </div>
        </div>
    )
}