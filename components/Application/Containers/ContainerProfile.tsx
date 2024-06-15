import styles from '../../../styles/Application/Containers/ContainerProfile.module.css';
import {useSelector} from 'react-redux';
import {AppState} from '../../../store';
import {useEffect} from 'react';

export default function ContainerProfile() {

    const presence = useSelector((state: AppState) => state.selfPresence);
    //TODO: Fetch background image
    //TODO: Fetch banner image
    //TODO; Get Challenge Level

    useEffect(
        () => {
            if (!presence) return;
            const previewSpaceElement = document.querySelector(`.${styles.previewSpace}`) as HTMLDivElement;
            const crystalLevel = presence?.lol.challengeCrystalLevel?.toLowerCase();
            if (previewSpaceElement && crystalLevel) {
                console.log(crystalLevel);
                previewSpaceElement.style.setProperty('--crystal-level-url', `url("http://localhost:35199/static/assets/png/challenges/crystals/${crystalLevel}.png")`);
            }
        },
        [presence?.lol.challengeCrystalLevel]
    );

    return (
        <div className={styles.previewSpace}>
            <div className={styles.backgroundImageContainer}>
                <img className={styles.coverImage}
                     src="http://127.0.0.1:35199/proxy/lol-game-data/assets/ASSETS/Characters/Ahri/Skins/Skin76/Images/ahri_splash_centered_76.jpg"
                     alt="background image"/>
                <div className={styles.backgroundImageFilter}>
                </div>
            </div>
            <div className={styles.bannerArea}>
                <div className={styles.bannerImageContainer}>
                    <img className={styles.bannerImage}
                         src="http://127.0.0.1:35199/proxy/lol-game-data/assets/ASSETS/Regalia/BannerSkins/sf2023.png"/>
                </div>
                <div className={styles.banner}>
                    <div className={styles.spacer}></div>
                    <div className={styles.levelProgress}>
                        <div className={styles.levelText}>
                            Level {presence.lol.level}
                        </div>
                    </div>
                    <div className={styles.profileSection}>
                        <div className={styles.profileContainer}>
                            <div className={styles.profileIcon}>
                                {/*<div class="prestigeRegalia"></div>*/}
                                <div className={styles.rankedRegalia}>
                                    <video className={styles.rankedRegaliaVideo} autoPlay loop muted>
                                        <source
                                            src="http://127.0.0.1:35199/static/assets/webm/regalia/emblem-wings-magic-gold.webm"
                                            type="video/webm"/>
                                    </video>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.nameSection}>
                        <div className={styles.nameWrapper}>
                            {presence.gameName}
                        </div>
                    </div>
                    <div className={styles.tokenSection}>
                        <div className={styles.tokenWrapper}>
                            <div className={styles.tokenTitle}>
                                Poroyalty
                            </div>
                            <div className={styles.tokens}>
                                <div className={styles.singleToken}>
                                    <img draggable="false" className={styles.tokenImage}
                                         src="http://localhost:35199/proxy/lol-game-data/assets/ASSETS/Challenges/Config/504004/Tokens/iron.png"></img>
                                </div>
                                <div className={styles.singleToken}>
                                    <img draggable="false" className={styles.tokenImage}
                                         src="http://localhost:35199/static/assets/png/challenges/background.png"></img>
                                </div>
                                <div className={styles.singleToken}>
                                    <img draggable="false" className={styles.tokenImage}
                                         src="http://localhost:35199/proxy/lol-game-data/assets/ASSETS/Challenges/Config/504004/Tokens/iron.png"></img>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}