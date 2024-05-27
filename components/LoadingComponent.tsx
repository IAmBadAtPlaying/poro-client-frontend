import {useSelector} from 'react-redux';
import styles from '../styles/LoadingComponent.module.css';
import * as Globals from '../Globals';
import {AppState} from '../store';
import axios from 'axios';

export default function LoadingComponent() {
    const internalState = useSelector((state: AppState) => state.internalState);

    const requestSearchForLeagueProcess = () => {
        axios.post(Globals.REST_PREFIX + '/status/findProcess')
            .catch((error) => {
                console.error(error);
            });
    };

    const renderAwaitLCUInit = () => {
        return (<p>
            Waiting for League Plugins to load...
        </p>);
    };
    const renderDisconnected = () => {
        return (
            <p>The Poro-Client has lost connection to the League Client. Please wait a moment...</p>
        );
    };
    const renderNoProcessIdle = () => {
        return (<>
            <p>
                The League client could not be found. <br/>
                Click <a className={styles.clickable_text} onClick={requestSearchForLeagueProcess}>here</a> to search for the League Client.
            </p>
        </>);
    };
    const renderAwaitLeagueProcess = () => {
        return (<>Waiting for League of Legends to start...</>);
    };
    const renderAwaitLCUConnection = () => {
        return (<>Awaiting Connection to the LCU...</>);
    };

    const renderAwaitingBackendConnection = () => {
        return (<>Waiting for the Poro-Client Backend...</>);
    };
    const renderLoadingText = () => {
        switch (internalState?.state) {
            case Globals.BACKEND_STATE_AWAITING_LEAGUE_PROCESS:
                return renderAwaitLeagueProcess();
            case Globals.BACKEND_STATE_NO_PROCESS_IDLE:
                return renderNoProcessIdle();
            case Globals.BACKEND_STATE_AWAITING_LCU_CONNECTION:
                return renderAwaitLCUConnection();
            case Globals.BACKEND_STATE_AWAITING_LCU_INIT:
                return renderAwaitLCUInit();
            case Globals.BACKEND_STATE_DISCONNECTED:
                return renderDisconnected();
            default:
                return renderAwaitingBackendConnection();
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.mainInformation}>
                <div className={styles.loadingGif}>
                    <img src={Globals.STATIC_PREFIX + '/assets/gifs/Poro.gif'} alt={'Please restart the application'} className={styles.loadingGif}/>
                </div>
                <div className={styles.loadingText} draggable={false}>
                    {
                        renderLoadingText()
                    }
                </div>
            </div>
        </div>
    );
}