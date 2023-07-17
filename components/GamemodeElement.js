import * as Globals from "../globals";
import {AUDIO_PLAY_GENERIC_BUTTON} from "../pages/index";
import styles from "../styles/LobbyGamemodeSelector.module.css";
import {useEffect, useState} from "react";
export default function GamemodeElement({ gamemode, isActive, setActive, setQueueId}) {

    const [activeElement, setActiveElement] = useState(0);

    const handleClick = () => {
        if (isActive) return;
        setActive(gamemode[0]);
        AUDIO_PLAY_GENERIC_BUTTON();
    };

    const sendQueueId = (id, index) => {
        AUDIO_PLAY_GENERIC_BUTTON();
        console.log(id);
        setQueueId(id);
        setActiveElement(index);
    };


    useEffect(() => {
        //TODO: This is way to complicated, rework structure
        if (isActive) {
            if (gamemode[2]) {
                if (gamemode[2][0]) {
                    if (gamemode[2][0][0]) {
                        setQueueId(gamemode[2][0][0]);
                    }
                }
            }

        }
    }, [isActive]);

    return (
        <div className={styles.gamemodeSelectorElement}>
            <div className={styles.gamemodeSelectorIconContainer} onClick={handleClick}>
                {/*This Somehow works better, I guess due to the preloading*/}
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
                            src={
                                Globals.PROXY_STATIC_PREFIX +
                                `/lol-game-data/assets/content/src/leagueclient/gamemodeassets/${gamemode[0]}/video/game-select-icon-active.webm`
                            }
                        />
                    </video>
                    <img
                        alt="Img"
                        src={
                            Globals.PROXY_STATIC_PREFIX +
                            `/lol-game-data/assets/content/src/leagueclient/gamemodeassets/${gamemode[0]}/img/game-select-icon-default.png`
                        }
                        className={styles.gamemodeSelectorIcon}
                        draggable={false}
                        style={{display: `${isActive ? 'none': 'inline'}`}}
                    />
            </div>
            <div className={styles.gamemodeSelectorHeader}>
                5v5
                <br />
                {gamemode[1]}
            </div>
            <div className={styles.gamemodeDescription}>
                {gamemode[4]}
            </div>
            {isActive ? (
                <div className={styles.additionalOptionsContainer}>
                {Object.values(gamemode[2]).map((subCategory, index) => {
                        return (
                            <div key={subCategory[0]} className={(index === activeElement) ? styles.activeAdditionalOptions :styles.additionalOptions} onClick={() => {sendQueueId(subCategory[0], index)}}>
                                <span>{subCategory[1]}</span>
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