import * as Globals from "../globals";
import {AUDIO_PLAY_BIG_BUTTON} from "../pages";
import styles from "../styles/LobbyGamemodeSelector.module.css";
import {useEffect, useState} from "react";
import CustomChangingImage from "./customComponents/CustomChangingImage";
export default function GamemodeElement({ queue, isActive, setActive, setQueueId, assetMap}) {

    const [activeElement, setActiveElement] = useState(0);

    const getImageLink = (mapKey) => {
        if (!mapKey) return "";
        const assetsForMap = assetMap[mapKey];
        if (!assetsForMap) return "";

        return Globals.PROXY_STATIC_PREFIX + "/"+assetsForMap["game-select-icon-default"];
    }

    const getHoverImageLink = (mapKey) => {
        if (!mapKey) return "";
        const assetsForMap = assetMap[mapKey];
        if (!assetsForMap) return "";

        return Globals.PROXY_STATIC_PREFIX + "/"+assetsForMap["game-select-icon-hover"];
    }

    const getVideoLink = (key) => {
        if (!key) return "";
        const assetsForMap = assetMap[key];
        if (!assetsForMap) return "";

        return Globals.PROXY_STATIC_PREFIX + "/"+ assetsForMap["game-select-icon-active-video"];
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

    if (assetMap === undefined) return <></>;

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
                                poster={getImageLink(queue[0].mapId)}
                                className={styles.gamemodeSelectorIconVideo}
                                style={{display: `${isActive ? 'inline' : 'none'}`}}
                            >
                                <source
                                    type="video/webm"
                                    src={getVideoLink(queue[0].mapId)}
                                />
                            </video>
                            <CustomChangingImage defaultImageSrc={getImageLink(queue[0].mapId)} hoverImageSrc={getHoverImageLink(queue[0].mapId)} imageClassName={styles.gamemodeSelectorIcon} imageStyle={{display: `${isActive ? 'none': 'inline'}`}}/>
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