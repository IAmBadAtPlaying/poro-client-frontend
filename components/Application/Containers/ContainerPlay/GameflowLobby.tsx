import {useSelector} from 'react-redux';
import {AppState} from '../../../../store';
import * as Globals from '../../../../Globals';
import styles from '../../../../styles/Application/Containers/ContainerPlay/GameflowLobby.module.css';
import axios from 'axios';
import LobbyMemberCard from './GameflowLobby/LobbyMemberCard';
import {useState} from 'react';
import GamemodeSelector from './GameflowNone/GamemodeSelector';

export interface GameflowLobbyProps {
    inQueue: boolean;
}

export default function GameflowLobby({inQueue}: GameflowLobbyProps) {

    const lobby = useSelector((state: AppState) => state.lobbyState);
    const queues = useSelector((state: AppState) => state.queues);

    const [showGamemodeSelector, setShowGamemodeSelector] = useState<boolean>(false);

    const requestStartMatchmaking = () => {
        axios.post(Globals.PROXY_PREFIX + '/lol-lobby/v2/lobby/matchmaking/search')
            .catch((error) => {
                console.log(
                    '[Start Matchmaking] Error: ',
                    error
                );
            });
    };

    const requestCancelMatchmaking = () => {
        axios.delete(Globals.PROXY_PREFIX + '/lol-lobby/v2/lobby/matchmaking/search')
            .catch((error) => {
                console.log(
                    '[Cancel Matchmaking] Error: ',
                    error
                );
            });
    };

    const renderTFTLobby = () => {
        return (
            <div className={styles.tftContainer}>
                <div className={styles.tftSubGroup}>
                    <div className={styles.tftSingleGroup}>

                    </div>
                    <div className={styles.tftSingleGroup}>

                    </div>
                    <div className={styles.tftSingleGroup}>

                    </div>
                </div>
                <div className={styles.tftSubGroup}>
                    <div className={styles.tftSelfGroup}>
                        YOU
                    </div>
                    <div className={styles.tftSingleGroup}>

                    </div>
                </div>
                <div className={styles.tftSubGroup}>
                    <div className={styles.tftSingleGroup}>

                    </div>
                    <div className={styles.tftSingleGroup}>

                    </div>
                    <div className={styles.tftSingleGroup}>

                    </div>
                </div>

            </div>
        );
    };

    const renderArenaLobby = () => {
        return (
            <></>
        );
    };

    const renderDefaultLobby = () => {
        return (
            <>
                <div className={styles.member_container} onDragOver={event => {
                    event.preventDefault();
                }}>
                    {
                        lobby.members?.map(
                            (member, index) => {
                                const key = member.puuid ?? index;
                                return <LobbyMemberCard member={member} key={key}/>;
                            }
                        )
                    }
                </div>
            </>
        );
    };

    const renderContent = () => {
        //This is just for the "form" of the lobby (TFT lobbies should look different from normal lobbies)
        switch (lobby?.gameConfig?.gameMode) {
            case Globals.KNOWN_GAME_MODES.TFT:
                return renderTFTLobby();
            case Globals.KNOWN_GAME_MODES.ARENA:
                return renderArenaLobby();
            case Globals.KNOWN_GAME_MODES.ARAM:
            case Globals.KNOWN_GAME_MODES.CLASSIC:
            //Use standard lobby as fallback
            // eslint-disable-next-line no-fallthrough
            default:
                return renderDefaultLobby();
        }
    };


    const renderCancelOrReadyButton = () => {
        if (inQueue) {
            return (
                <div className={styles.divCancelGameButton} onClick={() => requestCancelMatchmaking()}>
                    Stop Searching
                </div>
            );
        } else {
            return (
                <div className={styles.divStartGameButton} onClick={() => requestStartMatchmaking()}>
                    Find Match
                </div>
            );
        }
    };

    if (showGamemodeSelector) {
        return (
            <GamemodeSelector onClosed={() => {
                setShowGamemodeSelector(false);
            }}/>);
    }

    return (
        <div className={styles.container}>
            <div className={styles.divTop}></div>
            {
                <div className={styles.lobby_type_display} onClick={() => {
                    setShowGamemodeSelector(true);
                }}>
                    Current Gamemode: {queues[lobby.gameConfig?.queueId]?.description}
                </div>
            }
            <div className={styles.divMiddle}>
                {
                    renderContent()
                }
            </div>
            <div className={styles.divBottom}>
                {
                    renderCancelOrReadyButton()
                }
            </div>
        </div>
    );
}