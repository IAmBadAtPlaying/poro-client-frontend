import styles from "../../styles/config/ShutdownControl.module.css";


export default function ShutdownControl() {
    const shutdownPoroClient = () => {

    }

    const shutdownPoroAndLeagueClient = () => {

    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                Poro Client Shutdown Control
            </div>
            <div className={styles.controls}>
                <div className={styles.singleControl} onClick={() => {}}>
                    Shutdown Poro Client
                </div>
                <div></div>
            </div>
        </div>
        )

}