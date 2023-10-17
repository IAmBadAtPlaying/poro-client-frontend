import * as Globals from "../globals";
import {AUDIO_PLAY_BIG_BUTTON} from "../pages/index";
import styles from "../styles/LobbyGamemodeSelector.module.css";
import {useEffect, useState} from "react";
export default function GamemodeElement({ queue, isActive, setActive, setQueueId }) {

    const [activeElement, setActiveElement] = useState(0);

    const getImageLink = (key) => {
        if (!key) return "";
        switch (key.toLowerCase()) {
            /*Solid naming scheme rito*/
            case "cherry":
                return Globals.PROXY_STATIC_PREFIX + "/lol-game-data/assets/content/src/leagueclient/gamemodeassets/gamemodex/img/icon-empty.png";
            break;
            case "classic":
                return Globals.PROXY_STATIC_PREFIX + "/lol-game-data/assets/content/src/leagueclient/gamemodeassets/classic_sru/img/icon-empty.png";
            break;
            default:
                return Globals.PROXY_STATIC_PREFIX + "/lol-game-data/assets/content/src/leagueclient/gamemodeassets/"+key+"/img/icon-empty.png";
            break;
        }
    }

    const getVideoLink = (key) => {
        if (!key) return "";
        switch (key.toLowerCase()) {
            case "cherry":
                return Globals.PROXY_STATIC_PREFIX + "/lol-game-data/assets/content/src/leagueclient/gamemodeassets/gamemodex/video/game-select-icon-active.webm";
            break;
            case "classic":
                return Globals.PROXY_STATIC_PREFIX + "/lol-game-data/assets/content/src/leagueclient/gamemodeassets/classic_sru/video/game-select-icon-active.webm";
            break;
            default:
                return Globals.PROXY_STATIC_PREFIX + "/lol-game-data/assets/content/src/leagueclient/gamemodeassets/"+key+"/video/game-select-icon-active.webm";
            break;
        }
    }

    const handleClick = () => {
        if (isActive) return;
        setActive(queue[0].gameMode);
        AUDIO_PLAY_BIG_BUTTON();
    };

    const sendQueueId = (id, index) => {
        AUDIO_PLAY_BIG_BUTTON();
        console.log(id);
        console.log(index);
        setQueueId(id);
        setActiveElement(index);
    };

    useEffect(() => {
        if (isActive) {
            setQueueId(queue[0].id);
            setActiveElement(0);
        }
    }, [isActive]);

    return (
        <div className={styles.gamemodeSelectorElement}>
            <div className={styles.gamemodeSelectorIconContainer} onClick={handleClick}>
                {
                    (queue[0].gameMode === undefined || queue[0].gameMode === "") ? <></> :
                        <> {
                            /*This method works better than just replacing it via react*/
                        }
                            <video
                                autoPlay={true}
                                loop={true}
                                muted={true}
                                preload={"auto"}
                                className={styles.gamemodeSelectorIconVideo}
                                style={{display: `${isActive ? 'inline' : 'none'}`}}
                            >
                                <source
                                    type="video/webm"
                                    src={getVideoLink(queue[0].gameMode)}
                                />
                            </video>
                            <img
                                alt="Img"
                                src={getImageLink(queue[0].gameMode)}
                                className={styles.gamemodeSelectorIcon}
                                draggable={false}
                                style={{display: `${isActive ? 'none': 'inline'}`}}
                            />
                        </>

                }
            </div>
            <div className={styles.gamemodeSelectorHeader}>
                {queue[0].category}
                <br />
                {queue[0].gameMode}
            </div>
            <div className={styles.gamemodeDescription}>

            </div>
            {isActive ? (
                <div className={styles.additionalOptionsContainer}>
                {Object.values(queue).map((subCategory, index) => {
                        return (
                            <div key={subCategory.id} className={(index === activeElement) ? styles.activeAdditionalOptions : styles.additionalOptions} onClick={() => {sendQueueId(subCategory.id, index)}}>
                                <span>{subCategory.description}</span>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <></>
            )}
        </div>
    );
}