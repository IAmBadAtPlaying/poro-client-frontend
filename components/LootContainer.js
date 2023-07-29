import {isJsonObjectEmpty, PROXY_STATIC_PREFIX} from "../globals";
import {useEffect, useState} from "react";
import styles from "../styles/LootContainer.module.css";
import {send} from "../pages";
import Image from "next/image";


export default function LootContainer({loot}) {

    //TODO Cleanup loot, it still contains wards and champion tokens, which are not disenchantable
    //TODO Categories should have to be chosen before display, then set disenchantLoot to just the loot elements;
    //TODO: Make it look better

    const DROP_ORIGIN_INVENTORY = "inventory";
    const DROP_ORIGIN_SELECTION = "selection";

    const LOOT_ALREADY_OWNED = "ALREADY_OWNED";

    const [awaitingDisenchant, setAwaitingDisenchant] = useState(false);

    const [currentSelection, setCurrentSelection] = useState("all");

    const [disenchantLoot, setDisenchantLoot] = useState([]);
    const [displayLoot, setDisplayLoot] = useState([]);

    useEffect(() => {
        setDisplayLoot(loot);
        setDisenchantLoot({})
        setAwaitingDisenchant(false);
    }, [loot]);

    const resetSelection = () => {
        setDisplayLoot(loot);
        setDisenchantLoot({});
    }

    const selectOwnedContent = () => {
        const newDisenchantLoot = {};
        const newDisplayLoot = {};
        Object.values(displayLoot).map((item) => {
            if (item.redeemableStatus === LOOT_ALREADY_OWNED) {
                newDisenchantLoot[item.lootName] = item;
            } else newDisplayLoot[item.lootName] = item;
        });
        console.log(newDisenchantLoot);
        setDisplayLoot(newDisplayLoot);
        setDisenchantLoot(newDisenchantLoot);
    };

    const sendDisenchantLoot = () => {
        if (awaitingDisenchant || isJsonObjectEmpty(disenchantLoot)) return;
        let lootToDisenchant = [];
        Object.values(disenchantLoot).map((item) => {
            lootToDisenchant.push(item);
        });
        setDisenchantLoot({});
        setAwaitingDisenchant(true);
        send([6, lootToDisenchant]);
    };

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

    const moveItem = (item, origin, destination, setOrigin, setDestination) => {
        const preCopy = JSON.stringify(item)

        const itemCopy = JSON.parse(preCopy);

        const name = item.lootName;
        const updatedOrigin = {...origin};
        const originalCount =  origin[name].count;
        if (originalCount >= 1) {
            if (originalCount === 1) {
                delete updatedOrigin[name];
            } else updatedOrigin[name].count -= 1;
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

    const changeSelection = (selection) => {
        setCurrentSelection(selection);
        const newDisplayLoot = {};
        Object.values(loot).map((item) => {
            if (item.displayCategories.toLowerCase() === selection) {
                newDisplayLoot[item.lootName] = item;
            }
        });
        setDisenchantLoot({});
        setDisplayLoot(newDisplayLoot);
    }

    return (
        <div className={styles.content}>
            {currentSelection}<br></br>
            Awaiting Disenchant: {awaitingDisenchant ? "true" : "false"}<br></br>
            <button onClick={() => {changeSelection("skin")}}>Skins</button>
            <button onClick={() => {changeSelection("champion")}}>Champions</button><br></br>
            Owned Content:<br></br>
            <button onClick={() => {selectOwnedContent()}}>Select owned</button>
            <div className={styles.currentLootContainer} onDragOver={(e) => {e.preventDefault()}} onDrop={(e) => handleDropToDisplay(e)}>
                {
                    Object.values(displayLoot).sort((a,b) => {
                        return a.itemDesc.localeCompare(b.itemDesc);
                    }).map((item, index) => {
                        if (item.itemDesc === undefined || item.itemDesc === "") return <div key={"Loot-"+index}></div>
                        if (item.lootName.startsWith("WARD_SKIN") || item.lootName.startsWith("CHAMPION_TOKEN")) return <div key={"Loot-"+index}></div>
                            return (<div key={"Loot-"+index} className={styles.lootElement} draggable={true} onDragStart={(e) => {handleDragStart(e, item, DROP_ORIGIN_INVENTORY)}} onClick={() => moveItem(item, displayLoot, disenchantLoot, setDisplayLoot, setDisenchantLoot)}>
                                <div className={styles.imageContainer}>
                                    <Image fill className={styles.lootImage} src={PROXY_STATIC_PREFIX + item.tilePath} draggable={false} loading={"lazy"}></Image>
                                </div>
                                <div className={styles.lootDescription} draggable={false}>
                                    <span>{item.itemDesc}<br></br></span>
                                    <span>x{item.count}<br></br></span>
                                    <span>{item.lootName}<br></br></span>
                                    <span>{item.redeemableStatus}<br></br></span>
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
                        if (item.itemDesc === undefined || item.itemDesc === "") return <div key={"Loot-"+index}></div>
                        if (item.lootName.startsWith("WARD_SKIN") || item.lootName.startsWith("CHAMPION_TOKEN")) return <div key={"Loot-"+index}></div>
                        return (<div key={"Loot-"+index} className={styles.lootElement} draggable={true} onDragStart={(e) => handleDragStart(e, item, DROP_ORIGIN_SELECTION)} onClick={() => moveItem(item, disenchantLoot, displayLoot, setDisenchantLoot, setDisplayLoot)}>
                            <div className={styles.imageContainer}>
                                <Image fill className={styles.lootImage} src={PROXY_STATIC_PREFIX + item.tilePath} draggable={false} loading={"lazy"}></Image>
                            </div>
                                <div className={styles.lootDescription} draggable={false}>
                                    <span>{item.itemDesc}<br></br></span>
                                    <span>x{item.count}<br></br></span>
                                    <span>{item.lootName}<br></br></span>
                                    <span>{item.redeemableStatus}<br></br></span>
                                </div>
                            </div>)


                    })
                }
            </div>
            <button onClick={() => {sendDisenchantLoot()}}>Disenchant DEBUG</button>
            {awaitingDisenchant ? (
                <div className={styles.overlayBackground}>

                </div>
            ) : (
                <></>
            )}

        </div>
    )
}