import * as Globals from "../../globals.js";
import styles from '../../styles/backgrounds/CustomBackground.module.css';

export default function CustomBackground({backgroundType, background, backgroundFileExtension, filterOpacity}) {

    const createType = (primaryType, fileExtension) => {
        return primaryType + "/" + fileExtension;
    }

    const acknowledgeError = (target) => {
        console.error("Failed to load background!");
        console.log("Tried to load " + target.src);
        target.style.display='none';
    }

    const renderBackgroundContainer = () => {
        switch (backgroundType) {
            case Globals.BACKGROUND_TYPE_IMAGE:
                return (
                    <img src={Globals.CONFIG_USER_BACKGROUND_IMAGE + "." + backgroundFileExtension} alt="" className={styles.backgroundImage} onError={() => {acknowledgeError(this)}}/>
                )
            case Globals.BACKGROUND_TYPE_VIDEO:
                return (
                    <video autoPlay muted loop className={styles.backgroundVideo}>
                        <source src={Globals.CONFIG_USER_BACKGROUND_VIDEO + "." + backgroundFileExtension} type={createType("video", backgroundFileExtension)} onError={() => {acknowledgeError(this)}}/>
                    </video>
                )
            case Globals.BACKGROUND_TYPE_LCU_IMAGE:
                return (
                    <img src={Globals.PROXY_STATIC_PREFIX + background} alt="" className={styles.backgroundImage} onError={() => {acknowledgeError(this)}}/>
                )
            case Globals.BACKGROUND_TYPE_LCU_VIDEO:
                return (
                    <video autoPlay={true} muted={true} loop={true} className={styles.backgroundVideo} onError={() => {acknowledgeError(this)}}>
                        <source src={Globals.PROXY_STATIC_PREFIX + background} type={createType("video",  backgroundFileExtension)}/>
                    </video>
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