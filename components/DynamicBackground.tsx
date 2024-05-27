import {useEffect, useState} from 'react';
import * as Globals from '../Globals';
import styles from '../styles/DynamicBackground.module.css';
import axios from 'axios';


enum ClientBackgroundType {
    LOCAL_IMAGE = Globals.BACKGROUND_TYPE_IMAGE,
    LOCAL_VIDEO = Globals.BACKGROUND_TYPE_VIDEO,
    LCU_IMAGE = Globals.BACKGROUND_TYPE_LCU_IMAGE,
    LCU_VIDEO = Globals.BACKGROUND_TYPE_LCU_VIDEO
}

interface BackgroundInfo {
    backgroundType: ClientBackgroundType,
    background: string,
    backgroundContentType: string,
}

export default function DynamicBackground() {

    const [backgroundInfo, setBackgroundInfo] = useState<BackgroundInfo>();

    useEffect(
        () => {
            axios.get(Globals.REST_PREFIX + '/config/background/info')
                .then((response) => {
                    console.log(response.data);
                    const backgroundInfo: BackgroundInfo = response.data as BackgroundInfo;
                    setBackgroundInfo(backgroundInfo);
                })
                .catch((error) => {
                    console.error(error);
                });
        },
        []
    );

    const renderLCUVideo = () => {
        return (
            <></>
        );
    };

    const renderLCUImage = () => {
        return (
            <></>
        );
    };

    const renderLocalVideo = () => {
        return (
            <video className={styles.content} autoPlay={true} muted={true} loop={true} disablePictureInPicture={true}>
                <source src={Globals.REST_PREFIX + '/config/background'} type={backgroundInfo?.backgroundContentType}/>
            </video>
        );
    };

    const renderLocalImage = () => {
        return (
            <></>
        );
    };

    const renderContent = () => {
        switch (backgroundInfo?.backgroundType) {
            case ClientBackgroundType.LOCAL_IMAGE:
                return renderLocalImage();
            case ClientBackgroundType.LOCAL_VIDEO:
                return renderLocalVideo();
            case ClientBackgroundType.LCU_IMAGE:
                return renderLCUImage();
            case ClientBackgroundType.LCU_VIDEO:
                return renderLCUVideo();
            default:
                console.log('Unknown background type: ', backgroundInfo?.backgroundType);
                return (<></>);
        }
    };


    return (
        <div className={styles.container} draggable={false}>
            {
                renderContent()
            }
            <div className={styles.filter}></div>
        </div>
    );
}