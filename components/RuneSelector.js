import {useEffect, useState} from "react";
import axios from "axios";
import * as Globals from "../globals";
import styles from "../styles/champSelect/RuneSelector.module.css";

export default function RuneSelector({setVisible}) {

    //Get available runes from /lol-game-data/assets/v1/perkstyles.json
    const [availableRunes, setAvailableRunes] = useState({}); //TODO: Make this
    const [runePath, setRunePath] = useState({});

    const [selectedRuneType, setSelectedRuneType] = useState(undefined);
    const [selectedSecondaryRuneType, setSelectedSecondaryRuneType] = useState(undefined);


    const [selectedKeyStoneId, setSelectedKeyStoneId] = useState(undefined);
    const [selectedPrimarySubRuneId1, setSelectedPrimarySubRuneId1] = useState(undefined);
    const [selectedPrimarySubRuneId2, setSelectedPrimarySubRuneId2] = useState(undefined);
    const [selectedPrimarySubRuneId3, setSelectedPrimarySubRuneId3] = useState(undefined);

    const [selectedSecondarySubRunes, setSelectedSecondarySubRunes] = useState([]);
    const [selectedSecondarySubRuneGroup, setSelectedSecondarySubRuneGroup] = useState([]);

    const [selectedStatModOne, setSelectedStatModOne] = useState(undefined);
    const [selectedStatModTwo, setSelectedStatModTwo] = useState(undefined);
    const [selectedStatModThree, setSelectedStatModThree] = useState(undefined);

    const clearSelectedSecondaryRunes = () => {
        setSelectedSecondarySubRunes([]);
        setSelectedSecondarySubRuneGroup([]);
    }

    const clearSecondaryRuneType = () => {
        setSelectedSecondaryRuneType(undefined);
    }

    const clearPrimaryRuneSelection = () => {
        setSelectedKeyStoneId(undefined);
        setSelectedPrimarySubRuneId1(undefined);
        setSelectedPrimarySubRuneId2(undefined);
        setSelectedPrimarySubRuneId3(undefined);
    }

    useEffect(() => {
        console.log("Called");
        if (selectedRuneType === selectedSecondaryRuneType) {
            clearSelectedSecondaryRunes();
            clearSecondaryRuneType();
        }
        clearPrimaryRuneSelection();
    }, [selectedRuneType]);

    useEffect(() => {
        axios.get(Globals.PROXY_STATIC_PREFIX + "/lol-game-data/assets/v1/perkstyles.json").then(
            (response) => {
                const data = response.data;
                if (data.styles !== undefined) {
                    let runeTypeMap = {};
                    data.styles.forEach((runeType) => {
                        runeTypeMap[runeType.id] = runeType;
                    });
                    setAvailableRunes(runeTypeMap);
                }
            }
        ).catch((error) => {
            console.error(error);
        });

        axios.get(Globals.PROXY_STATIC_PREFIX + "/lol-game-data/assets/v1/perks.json").then(
            (response) => {
                const data = response.data;
                if (data !== undefined) {
                    let runeIdInfoMap = {};
                    data.forEach((rune) => {
                        runeIdInfoMap[rune.id] = rune;
                    });
                    setRunePath(runeIdInfoMap);
                }
            }
        ).catch((error) => {
            console.error(error);
        });
    }, []);


    const saveRunes = () => {
        if (selectedRuneType === undefined) return;
        if (selectedKeyStoneId === undefined) return;
        if (selectedPrimarySubRuneId1 === undefined) return;
        if (selectedPrimarySubRuneId2 === undefined) return;
        if (selectedPrimarySubRuneId3 === undefined) return;
        if (selectedSecondarySubRunes.length !== 2) return;
        if (selectedSecondarySubRunes[0] === undefined) return;
        if (selectedSecondarySubRunes[1] === undefined) return;
        if (selectedStatModOne === undefined) return;
        if (selectedStatModTwo === undefined) return;
        if (selectedStatModThree === undefined) return;
        console.log("SAVING RUNES, CONDITIONS MET");
        let sendObject = {};
        sendObject["name"] = "Poro-Client: " + runePath[selectedKeyStoneId].name;
        sendObject["primaryStyleId"] = selectedRuneType;
        sendObject["subStyleId"] = selectedSecondaryRuneType;
        sendObject["selectedPerkIds"] = [selectedKeyStoneId, selectedPrimarySubRuneId1, selectedPrimarySubRuneId2, selectedPrimarySubRuneId3, selectedSecondarySubRunes[0], selectedSecondarySubRunes[1], selectedStatModOne, selectedStatModTwo, selectedStatModThree];
        sendObject["current"] = true;
        console.log(sendObject);
        axios.post(Globals.REST_PREFIX + "/runes/save", sendObject).then((response) => {
            console.log(response);
        });
    }

    const handleOutsideClick = () => {
        if (setVisible !== undefined) {
            setVisible(false);
        }
    }

    const renderPrimaryRune = () => {
        if (selectedRuneType === undefined) {
            return <></>;
        }
        const runeType = availableRunes[selectedRuneType];
        const runeKeystoneIds = runeType.slots[0].perks;
        const subRuneIdsOne = runeType.slots[1].perks;
        const subRuneIdsTwo = runeType.slots[2].perks;
        const subRuneIdsThree = runeType.slots[3].perks;

        return (
         <>
             <div className={styles.keyStoneContainer}>
                 {
                     runeKeystoneIds.map((runeId, index) => {
                         return (
                             <div className={selectedKeyStoneId === runeId ? styles.singleKeyStoneContainerActive : styles.singleKeyStoneContainer} key={"keystone-"+index}>
                                    <div className={styles.singleKeyStoneImageContainer} title={runePath[runeId].name} onClick={() => {setSelectedKeyStoneId(runeId)}}>
                                        <img draggable={false} src={Globals.PROXY_STATIC_PREFIX + runePath[runeId].iconPath} alt={"Loading"} className={styles.singleKeyStoneImage}></img>
                                    </div>
                             </div>
                         )
                     })
                 }
             </div>
             <div className={styles.subRuneContainer}>
                 {
                        subRuneIdsOne.map((runeId, index) => {
                            return (
                                <div className={(selectedPrimarySubRuneId1 === runeId) ? styles.singleSubRuneContainerActive : styles.singleSubRuneContainer} key={"subRuneOne-"+index} title={runePath[runeId].name}  onClick={() => {setSelectedPrimarySubRuneId1(runeId)}}>
                                    <div className={styles.singleSubRuneImageContainer}>
                                        <img draggable={false} src={Globals.PROXY_STATIC_PREFIX + runePath[runeId].iconPath} alt={"Loading"} className={styles.singleSubRuneImage}></img>
                                    </div>
                                </div>
                            )
                        })
                 }
             </div>
             <div className={styles.subRuneContainer}>
                 {
                     subRuneIdsTwo.map((runeId, index) => {
                         return (
                             <div className={(selectedPrimarySubRuneId2 === runeId) ? styles.singleSubRuneContainerActive : styles.singleSubRuneContainer} key={"subRuneOne-"+index} title={runePath[runeId].name} onClick={() => {setSelectedPrimarySubRuneId2(runeId)}}>
                                 <div className={styles.singleSubRuneImageContainer}>
                                     <img draggable={false} src={Globals.PROXY_STATIC_PREFIX + runePath[runeId].iconPath} alt={"Loading"} className={styles.singleSubRuneImage}></img>
                                 </div>
                             </div>
                         )
                     })
                 }
             </div>
             <div className={styles.subRuneContainer}>
                 {
                     subRuneIdsThree.map((runeId, index) => {
                         return (
                             <div className={(selectedPrimarySubRuneId3 === runeId) ? styles.singleSubRuneContainerActive : styles.singleSubRuneContainer} key={"subRuneOne-"+index} title={runePath[runeId].name} onClick={() => {setSelectedPrimarySubRuneId3(runeId)}}>
                                 <div className={styles.singleSubRuneImageContainer}>
                                     <img draggable={false} src={Globals.PROXY_STATIC_PREFIX + runePath[runeId].iconPath} alt={"Loading"} className={styles.singleSubRuneImage}></img>
                                 </div>
                             </div>
                         )
                     })
                 }
             </div>
         </>
        )
    }


    const renderSecondaryRunes = (secondaryRuneType, secondarySubRunes) => {
        if(selectedRuneType === undefined) return (<></>);
        return (
            <>
                <div className={styles.saveButtonContainer}>
                    <button onClick={() => {saveRunes()}}>Save</button>
                </div>
                <div className={styles.secondaryRuneTypeSelector}>
                    <div className={styles.secondaryRuneTypeFlex}>
                        {
                            renderSecondaryRuneTypes()
                        }
                    </div>
                </div>
                <div className={styles.secondaryRuneContainer}>
                    {
                        renderSecondarySubRunes(secondaryRuneType, secondarySubRunes)
                    }
                </div>
                <div className={styles.subStyleContainer}>
                    {
                        renderStatMods()
                    }
                </div>
            </>

        )
    }

    const renderStatMods = () => {
        if (selectedRuneType === undefined) return (<></>);

        const runeType = availableRunes[selectedRuneType];

        const statModOne = runeType.slots[4].perks;
        const statModTwo = runeType.slots[5].perks;
        const statModThree = runeType.slots[6].perks;


        return (
            <>
                <div className={styles.statModContainer}>
                    {
                        statModOne.map((runeId, index) => {
                            return (
                                <div className={selectedStatModOne === runeId ? styles.singleStatModContainerActive : styles.singleStatModContainer} key={"statModOne-"+index} title={runePath[runeId].name} onClick={() => setSelectedStatModOne(runeId)}>
                                    <div className={styles.singleStatModImageContainer}>
                                        <img draggable={false} src={Globals.PROXY_STATIC_PREFIX + runePath[runeId].iconPath} alt={"Loading"} className={styles.singleStatModImage}></img>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                <div className={styles.statModContainer}>
                    {
                        statModTwo.map((runeId, index) => {
                            return (
                                <div className={selectedStatModTwo === runeId ? styles.singleStatModContainerActive : styles.singleStatModContainer} key={"statModOne-"+index} title={runePath[runeId].name}  onClick={() => setSelectedStatModTwo(runeId)}>
                                    <div className={styles.singleStatModImageContainer}>
                                        <img draggable={false} src={Globals.PROXY_STATIC_PREFIX + runePath[runeId].iconPath} alt={"Loading"} className={styles.singleStatModImage}></img>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                <div className={styles.statModContainer}>
                    {
                        statModThree.map((runeId, index) => {
                            return (
                                <div className={selectedStatModThree === runeId ? styles.singleStatModContainerActive : styles.singleStatModContainer} key={"statModOne-"+index} title={runePath[runeId].name} onClick={() => setSelectedStatModThree(runeId)}>
                                    <div className={styles.singleStatModImageContainer}>
                                        <img draggable={false} src={Globals.PROXY_STATIC_PREFIX + runePath[runeId].iconPath} alt={"Loading"} className={styles.singleStatModImage}></img>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>

            </>
        )

    }

    const renderSecondarySubRunes = (secondaryRuneType) => {
        if (secondaryRuneType === undefined) return (<></>);


        //TODO: Not scalable, make this better
        const runeType = availableRunes[secondaryRuneType];
        const subRuneIdsOneGroup = runeType.slots[1].slotLabel;
        const subRuneIdsTwoGroup = runeType.slots[2].slotLabel;
        const subRuneIdsThreeGroup = runeType.slots[3].slotLabel;

        const subRuneIdsOne = runeType.slots[1].perks;
        const subRuneIdsTwo = runeType.slots[2].perks;
        const subRuneIdsThree = runeType.slots[3].perks;

        const handleSubRuneChange = (runeId, slotLabel) => {
            if (selectedSecondarySubRunes.includes(runeId)) return;
            if (selectedSecondarySubRuneGroup.includes(slotLabel)) {
                console.log("TWO OF SAME TYPE");
                let newSelectedSecondarySubRunes = [...selectedSecondarySubRunes];
                newSelectedSecondarySubRunes[selectedSecondarySubRuneGroup.indexOf(slotLabel)] = runeId;
                setSelectedSecondarySubRunes(newSelectedSecondarySubRunes);
                return;
            }
            if (selectedSecondarySubRunes.length < 2) {
                setSelectedSecondarySubRuneGroup([...selectedSecondarySubRuneGroup, slotLabel]);
                setSelectedSecondarySubRunes([...selectedSecondarySubRunes, runeId]);
            } else {
                if (selectedSecondarySubRunes.includes(runeId)) return;
                let newSelectedSecondarySubRuneGroup = [...selectedSecondarySubRuneGroup];
                let newSelectedSecondarySubRunes = [...selectedSecondarySubRunes];
                newSelectedSecondarySubRuneGroup.shift();
                newSelectedSecondarySubRunes.shift();
                newSelectedSecondarySubRuneGroup.push(slotLabel);
                newSelectedSecondarySubRunes.push(runeId);
                setSelectedSecondarySubRuneGroup(newSelectedSecondarySubRuneGroup);
                setSelectedSecondarySubRunes(newSelectedSecondarySubRunes);
            }
        }

        const checkIfActive = (runeId) => {
            if (selectedSecondarySubRunes[0] === runeId || selectedSecondarySubRunes[1] === runeId) {
                return true;
            }
            return false;
        }

        return (
            <>
                <div className={styles.secondarySubRuneContainer}>
                    {
                        subRuneIdsOne.map((runeId, index) => {
                            return (
                                <div className={checkIfActive(runeId) ? styles.singleSecondarySubRuneContainerActive : styles.singleSecondarySubRuneContainer} key={"subRuneOne-"+index} title={runePath[runeId].name} onClick={() => {handleSubRuneChange(runeId, subRuneIdsOneGroup)}}>
                                    <div className={styles.singleSecondarySubRuneImageContainer}>
                                        <img draggable={false} src={Globals.PROXY_STATIC_PREFIX + runePath[runeId].iconPath} alt={"Loading"} className={styles.singleSecondarySubRuneImage}></img>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                <div className={styles.secondarySubRuneContainer}>
                    {
                        subRuneIdsTwo.map((runeId, index) => {
                            return (
                                <div className={checkIfActive(runeId) ? styles.singleSecondarySubRuneContainerActive : styles.singleSecondarySubRuneContainer} key={"subRuneOne-"+index} title={runePath[runeId].name} onClick={() => {handleSubRuneChange(runeId, subRuneIdsTwoGroup)}}>
                                    <div className={styles.singleSecondarySubRuneImageContainer}>
                                        <img draggable={false} src={Globals.PROXY_STATIC_PREFIX + runePath[runeId].iconPath} alt={"Loading"} className={styles.singleSecondarySubRuneImage}></img>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                <div className={styles.secondarySubRuneContainer}>
                    {
                        subRuneIdsThree.map((runeId, index) => {
                            return (
                                <div className={checkIfActive(runeId) ? styles.singleSecondarySubRuneContainerActive : styles.singleSecondarySubRuneContainer} key={"subRuneOne-"+index} title={runePath[runeId].name} onClick={() => {handleSubRuneChange(runeId, subRuneIdsThreeGroup)}}>
                                    <div className={styles.singleSecondarySubRuneImageContainer}>
                                        <img draggable={false} src={Globals.PROXY_STATIC_PREFIX + runePath[runeId].iconPath} alt={"Loading"} className={styles.singleSecondarySubRuneImage}></img>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>


            </>
        )

    }

    const doNothing = () => {}

    const renderSecondaryRuneTypes = () => {
        return Object.values(availableRunes).filter((runeType) => {return (runeType.id !== selectedRuneType)}).map((runeType, index) => {
            return (
                <div key={"secondaryRuneType-"+index} className={selectedSecondaryRuneType === runeType.id ? styles.singleSecondaryRuneTypeContainerActive :styles.singleSecondaryRuneTypeContainer} onClick={() => {selectedSecondaryRuneType === runeType.id ? doNothing() : setSelectedSecondaryRuneType(runeType.id)}}>
                    <div className={styles.singleSecondaryRuneTypeHeader}>
                        {runeType.name}
                    </div>
                    <div className={styles.singleSecondaryRuneTypeImageContainer}>
                        <img draggable={false} src={Globals.PROXY_PREFIX + runeType.iconPath} alt={"Loading"} className={styles.singleSecondaryRuneTypeImage}></img>
                    </div>
                </div>
            )
        });
    }

    return (
        <div className={styles.mainContainer}>
            <div className={styles.backgroundFilter} onClick={() => {handleOutsideClick()}}>
            </div>
            <div className={styles.runesContainer}>
                <div className={styles.runesPrimaryContainer}>
                    <div className={styles.runeTypeSelector}>
                        <div className={styles.runesTypeFlex}>
                            {
                                Object.values(availableRunes).map((runeType, index) => {
                                    return (
                                        <div key={"runeType-"+index} className={selectedRuneType === runeType.id ? styles.singleRuneTypeContainerActive :styles.singleRuneTypeContainer} onClick={() => {setSelectedRuneType(runeType.id)}}>
                                            <div className={styles.singleRuneTypeHeader}>
                                                {runeType.name}
                                            </div>
                                            <div className={styles.singleRuneTypeImageContainer}>
                                                <img draggable={false} src={Globals.PROXY_PREFIX + runeType.iconPath} alt={"Loading"} className={styles.singleRuneTypeImage}></img>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <div className={styles.primaryRuneContainer}>
                        {
                            renderPrimaryRune()
                        }
                    </div>
                </div>
                <div className={styles.runesSecondaryContainer}>
                    {
                        renderSecondaryRunes(selectedSecondaryRuneType, selectedSecondarySubRunes)
                    }
                </div>
            </div>
        </div>
    )
}