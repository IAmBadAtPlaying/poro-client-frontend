import {useSelector} from 'react-redux';
import {AppState} from '../store';
import * as Globals from '../Globals';
import styles from '../styles/Application.module.css';
import SocialTab from './Application/SocialTab';
import ActivityReminder from './Application/ActivityReminder';
import BackButton from './Application/BackButton';
import {ContainerState} from '../types/Store';
import ContainerNone from './Application/Containers/ContainerNone';
import ContainerPlay from './Application/Containers/ContainerPlay';
import ContainerProfile from './Application/Containers/ContainerProfile';
import ContainerLoot from './Application/Containers/ContainerLoot';
import ContainerTasks from './Application/Containers/ContainerTasks';
import ContainerCollection from './Application/Containers/ContainerCollection';
import ReadyCheckContainer from './Application/ReadyCheckContainer';
import MusicSystem from './MusicSystem';
import ContainerConfiguration from './Application/Containers/ContainerConfiguration';

export default function Application() {

    const champions = useSelector((state: AppState) => state.ownedChampions);
    const gameflowState = useSelector((state: AppState) => state.gameflowState);
    const selfPresence = useSelector((state: AppState) => state.selfPresence);
    const patcherState = useSelector((state: AppState) => state.patcherState);
    const lobbyState = useSelector((state: AppState) => state.lobbyState);
    const lootState = useSelector((state: AppState) => state.lootState);
    const mapAssets = useSelector((state: AppState) => state.mapAssets);
    const invitations = useSelector((state: AppState) => state.invitations);
    const tickerMessages = useSelector((state: AppState) => state.tickerMessages);
    const friends = useSelector((state: AppState) => state.friends);
    const activeContainer = useSelector((state: AppState) => state.activeContainer);
    const allDataLoaded = useSelector((state: AppState) => state.allDataLoaded);

    const renderContainer = () => {
        switch (activeContainer.container) {
            case ContainerState.COLLECTION:
                return <ContainerCollection/>;
            case ContainerState.TASKS:
                return <ContainerTasks/>;
            case ContainerState.PLAY:
                return <ContainerPlay/>;
            case ContainerState.LOOT:
                return <ContainerLoot/>;
            case ContainerState.PROFILE:
                return <ContainerProfile/>;
            case ContainerState.CONFIG:
                return <ContainerConfiguration/>;
            case ContainerState.NONE:
            default:
                return <ContainerNone/>;
        }
    };

    const renderReadyCheck = () => {
        if (gameflowState?.phase === Globals.GAMEFLOW_READY_CHECK) {
            return (
                <ReadyCheckContainer/>
            );
        }

        return <></>;
    };

    MusicSystem();

    return (
        <div className={styles.container}>
            <BackButton/>
            <SocialTab/>
            <ActivityReminder/>
            <div className={styles.content}>
                {renderContainer()}
            </div>
            {
                renderReadyCheck()
            }
        </div>
    );
}