import * as Globals from "../../globals";
import styles from '../../styles/gameflow/ReadyCheck.module.css';
import {useEffect, useState} from "react";
import ChampSelectCountdown from "./ChampSelectCountdown";
import {axiosSend} from "../../pages/indexRework";

export default function ReadyCheckContainer() {
    useEffect(() => {
        const queuePopAudio = new Audio(Globals.PROXY_STATIC_PREFIX + "/lol-game-data/assets/assets/events/tft-dl2022/audio/sfx-tft-dragon-dialogue-reaction-positive.ogg");
        queuePopAudio.load();
        queuePopAudio.volume = 0.35;
        queuePopAudio.play();

        return () => {
            queuePopAudio.pause();
            queuePopAudio.removeAttribute("src");
        }
    }, [])

    const declineAudio = new Audio(Globals.PROXY_STATIC_PREFIX + "/lol-game-data/assets/assets/events/tft-dl2022/audio/sfx-tft-dragon-ui-button-icon-click.ogg");
    declineAudio.load();
    declineAudio.volume = 0.5;

    const acceptAudio = new Audio(Globals.PROXY_STATIC_PREFIX + "/lol-game-data/assets/assets/events/tft-dl2022/audio/sfx-tft-dragon-ui-button-play-click.ogg");
    acceptAudio.load();
    acceptAudio.volume = 0.5;

    const [accept, setAccept] = useState(false);
    const [decline, setDecline] = useState(false);

    const buttonsDisabled= () => {
        return (accept || decline);
    }

    const acceptReadyCheck = () => {
        acceptAudio.play()
        axiosSend("POST", "/lol-matchmaking/v1/ready-check/accept", "");
        setAccept(true);
    }

    const declineReadyCheck = () => {
        declineAudio.play();
        axiosSend("POST", "/lol-matchmaking/v1/ready-check/decline", "");
        setDecline(true);
    }

    const renderAcceptState = () => {
        if (accept) {
            return (
                <div>
                    ACCEPTED!
                </div>
            )
        }
        if (decline) {
            return (
                <div>
                    DECLINED!
                </div>
            )
        }
        return (<> </>)
    }

    return (
        <div className={styles.container}>
            <div className={styles.roundBackground}>
                <ChampSelectCountdown accepted={accept} declined={decline}/>
            </div>
            <div className={styles.roundContainer}>
                <div className={styles.internalContainer}>
                    <div className={styles.matchFoundContainer}>
                        MATCH FOUND
                    </div>
                    <div className={styles.acceptStateContainer}>
                        {
                            renderAcceptState()
                        }
                    </div>
                    <div className={styles.buttonContainer}>
                        <button className={styles.buttonAccept} onClick={acceptReadyCheck} disabled={buttonsDisabled()}>
                            ACCEPT!
                        </button>
                        <div className={styles.spacer}/>
                        <button className={styles.buttonDecline} onClick={declineReadyCheck} disabled={buttonsDisabled()}>
                            DECLINE
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}