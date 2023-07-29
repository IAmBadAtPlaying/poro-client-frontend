import {useRef} from "react";
import {send} from "../pages";


export default function ProfileContainer() {

    const firstTokenRef = useRef(undefined);
    const secondTokenRef = useRef(undefined);
    const thirdTokenRef = useRef(undefined);
    const titleIdRef = useRef(undefined);
    const bannerConfigRef = useRef(undefined);

    const sendValues = () => {
        if (firstTokenRef === undefined || secondTokenRef === undefined || thirdTokenRef === undefined || titleIdRef === undefined || bannerConfigRef === undefined) return;
        let body = new Object();
        let challengeIds = new Array();
        challengeIds.push(parseInt(firstTokenRef.current.value), parseInt(secondTokenRef.current.value), parseInt(thirdTokenRef.current.value));
        body["challengeIds"] = challengeIds;
        body["bannerAccent"] = bannerConfigRef.current.value;
        body["title"] = titleIdRef.current.value;

        send([0, "POST","/lol-challenges/v1/update-player-preferences", JSON.stringify(body)]);
    }

    const resetAll = () => {
        let challengeIds = new Array();
        let body = new Object();
        challengeIds.push(-1, -1, -1);
        body["challengeIds"] = challengeIds;
        body["bannerAccent"] = "0";
        body["title"] = 0;
    }

    return (
        <div>
            <div>
                <div>Profile Icon + Border</div>
                <div>Name</div>
                <div>Level</div>
            </div>
            <div>
                Token Config
                <div>
                    <input ref={firstTokenRef} type={"number"} placeholder={"First Token ID"}>

                    </input>
                </div>
                <div>
                    <input ref={secondTokenRef} type={"number"} placeholder={"Second Token ID"}>

                    </input>
                </div>
                <div>
                    <input ref={thirdTokenRef} type={"number"} placeholder={"Third Token ID"}>

                    </input>
                </div>
                Title ID
                <div>
                    <input ref={titleIdRef} type={"number"} placeholder={"Title ID"}>

                    </input>
                </div>
            </div>
            Banner Config
            <div>
                <div>
                    <input ref={bannerConfigRef} type={"number"}>

                    </input>
                </div>
            </div>
            <button onClick={() => sendValues()}>Save!</button>
            <button onClick={() => resetAll()}>Reset</button>
        </div>
    )
}