import * as Globals from '../globals';
import styles from '../styles/LobbyGamemodeSelector.module.css'
import GamemodeElement from "./GamemodeElement";
import {useState} from "react";
import {AUDIO_PLAY_GENERIC_BUTTON, send} from "../pages/index";


export default function LobbyGamemodeSelector({showFunction}) {
    const [ activeElement, setActiveElement] = useState();
    const [ queueId, setQueueID] = useState();

    const createLobby = (qID) => {
        AUDIO_PLAY_GENERIC_BUTTON();
        console.log(qID);
        if (showFunction !== undefined) {
            showFunction(false)
        }
        send([0,"POST","/lol-lobby/v2/lobby", JSON.stringify({queueId: qID})]);
    }

    const availableGamemodes = [Globals.GAMEMODE_SUMMONERS_RIFT,Globals.GAMEMODE_ARAM,Globals.GAMEMODE_TFT]

    return (
        <>
            <div className={styles.gamemodeSelectorContainer}>
            {
                Object.values(availableGamemodes).map((gamemode) => {
                    return (
                        <GamemodeElement key={gamemode[0]} gamemode={gamemode} isActive={activeElement === gamemode[0]} setActive={setActiveElement} setQueueId={setQueueID}/>
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