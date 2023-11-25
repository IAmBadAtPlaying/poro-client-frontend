import {isJsonObjectEmpty, PROXY_STATIC_PREFIX} from "../globals";
import {useEffect, useState} from "react";
import styles from "../styles/LootContainer.module.css";
import {send} from "../pages/indexRework";
import Image from "next/image";


export default function LootContainer({loot}) {

    //TODO Cleanup loot, it still contains wards and champion tokens, which are not disenchantable
    //TODO Categories should have to be chosen before display, then set disenchantLoot to just the loot elements;
    //TODO: Make it look better
    //TODO: The loot resets when selecting it into the disenchant container and then back, can be fixed via hard reload, but that's not a good solution.

    const DROP_ORIGIN_INVENTORY = "inventory";
    const DROP_ORIGIN_SELECTION = "selection";

    const LOOT_ALREADY_OWNED = "ALREADY_OWNED";

    const [awaitingDisenchant, setAwaitingDisenchant] = useState(false);

    /*This shouldnt be implemented like this, but if I use a state, it will not update on the first button click, only the the second one.
    Seems to be a react limitation. I am too tired to look into it. But it works for now (doesnt update the UI as it is not a state)
    * */
    let selection = "none";

    const [disenchantLoot, setDisenchantLoot] = useState([]);
    const [displayLoot, setDisplayLoot] = useState([]);

    const resetSelection = () => {
        setDisenchantLoot({});
        setDisplayLoot(filterLoot(loot));
    }

    useEffect(() => {
        return () => {
            console.log("Resetting loot");
            resetSelection();
        }
    }, []);


    useEffect(() => {
        console.log("Loot changed");
        resetSelection();
        setAwaitingDisenchant(false);
    }, [loot]);

    const filterLoot = (passedLoot) => {
        let newLoot = {};
        Object.values(passedLoot).filter(
            (item) => {
                if (item === undefined) return false;
                if (item.itemDesc === undefined) return false;
                if (item.itemDesc === "") return false;
                if (item.lootName.startsWith("CHAMPION_TOKEN")) return false;
                else if (item.displayCategories.toLowerCase() !== selection) return false;
                return true;
            }
        ).forEach((oldItem) => {
            let item = {...oldItem};
            newLoot[item.lootName] = item;
        });
        return newLoot;
    }

    const selectOwnedContent = () => {
        const newDisenchantLoot = {};
        const newDisplayLoot = {};
        Object.values(displayLoot).map((item) => {
            if (item.redeemableStatus === LOOT_ALREADY_OWNED) {
                newDisenchantLoot[item.lootName] = item;
            } else newDisplayLoot[item.lootName] = item;
        });
        setDisplayLoot(newDisplayLoot);
        setDisenchantLoot(newDisenchantLoot);
    };

    const sendDisenchantLoot = () => {
        if (awaitingDisenchant || isJsonObjectEmpty(disenchantLoot)) return;
        let lootToDisenchant = [];
        Object.values(disenchantLoot).forEach((item) => {
            lootToDisenchant.push(item);
        });
        setDisenchantLoot({});
        setAwaitingDisenchant(true);
        send([6, lootToDisenchant]);
    };

    const sendRerollLoot = () => {
        if (awaitingDisenchant || isJsonObjectEmpty(disenchantLoot)) return;
        let lootToDisenchant = [];
        Object.values(disenchantLoot).forEach((item) => {
            lootToDisenchant.push(item);
        });
        setDisenchantLoot({});
        setAwaitingDisenchant(true);
        send([7, lootToDisenchant]);
    }

    const handleDropToDisplay = (event) => {
        event.preventDefault();

        const itemData = event.dataTransfer.getData("text/plain");
        const item = JSON.parse(itemData);

        if (item.origin === DROP_ORIGIN_INVENTORY) {
            return;
        } else delete item.origin;

        const lootName = item.lootName;

        const updatedDisenchantLoot = {...disenchantLoot};
        const originalCount =  disenchantLoot[lootName].count;
        if (originalCount >= 1 ) {
            delete updatedDisenchantLoot[lootName];
        } else return;
        setDisenchantLoot(updatedDisenchantLoot);

        const updatedLoot = {...displayLoot};
        if (displayLoot[lootName] === undefined) {
            item.count = originalCount;
            updatedLoot[lootName] = item;
        } else {
            updatedLoot[lootName].count += originalCount;
        }
        setDisplayLoot(updatedLoot);
    }

    const handleDropToDisenchant = (event) => {
        event.preventDefault();

        const itemData = event.dataTransfer.getData("text/plain");
        const item = JSON.parse(itemData);

        if (item.origin === DROP_ORIGIN_SELECTION) {
            return;
        } else delete item.origin;

        const lootName = item.lootName;

        const updatedLoot = {...displayLoot};
        const originalCount =  displayLoot[lootName].count;
        if (originalCount >= 1) {
            delete updatedLoot[lootName];
        } else return;
        setDisplayLoot(updatedLoot);

        const updatedDisenchantLoot = {...disenchantLoot};
        if (disenchantLoot[lootName] === undefined) {
            item.count = originalCount;
            updatedDisenchantLoot[lootName] = item;
        } else {
            updatedDisenchantLoot[lootName].count += originalCount;
        }
        setDisenchantLoot(updatedDisenchantLoot);

    }

    const moveOneElement = (item, origin, destination, setOrigin, setDestination) => {
        const preCopy = JSON.stringify(item);

        const itemCopy = JSON.parse(preCopy);

        const name = item.lootName;
        const updatedOrigin = {...origin};
        const originalCount =  origin[name].count;
        if (originalCount >= 1) {
            if (originalCount === 1) {
                delete updatedOrigin[name];
            } else updatedOrigin[name].count = originalCount - 1;
        } else return;

        const updatedDestination = {...destination};
        if (updatedDestination[name] === undefined) {
            itemCopy.count = 1;
            updatedDestination[name] = itemCopy;
        } else {
            updatedDestination[name].count += 1;
        }

        setOrigin(updatedOrigin);

        setDestination(updatedDestination);
    };

    const handleDragStart = (event, item, origin) => {
        item.origin = origin;
        const itemData = JSON.stringify(item);
        event.dataTransfer.setData("text/plain", itemData);
    };

    const changeSelection = (newSelection) => {
        selection = newSelection;
        resetSelection();
    }

    return (
        <div className={styles.content}>
            {selection}<br></br>
            Awaiting Disenchant: {awaitingDisenchant ? "true" : "false"}<br></br>
            <button onClick={() => {changeSelection("skin")}}>Skins</button>
            <button onClick={() => {changeSelection("champion")}}>Champions</button>
            <button onClick={() => {changeSelection("wardskin")}}>Wards</button><br></br>
            Owned Content:<br></br>
            <button onClick={() => {selectOwnedContent()}}>Select owned</button>
            <div className={styles.currentLootContainer} onDragOver={(e) => {e.preventDefault()}} onDrop={(e) => handleDropToDisplay(e)}>
                {
                    Object.values(displayLoot).sort((a,b) => {
                        return a.itemDesc.localeCompare(b.itemDesc);
                    }).map((item, index) => {
                            return (<div key={"Loot-"+index} className={styles.lootElement} draggable={true} onDragStart={(e) => {handleDragStart(e, item, DROP_ORIGIN_INVENTORY)}} onClick={() => moveOneElement(item, displayLoot, disenchantLoot, setDisplayLoot, setDisenchantLoot)}>
                                <div className={styles.imageContainer}>
                                    <Image fill className={styles.lootImage} src={PROXY_STATIC_PREFIX + item.tilePath} alt={""+item.tilePath} draggable={false} loading={"lazy"}></Image>
                                </div>
                                <div className={styles.lootDescription} draggable={false}>
                                    <br></br>
                                    <span>{item.displayCategories}<br></br></span>
                                    <span>{item.itemDesc} x{item.count}<br></br></span>
                                </div>
                            </div>)


                    })
                }
            </div>
            <div className={styles.disenchantLootContainer} onDragOver={(e) => {e.preventDefault()}} onDrop={(e) => handleDropToDisenchant(e)}>
                {
                    Object.values(disenchantLoot).sort((a,b) => {
                        return a.itemDesc.localeCompare(b.itemDesc);
                    }).map((item, index) => {
                        return (<div key={"Loot-"+index} className={styles.lootElement} draggable={true} onDragStart={(e) => handleDragStart(e, item, DROP_ORIGIN_SELECTION)} onClick={() => moveOneElement(item, disenchantLoot, displayLoot, setDisenchantLoot, setDisplayLoot)}>
                            <div className={styles.imageContainer}>
                                <Image  className={styles.lootImage} src={PROXY_STATIC_PREFIX + item.tilePath} alt={""+item.tilePath}  draggable={false} loading={"lazy"}></Image>
                            </div>
                                <div className={styles.lootDescription} draggable={false}>
                                    <br></br>
                                    <span>{item.displayCategories}<br></br></span>
                                    <span>{item.itemDesc} x{item.count}<br></br></span>
                                </div>
                            </div>)


                    })
                }
            </div>
            <button onClick={() => {sendDisenchantLoot()}}>Disenchant DEBUG</button>
            <button onClick={() => {sendRerollLoot()}}>Reroll DEBUG</button>
            {awaitingDisenchant ? (
                <div className={styles.overlayBackground}>

                </div>
            ) : (
                <></>
            )}

        </div>
    )
}