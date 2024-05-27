import * as Globals from '../../Globals';
import {AppState} from '../../store';
import {useSelector} from 'react-redux';

import styles from '../../styles/Application/ReadyCheckContainer.module.css';
import ChampSelectCountdown from './ReadyCheckContainer/ChampSelectCountdown';
import {useEffect, useState} from 'react';
import axios from 'axios';
export default function ReadyCheckContainer() {
    const gameflow = useSelector((state: AppState) => state.gameflowState);


    useEffect(() => {
        const queuePopAudio = new Audio(Globals.STATIC_PREFIX + '/assets/ogg/gameflow/readycheck/appear.ogg');
        queuePopAudio.load();
        queuePopAudio.volume = 0.35;
        queuePopAudio.play();

        return () => {
            queuePopAudio.pause();
            queuePopAudio.removeAttribute('src');
        };
    }, []);

    const declineAudio = new Audio(Globals.STATIC_PREFIX + '/assets/ogg/gameflow/readycheck/decline.ogg');
    declineAudio.load();
    declineAudio.volume = 0.5;

    const acceptAudio = new Audio(Globals.STATIC_PREFIX + '/assets/ogg/gameflow/readycheck/accept.ogg');
    acceptAudio.load();
    acceptAudio.volume = 0.5;

    const [accept, setAccept] = useState(false);
    const [decline, setDecline] = useState(false);

    const buttonsDisabled = () => {
        return (accept || decline);
    };

    const acceptReadyCheck = () => {
        acceptAudio.play();
        axios.post(Globals.PROXY_PREFIX + '/lol-matchmaking/v1/ready-check/accept', '');
        setAccept(true);
    };

    const declineReadyCheck = () => {
        declineAudio.play();
        axios.post(Globals.PROXY_PREFIX + '/lol-matchmaking/v1/ready-check/decline', '');
        setDecline(true);
    };

    const renderAcceptState = () => {
        if (accept) {
            return (
                <div>
                    ACCEPTED!
                </div>
            );
        }
        if (decline) {
            return (
                <div>
                    DECLINED!
                </div>
            );
        }
        return (<> </>);
    };
    const renderReadyCheck = () => {
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
        );
    };


    return (
        renderReadyCheck()
    );

}