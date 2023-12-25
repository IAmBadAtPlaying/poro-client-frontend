import * as Globals from '../globals';
import styles from '../styles/LobbyGamemodeSelector.module.css'
import GamemodeElement from "./GamemodeElement";
import {useEffect, useState} from "react";
import {AUDIO_PLAY_BIG_BUTTON, axiosSend, send} from "../pages";
import {isJsonObjectEmpty} from "../globals";


export default function LobbyGamemodeSelector({showFunction, availableQueues, assetMap}) {
    const [ activeElement, setActiveElement] = useState("");
    const [ queueId, setQueueID] = useState();

    const [pvpQueues, setPvPQueues] = useState({});

    useEffect(() => {
        if (isJsonObjectEmpty(availableQueues)) return;
        setPvPQueues(availableQueues["PvP"])
        console.log(availableQueues["PvP"])
    },[availableQueues]);

    const createLobby = (qID) => {
        AUDIO_PLAY_BIG_BUTTON();
        console.log(qID);
        if (showFunction !== undefined) {
            showFunction(false)
        }
        axiosSend("POST", "/lol-lobby/v2/lobby", JSON.stringify({queueId: qID}));
    }

    return (
        <>
            <div className={styles.gamemodeSelectorContainer}>
                {
                    Object.values(pvpQueues).reverse().map((queue, index) => {
                        if (!queue[0]) return <div key={"Undefined " + index}></div>;
                        if (!queue[0].gameMode) return <div key={"Undefined" + index}></div>;
                        if (queue[0].gameMode.startsWith("TUTORIAL_MODULE")) return <div key={"Undefined" + index}></div>;
                        return (
                            <GamemodeElement key={queue[0].id} queue={queue} isActive={activeElement === queue[0].gameMode} setActive={setActiveElement} setQueueId={setQueueID} assetMap={assetMap}/>
                        )
                    })
                }
        </div>
            <div className={styles.confirmButton} onClick={() => {createLobby(queueId)}}>
                <div className={styles.confirmButtonContent}>
                    Create Lobby
                </div>
            </div>
        </>

    )
}