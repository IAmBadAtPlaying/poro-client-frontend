import {useEffect, useState} from "react";
import axios from "axios";
import * as Globals from "../globals.js";
import Image from "next/image";
import styles from "../styles/Collection.module.css";

export default function Collection({skinsByChampion}) {
    const COLLECTION_SKINS = "skins";
    const COLLECTION_CHAMPIONS = "champions";
    const COLLECTION_ICONS = "icons";
    const COLLECTION_EMOTES = "emotes";

    const [collectionTab, setCollectionTab] = useState(COLLECTION_CHAMPIONS);
    const [playerSkins, setPlayerSkins] = useState(skinsByChampion);

    const [emotes, setEmotes] = useState({});
    const [playerEmotes, setPlayerEmotes] = useState([]);

    useEffect(() => {
        // fetchAllSkinInfo();
        fetchPlayerSkins();
    }, []);

    // const fetchAllSkinInfo = () => {
    //     axios.get(Globals.PROXY_STATIC_PREFIX + "/lol-game-data/assets/v1/skins.json")
    //         .then((response) => {
    //             setSkins(response.data);
    //         })
    //         .catch((error) => {
    //             console.log(error);
    //         });
    // }

    const fetchPlayerSkins = () => {
        axios.get(Globals.PROXY_PREFIX + "/lol-inventory/v2/inventory/CHAMPION_SKIN")
            .then((response) => {
                let intermediateSkins = skinsByChampion;
                response.data.forEach((ownedItem) => {
                    if (!ownedItem.itemId) return;
                    const skinId = ownedItem.itemId.toString();
                    const championId = skinId.substring(0, skinId.length - 3);

                    if (intermediateSkins[championId] === undefined) return;
                    if (intermediateSkins[championId][skinId] === undefined) return;
                    intermediateSkins[championId][skinId].owned = true;
                })
                setPlayerSkins(intermediateSkins);
            });
    }

    const fetchAllEmoteInfo = () => {
        axios.get(Globals.PROXY_STATIC_PREFIX + "/lol-game-data/assets/v1/summoner-emotes.json")
            .then((response) => {
                let emoteArray = response.data;
                let emoteObject = {};
                for (let emote of emoteArray) {
                    emoteObject[emote.itemId] = emote;
                }
                setEmotes(emoteObject);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const renderCollectionTab = () => {
        switch (collectionTab) {
            // case COLLECTION_CHAMPIONS:
            //     return renderChampionCollection();
            case COLLECTION_SKINS:
                return renderSkinCollection();
            default:
                return <></>;
        }
    }


    const getSkinInfoClass = (skin, skinId) => {
        if (skinId.toString().endsWith("000") || skin.owned) {
            return styles.skinInfoOwned;
        }

        return styles.skinInfoNotOwned;
    }

    const renderChampionCollection = () => {
        return (
            <div className={styles.collectionFlexContainer}>

            </div>
        )
    }

    const getOwnedCount = (skins) => {
        let ownedCount = 0;
        Object.values(skins).forEach((skin) => {
            if (skin.owned || skin.isBase) ownedCount++;
        });
        return ownedCount;
    }

    const renderSkinCollection = () => {
        return (
            <div className={styles.collectionFlexContainer}>
                {
                    Object.entries(playerSkins).sort(([championIdA, skinsA], [championIdB, skinsB]) => {
                        return skinsA[championIdA + "000"].name.localeCompare(skinsB[championIdB + "000"].name);
                    }).map(([championId, skins], index) => {
                        console.log(skins[championId + "000"]);
                        return (
                            <div key={"Champion-" + index} className={styles.singleChampionSection}>
                                <div className={styles.singleChampionHeader}>
                                    {
                                        skins[championId + "000"].name
                                    }
                                    &nbsp;-&nbsp;
                                    {
                                        getOwnedCount(skins)
                                    }
                                    /
                                    {
                                        Object.values(skins).length
                                    }
                                </div>
                                <div className={styles.singleChampionSkins}>
                                    {
                                        Object.entries(skins).map(([skinId, skin], skinIndex) => {
                                            // if (!skin.owned)
                                            //     return <slot key={"Skin-" + skinIndex}></slot>;

                                            return (
                                                <div key={"Skin-" + skinIndex} className={styles.singleEntry} onClick={() => {
                                                    window.open(Globals.PROXY_PREFIX + skin.uncenteredSplashPath, "_blank")
                                                }}>
                                                    <div className={getSkinInfoClass(skin, skinId)}>
                                                        <div className={styles.skinInfoName}>
                                                            {skin.name}
                                                        </div>
                                                    </div>
                                                    {
                                                        skin.splashVideoPath == null ? (
                                                                <div className={styles.entryImageContainer}>
                                                                    <Image loading={"lazy"}
                                                                           src={Globals.PROXY_STATIC_PREFIX + skin.loadScreenPath}
                                                                           fill
                                                                    />
                                                                </div>
                                                            ) :
                                                            <div className={styles.entryImageContainer}>
                                                                <video autoPlay={true} loop={true} muted={true} playsInline={true} preload={"auto"} className={styles.entryVideo}>
                                                                    <source src={Globals.PROXY_STATIC_PREFIX + skin.splashVideoPath} type="video/webm"/>
                                                                </video>
                                                            </div>
                                                    }
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        )
    }


    return (
        <div className={styles.container}>
            <div className={styles.containerSelectorContainer}>
                <button onClick={() => {
                    setCollectionTab(COLLECTION_SKINS)
                }}>Skins
                </button>
                <button onClick={() => {
                    setCollectionTab(COLLECTION_CHAMPIONS)
                }}>Champions
                </button>
                <button onClick={() => {
                    setCollectionTab(COLLECTION_ICONS)
                }}>Icons
                </button>
                <button onClick={() => {
                    setCollectionTab(COLLECTION_EMOTES)
                }}>Emotes
                </button>
            </div>
            <div className={styles.collectionWrapper}>
                <div className={styles.collectionTransitionTop}/>
                <div className={styles.collectionContainer}>
                    {
                        renderCollectionTab()
                    }
                </div>
                <div className={styles.collectionTransitionBottom}/>
            </div>

        </div>
    )

}
