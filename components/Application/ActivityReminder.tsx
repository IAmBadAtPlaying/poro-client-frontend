import styles from '../../styles/Application/ActivityReminder.module.css';
import * as Globals from '../../Globals';
import {useDispatch, useSelector} from 'react-redux';
import {ACTION_SET_ACTIVE_CONTAINER, AppState} from '../../store';
import {ContainerState} from '../../types/Store';

export default function ActivityReminder() {

    const gameflowState = useSelector((state: AppState) => state.gameflowState);
    const activeContainers = useSelector((state: AppState) => state.activeContainer);
    const lobbyState = useSelector((state: AppState) => state.lobbyState);

    const mapAssets = useSelector((state: AppState) => state.mapAssets);

    const dispatch = useDispatch();

    const renderCustomLobbyInfo = () => {
        const team1Members = lobbyState?.gameConfig?.customTeam100;
        const team2Members = lobbyState?.gameConfig?.customTeam200;

        return (<p>
            Custom Game: {team1Members?.length} vs {team2Members?.length}
        </p>);
    };

    const renderNormalLobbyInfo = () => {
        const members = lobbyState?.members;
        const maximumSize = members?.length;
        const presentMembers = members?.filter((member) => member?.puuid).length;

        const mapId = lobbyState?.gameConfig?.mapId;
        const gameModeName = lobbyState?.gameConfig?.gameMode;

        return (
            <>
                {/*<video src={Globals.PROXY_PREFIX + '/'+Globals.getSpecificMapAsset(mapAssets, mapId, gameModeName, '')}*/}
                {/*    autoPlay={true} loop={true} muted={true} style={{height: '100%', width: ''}}>*/}

                {/*</video>*/}
                <p>{presentMembers} / {maximumSize} Member</p>
            </>
        );

    };

    const renderLobbyInfo = () => {
        const isCustom = lobbyState?.gameConfig?.isCustom ?? false;
        if (isCustom) {
            return renderCustomLobbyInfo();
        }

        return renderNormalLobbyInfo();
    };

    const hideContainer = () => {
        return (
            <div className={
                styles.container
            }>
            </div>
        );
    };

    const renderReminderContent = (phase: string) => {
        switch (phase) {
            case Globals.GAMEFLOW_LOBBY:
                return renderLobbyInfo();
            case Globals.GAMEFLOW_END_OF_GAME:
            case Globals.GAMEFLOW_RECONNECT:
            case Globals.GAMEFLOW_PRE_END_OF_GAME:
            case Globals.GAMEFLOW_READY_CHECK:
            case Globals.GAMEFLOW_CHAMP_SELECT:
            case Globals.GAMEFLOW_CHECKED_INTO_TOURNAMENT:
            case Globals.GAMEFLOW_MATCHMAKING:
                return (
                    <p>Phase: {phase}</p>
                );
            default:
                return (
                    <></>
                );
        }
    };

    const renderContent = () => {
        const container = activeContainers?.container;
        const phase = gameflowState?.phase;
        if (phase === Globals.GAMEFLOW_NONE) {
            return hideContainer();
        }
        switch (container) {
            case Globals.CONTAINER_PLAY:
                return hideContainer();
            case Globals.CONTAINER_LOOT:
            case Globals.CONTAINER_COLLECTION:
            case Globals.CONTAINER_TASKS:
            case Globals.CONTAINER_PROFILE:
            case Globals.CONTAINER_CONFIG:
            default:
        }
        return (
            <div className={Globals.applyMultipleStyles(
                styles.container,
                styles.containerShow
            )} onClick={() => {
                dispatch(ACTION_SET_ACTIVE_CONTAINER(ContainerState.PLAY));
            }}>
                <div className={styles.innerContainer}>
                    {
                        renderReminderContent(phase)
                    }
                </div>
            </div>
        );
    };

    return (
        <>
            {
                renderContent()
            }
        </>
    );
}