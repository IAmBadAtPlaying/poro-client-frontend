import styles from "../styles/Config.module.css";
import {send} from "../pages";
import * as Globals from "../globals";

export default function ConfigContainer() {
    const restartClient = () => {
        send([0,"POST","/riotclient/kill-and-restart-ux",""]);
    };

    const killUXProcess = () => {
        send([0,"POST","/riotclient/kill-ux",""]);
    };

    const restartUXProcess = () => {
        send([0,"POST","/riotclient/launch-ux",""]);
    };

    const uploadFile = ()  => {
        const form = document.getElementById("uploadForm");
        const fileInput = document.querySelector('input[type="file"]');
        const file = fileInput.files[0];

        const xhr = new XMLHttpRequest();
        xhr.open("POST", Globals.CONFIG_PREFIX+"/upload", true);

        xhr.upload.onprogress = function (event) {
            if (event.lengthComputable) {
                const percent = (event.loaded / event.total) * 100;
                document.getElementById("status").innerHTML = `Uploading: ${percent.toFixed(2)}%`;
            }
        };

        xhr.onload = function () {
            if (xhr.status === 200) {
                document.getElementById("status").innerHTML = "Upload successful!";
            } else {
                document.getElementById("status").innerHTML = "Upload failed!";
            }
        };

        const formData = new FormData();
        formData.append("jarFile", file);
        xhr.send(formData);
    }

    return (
        <div>
            <div className={styles.clientClickOption}>
                <p>League Client Visibility</p>
                <div className={styles.clientVisibilityOptionsContainer}>
                    <button className={styles.clientVisibilityOption} onClick={() => restartClient()}>
                        Restart Client UX
                    </button>
                    <button className={styles.clientVisibilityOption} onClick={() => killUXProcess()}>
                        Kill Client UX
                    </button>
                    <button className={styles.clientVisibilityOption} onClick={() => restartUXProcess()}>
                        Show Client UX
                    </button>
                </div>
                <p>Exit Options</p>
                <div className={styles.exitOptionsContainer}>
                    <button className={styles.exitOption} onClick={() => send([10, "shutdown"])}>Exit the Poro-Client</button>
                    <button className={styles.exitOption} onClick={() => send([10, "shutdown-all"])}>Exit the Poro-Client and League of Legends</button>
                </div>
            </div>
            <div className={styles.taskUploadContainer}>
                <div>
                    <form id="uploadForm" method="POST" encType="multipart/form-data">
                        <input type="file" accept=".java" name="jarFile"></input>
                        <input type="button" value="Send Jar File" onClick={uploadFile}></input>
                    </form>
                    <div id="status"></div>
                </div>
            </div>
        </div>
    )
}