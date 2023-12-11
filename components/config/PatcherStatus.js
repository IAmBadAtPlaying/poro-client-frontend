import styles from "../../styles/config/PatcherStatus.module.css"

export default function PatcherStatus({patcherStatus}) {

    const renderSingleComponent = (component, index) => {
        if (!component) return <div key={"Key-" + index}></div>;

        const action = component.action;
        const id = component.id;
        const isCorrupted = component.isCorrupted;
        const isUpToDate = component.isUpToDate;
        const isUpdateAvailable = component.isUpdateAvailable;
        const progress = component.progress;
        const timeOfLastUpToDateCheckISO8601 = component.timeOfLastUpToDateCheckISO8601;

        if (progress == null) return (<div key={"Key-" + index}></div>);

        const progressNetwork = progress.network;
        const progressPrimaryWork = progress.primaryWork;
        const progressTotal = progress.total;

        const networkingBytesComplete = progressNetwork.bytesComplete;
        const networkingBytesPerSecond = progressNetwork.bytesPerSecond;
        const networkingBytesRequired = progressNetwork.bytesRequired;

        const totalBytesComplete = progressTotal.bytesComplete;
        const totalBytesPerSecond = progressTotal.bytesPerSecond;
        const totalBytesRequired = progressTotal.bytesRequired;

        const networkMBPerSecond = (networkingBytesPerSecond/1_000_000).toFixed(2);
        const networkingMBComplete = (networkingBytesComplete/1_000_000).toFixed(2);
        const networkingMBRequired = (networkingBytesRequired/1_000_000).toFixed(2);

        const networkingPercentComplete = (networkingBytesComplete*100/networkingBytesRequired).toFixed(1);

        const totalMBPerSecond = (totalBytesPerSecond/1_000_000).toFixed(2);
        const totalMBComplete = (totalBytesComplete/1_000_000).toFixed(2);
        const totalMBRequired = (totalBytesRequired/1_000_000).toFixed(2);

        const totalPercentComplete = (totalBytesComplete*100/totalBytesRequired).toFixed(1);


        return (
            <div className={styles.singleComponent} key={component.id}>
                <div className={styles.componentName}>Component {id}</div>
                <div>
                    <div>
                        <div>Primary Work: {progressPrimaryWork}</div>
                        <div>Network: {networkingMBComplete}/{networkingMBRequired} MB ({networkingPercentComplete}%)</div>
                        <div>Total: {totalMBComplete}/{totalMBRequired} MB ({totalPercentComplete}%)</div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <div className={styles.header} title={"Data provided by League Client"}>
              League of Legends Patcher
            </div>
            <div className={styles.statusContainer}>
                <div className={styles.statusChecks}>
                    <div className={styles.singleStatusCheck}>
                        {patcherStatus.isUpdateAvailable ? "❌ Update available" : "✅ No Update Available"}
                    </div>
                    <div className={styles.singleStatusCheck}>
                        {patcherStatus.isCorrupted ? "❌ Corruption detected" : "✅ No corruption detected"}
                    </div>
                    <div className={styles.singleStatusCheck}>
                        {!patcherStatus.isUpToDate ? "❌ Not up-to-Date" : "✅ Up-to-Date"}
                    </div>
                </div>
                <div className={styles.statusDetailed}>
                    {
                        patcherStatus.components.map((component, index) => {
                            return renderSingleComponent(component, index)
                        })
                    }
                </div>
            </div>
        </div>
    )
}