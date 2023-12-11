import PatcherStatus from "./PatcherStatus";
import styles from "../../styles/config/ReworkedConfigContainer.module.css"
import UIControl from "./UIControl";
import ShutdownControl from "./ShutdownControl";
import BackgroundUpload from "./BackgroundUpload";

export default function ReworkedConfigContainer({patcherStatus}) {
    return (
        <div className={styles.container}>
            <div className={styles.header}>Configuration</div>
            <div className={styles.content}>
                <div className={styles.singleContent}>
                    <UIControl/>
                </div>
                <div className={styles.singleContent} style={{height: "20%"}}>
                    <PatcherStatus patcherStatus={patcherStatus}/>
                </div>
                <div className={styles.singleContent}>
                    <ShutdownControl/>
                </div>
                <div className={styles.singleContent}>
                    <BackgroundUpload/>
                </div>
            </div>
        </div>
    )
}