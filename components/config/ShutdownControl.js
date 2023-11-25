import styles from "../../styles/config/ShutdownControl.module.css";
import * as Globals from "../../globals";
import axios from "axios";


export default function ShutdownControl() {
    const shutdownPoroClient = () => {
        const body = {
            type: "shutdown"
        }
        axios.post(Globals.REST_PREFIX+"/shutdown", JSON.stringify(body)).catch(
            (error) => {
                console.log(error);
            }
        );
    }

    const shutdownPoroAndLeagueClient = () => {
        const body = {
            type: "shutdown-all"
        }
        axios.post(Globals.REST_PREFIX+"/shutdown", JSON.stringify(body)).catch(
            (error) => {
                console.log(error);
            }
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                Poro Client Shutdown Control
            </div>
            <div className={styles.controls}>
                <div className={styles.singleControl} onClick={shutdownPoroClient}>
                    Shutdown Poro Client
                </div>
                <div className={styles.singleControl} onClick={shutdownPoroAndLeagueClient}>
                    Shutdown Poro Client and League Client
                </div>
            </div>
        </div>
        )

}