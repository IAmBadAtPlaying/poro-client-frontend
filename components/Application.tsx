import {useSelector} from 'react-redux';
import {AppState} from '../store';
import styles from '../styles/Application.module.css';
import SocialTab from './Application/SocialTab';
import ActivityReminder from './Application/ActivityReminder';

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

    return (
        <div className={styles.container}>
            <SocialTab/>
            <ActivityReminder/>
        </div>
    );
}