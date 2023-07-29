import {send} from "../pages";

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

    return (
        <>
            <div>
                <div>
                    <button onClick={() => restartClient()}>
                        Restart Client UX
                    </button>
                    <button onClick={() => killUXProcess()}>
                        Kill Client UX
                    </button>
                    <button onClick={() => restartUXProcess()}>
                        Show Client UX
                    </button>
                </div>
                <div>
                    <button onClick={() => send([10, "shutdown"])}>Exit the Poro-Client</button>
                    <button onClick={() => send([10, "shutdown-all"])}>Exit the Poro-Client and League of Legends</button>
                </div>
            </div>
        </>
    )
}