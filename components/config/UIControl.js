import {axiosSend} from "../../pages/indexRework";
import styles from "../../styles/config/UIControl.module.css"

export default  function UIControl() {

    const restartUX = () => {
        axiosSend("POST", "/riotclient/kill-and-restart-ux", "")
    };

    const killUx = () => {
        axiosSend("POST", "/riotclient/kill-ux", "")
    };

    const launchUx = () => {
        axiosSend("POST", "/riotclient/launch-ux", "")
    };

    const unloadUXProcess = () => {
        axiosSend("POST", "/riotclient/unload", "")
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                League of Legends UI Control
            </div>
            <div className={styles.controls}>
                <div className={styles.singleControl} onClick={() => restartUX()}>
                    Restart UX
                </div>
                <div className={styles.singleControl} onClick={() => launchUx()}>
                    Show UX
                </div>
                <div className={styles.singleControl} onClick={() => killUx()}>
                    Hide UX
                </div>
                <div className={styles.singleControl} onClick={() => {if (window.confirm("Are you sure you want to unload the UX process? Once unloaded LOL requires a full restart")) unloadUXProcess()}}>
                    Unload UX
                </div>
            </div>
        </div>
    )
}