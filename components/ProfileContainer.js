import {useRef, useState} from "react";
import {axiosSend, send} from "../pages/indexRework";
import * as Globals from "../globals";
import styles from "../styles/ProfileContainer.module.css";
import FriendMessageWindow from "./messaging/FriendMessageWindow";


export default function ProfileContainer() {

    const firstTokenRef = useRef(undefined);
    const secondTokenRef = useRef(undefined);
    const thirdTokenRef = useRef(undefined);
    const titleIdRef = useRef(undefined);
    const crestBorderLevelRef = useRef(undefined);
    const bannerConfigRef = useRef(undefined);
    const crestTypeRef = useRef(undefined);
    const profileIconIdRef = useRef(undefined);
    const profileIconOverrideRef = useRef(undefined);

    const [runesOpen, setRunesOpen] = useState(true);



    const sendValues = () => {
        console.log("Sending values");
        console.log("Fist Token: " + firstTokenRef.current.value);
        console.log("Second Token: " + secondTokenRef.current.value);
        console.log("Third Token: " + thirdTokenRef.current.value);
        console.log("Title ID: " + titleIdRef.current.value);
        console.log("Crest Border Level: " + crestBorderLevelRef.current.value);
        console.log("Crest Type: " + crestTypeRef.current.value);
        console.log("Banner Config: " + bannerConfigRef.current.value);
        console.log("Profile Icon ID: " + profileIconIdRef.current.value);
        if (firstTokenRef === undefined || secondTokenRef === undefined || thirdTokenRef === undefined || titleIdRef === undefined || crestBorderLevelRef === undefined || bannerConfigRef === undefined || crestTypeRef === undefined || profileIconIdRef === undefined) return;
        handleBannerConfigChange(crestBorderLevelRef.current.value, crestTypeRef.current.value);
        handleProfileIconChange(profileIconIdRef.current.value, profileIconOverrideRef.current.value);
        handleTokenChange(firstTokenRef.current.value, secondTokenRef.current.value, thirdTokenRef.current.value, titleIdRef.current.value, bannerConfigRef.current.value);
    }

    const handleTokenChange = (firstToken, secondToken, thirdToken, titleId, bannerConfig) => {
        if (firstToken === undefined || secondToken === undefined || thirdToken === undefined || titleId === undefined || bannerConfig === undefined) return;
        let body = new Object();
        let challengeIds = new Array();
        if (firstToken !== "" && secondToken !== "" && thirdToken !== "") {
            challengeIds.push(parseInt(firstToken), parseInt(secondToken), parseInt(thirdToken));
            body["challengeIds"] = challengeIds;
        }
        if (bannerConfig !== "") {
            body["bannerAccent"] = bannerConfig;
        }
        if (titleId !== "") {
            body["title"] = titleId;
        }
        if (Globals.isJsonObjectEmpty(body)) return;
        axiosSend("POST", "/lol-challenges/v1/update-player-preferences", JSON.stringify(body));
    }

    const handleBannerConfigChange = (crestBorderLevel, borderType) => {
        if (crestBorderLevel === undefined || borderType === undefined) return;
        let body = new Object();
        body["preferredBannerType"] = "blank";
        body["preferredCrestType"] = borderType;
        body["selectedPrestigeCrest"] = parseInt(crestBorderLevel);


        axiosSend("PUT", "/lol-regalia/v2/current-summoner/regalia", JSON.stringify(body));
    }

    const handleProfileIconChange = (profileIconId, iconOverride) => {
        if (profileIconId === undefined || iconOverride === undefined) return;
        let body = new Object();
        switch (iconOverride) {
            case "chatOverride":
                body["icon"] = parseInt(profileIconId);

                axiosSend("PUT", "/lol-chat/v1/me", JSON.stringify(body));
                break;
            case "normal":
            default:
                body["profileIconId"] = parseInt(profileIconId);

                axiosSend("PUT", "/lol-summoner/v1/current-summoner/icon", JSON.stringify(body));
                break;
        }
    }

    const resetAll = () => {
        let challengeIds = new Array();
        let body = new Object();
        challengeIds.push(-1, -1, -1);
        body["challengeIds"] = challengeIds;
        body["bannerAccent"] = "";
        body["title"] = "";
        body["prestigeCrestLevel"] = 0;

        axiosSend("POST", "/lol-challenges/v1/update-player-preferences", JSON.stringify(body));
    }

    return (
        <div style={{border: "red solid 2px", height: "100%"}}>
            <div className={styles.optionsContainer}>
                <div>
                    <div>Profile Icon + Border</div>
                    <div>Name</div>
                    <div>Level</div>
                </div>
                <div>
                    Profile Icon ID
                    <div>
                        <input ref={profileIconIdRef} type={"number"} placeholder={"Profile Icon ID"}>

                        </input>
                    </div>
                    <div>
                        <select ref={profileIconOverrideRef}>
                            <option value={"normal"} defaultValue={true}>Normal</option>
                            <option value={"chatOverride"}>Chat Override</option>
                        </select>
                    </div>
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
                    <div>
                        <input ref={crestBorderLevelRef} type={"number"} placeholder={"Prestige Crest Level"}>

                        </input>
                    </div>
                    <div>
                        <select ref={crestTypeRef}>
                            <option value={"prestige"} defaultValue={true}>Level</option>
                            <option value={"ranked"}>Ranked</option>
                        </select>
                    </div>
                </div>
                Banner Config
                <div>
                    <div>
                        <input ref={bannerConfigRef} type={"number"} placeholder={"Banner ID"}>

                        </input>
                    </div>
                </div>
                <button onClick={() => sendValues()}>Save!</button>
                <button onClick={() => resetAll()}>Reset</button>
            </div>
            {/*<div>*/}
            {/*    <div className={styles.container}>*/}
            {/*        <div className={styles.previewContainer}>*/}
            {/*            <div className={styles.profileImageContainer}>*/}
            {/*                <img className={styles.profileImage} src={Globals.PROXY_PREFIX + "/lol-game-data/assets/v1/profile-icons/4025.jpg"} alt={"Test"}/>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}
        </div>
    )
}