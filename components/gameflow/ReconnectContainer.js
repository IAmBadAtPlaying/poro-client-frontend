import styles from "../../styles/gameflow/ReconnectContainer.module.css";
import {axiosSend} from "../../pages/indexRework";

export default function ReconnectContainer() {

    const reconnect = () => {
        axiosSend("POST", "/lol-gameflow/v1/reconnect");
    }

    return (
        <div className={styles.reconnectContainer}>
            <div className={styles.reconnectContent}>
                <div className={styles.reconnectSpacer}/>
                <div className={styles.reconnectText}>
                    <div className={styles.reconnectTextTitle}>
                        Your Game is still in progress!
                    </div>
                </div>
                <div className={styles.reconnectButton} onClick={() => {reconnect()}}>
                    RECONNECT
                </div>
                <div className={styles.reconnectSpacer}/>
            </div>
        </div>
    )
}