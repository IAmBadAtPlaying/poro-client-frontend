import styles from "../../styles/config/ShutdownControl.module.css";
import * as Globals from "../../globals";
import axios from "axios";
import {useRef} from "react";


export default function ShutdownControl() {

    const normalShutdownButton = useRef();
    const completeShutdownButton = useRef();

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
                <div className={styles.singleControl} onClick={shutdownPoroClient} ref={normalShutdownButton}>
                    Shutdown Poro Client
                </div>
                <div className={styles.singleControl} onClick={shutdownPoroAndLeagueClient} ref={completeShutdownButton}>
                    Shutdown Poro Client and League Client
                </div>
            </div>
        </div>
        )

}