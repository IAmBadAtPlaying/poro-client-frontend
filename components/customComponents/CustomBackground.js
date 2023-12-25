
import * as Globals from "../../globals.js";
import styles from '../../styles/backgrounds/CustomBackground.module.css';
import {useEffect, useRef, useState} from "react";

export default function CustomBackground({clientProperties, currentContainer, currentGameflow}) {


    const getFilterOpacity = () => {
        switch (currentContainer) {
            case Globals.CONTAINER_NONE:
                return 0.3;
            default:
                return 0.6;
        }
    }

    const getVolume = () => {
        switch (currentContainer) {
            case Globals.CONTAINER_NONE:
                return 0.5;
            default:
                return getVolumeForGameflow();
        }
    }

    const getVolumeForGameflow = () => {
        switch (currentGameflow) {
            case Globals.GAMEFLOW_RECONNECT:
            case Globals.GAMEFLOW_GAME_START:
            case Globals.GAMEFLOW_IN_PROGRESS:
                return 0.0;
            default: return 0.2;
        }
    }

    const setVolume = () => {
        if (!videoRef.current) return;
        videoRef.current.volume = getVolume();
    }

    let [filterOpacity, setFilterOpacity] = useState(getFilterOpacity());
    useEffect(() => {
        setFilterOpacity(getFilterOpacity());
        setVolume();
    }, [currentContainer, currentGameflow]);

    useEffect(() => {
     setVolume();
    });

    const videoRef = useRef(undefined);

    if (!clientProperties) return <></>;

    let backgroundType = clientProperties.clientBackgroundType;
    let background= clientProperties.clientBackground;

    let backgroundContentType = clientProperties.clientBackgroundContentType;

    if (backgroundContentType === undefined) return <></>;

    let backgroundFileExtension = backgroundContentType.split("/")[1];

    const createType = (primaryType, fileExtension) => {
        return primaryType + "/" + fileExtension;
    }

    const acknowledgeError = (target) => {
        if (!target) return;
        console.error("Failed to load background!");
        console.log("Tried to load " + target.src);
        target.style.display='none';
    }


    const renderBackgroundContainer = () => {
        switch (backgroundType) {
            case Globals.BACKGROUND_TYPE_IMAGE:
                return (
                    <img src={Globals.CONFIG_USER_BACKGROUND} alt="" className={styles.backgroundImage} onError={(event) => {acknowledgeError(event.target)}}/>
                )
            case Globals.BACKGROUND_TYPE_VIDEO:
                return (
                    <>
                        <video autoPlay={true} muted={false} loop={true} className={styles.backgroundVideo} ref={videoRef} onError={() => {acknowledgeError(this)}}>
                            <source src={Globals.CONFIG_USER_BACKGROUND} type={createType("video", backgroundFileExtension)} />
                        </video>
                    </>

                )
            case Globals.BACKGROUND_TYPE_LCU_IMAGE:
                return (
                    <img src={Globals.PROXY_STATIC_PREFIX + background} alt="" className={styles.backgroundImage} onError={() => {acknowledgeError(this)}}/>
                )
            case Globals.BACKGROUND_TYPE_LCU_VIDEO:
                return (
                    <>
                        <video autoPlay={true} muted={true} loop={true} className={styles.backgroundVideo} ref={videoRef} onError={(event) => {acknowledgeError(event.target)}}>
                            <source src={Globals.PROXY_STATIC_PREFIX + background} type={createType("video",  backgroundFileExtension)}/>
                        </video>
                    </>
                )
            case Globals.BACKGROUND_TYPE_NONE:
            default:
                return (
                    <></>
                )
        }
    }


    return (
        <div className={styles.container}>
            <div className={styles.filter} style={{opacity: filterOpacity}}/>
            {renderBackgroundContainer()}
        </div>
    )
}