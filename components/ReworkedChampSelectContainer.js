import {getChampions, getChromaSkins, getSpells} from "../pages/indexRework";
import {useEffect, useRef, useState} from "react";
import axios from "axios";
import * as Globals from "../globals";
import {PROXY_STATIC_PREFIX, STATIC_PREFIX} from "../globals";
import styles from "../styles/champSelect/ReworkedChampSelectContainer.module.css";
import ChampionCard from "./ChampionCard";
import RuneSelector from "./RuneSelector";


export default function ReworkedChampSelectContainer({session}) {
    let champions = getChampions();

    const [runesVisible, setRunesVisible] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const [filteredChampions, setFilteredChampions] = useState(champions);

    const [currentPickSelected, setCurrentPickSelected] = useState(-1);
    const [currentBanSelected, setCurrentBanSelected] = useState(-1);

    useEffect(() => {
        axios.post(Globals.REST_PREFIX + "/champSelect/ban", {
            championId: currentBanSelected,
            lockIn: false
        }).catch((error) => {
            console.log(error);
        })
    }, [currentBanSelected]);

    useEffect(() => {
        axios.post(Globals.REST_PREFIX + "/champSelect/pick", {
            championId: currentPickSelected,
            lockIn: false
        }).catch((error) => {
            console.log(error);
        })
    }, [currentPickSelected]);

    useEffect(() => {
        const filterChampions = (champion) => {
            if (champion.name === undefined) return false;
            if (champion.id !== -1) {
                return (searchInput === "" ||champion.alias.toString().toLowerCase().includes(searchInput.toLowerCase()) ||champion.name.toString().toLowerCase().includes(searchInput.toLowerCase()));
            }
        }

        setFilteredChampions(Object.values(champions).filter(champion => filterChampions(champion)))
    }, [champions]);

    const validChampionId = (championId) => {
        if (championId === undefined) return false;
        if (championId === -1) return false;
        if (championId === 0) return false;
        return true;
    }

    const handleSearch = (event) => {
        let searchInput = event.target.value
        if (searchInput === undefined) searchInput = ""
        setSearchInput(searchInput);
        const filterChampions = (champion) => {
            if (champion.name === undefined) return false;
            if (champion.id !== -1) {
                return (searchInput === "" ||champion.alias.toString().toLowerCase().includes(searchInput.toLowerCase()) ||champion.name.toString().toLowerCase().includes(searchInput.toLowerCase()));
            }
        }
        setFilteredChampions(Object.values(champions).filter(champion => filterChampions(champion)));
    }

    const getPositionFromInternalName = (internalName) => {
        if (internalName === undefined) return "";
        switch (internalName) {
            case "top":
                return "TOP";
            case "jungle":
                return "JUNGLE";
            case "middle":
                return "MID";
            case "bottom":
                return "BOTTOM";
            case "utility":
                return "SUPPORT";
            default:
                return "";
        }
    }

    const renderBGImageFromPickIntent = (pickIntent) => {
        if (pickIntent === undefined || pickIntent === -1 || pickIntent === 0 || pickIntent === "") return (<></>);
        return (
            <div className={styles.finalizationBGContainer}>
                <img src={`${Globals.PROXY_STATIC_PREFIX}/lol-game-data/assets/v1/champion-splashes/${pickIntent}/${pickIntent}000.jpg`}
                     className={styles.finalizationBGImage}
                />
                <div className={styles.finalizationBGFilter}/>
            </div>
        )
    }

    const getPathFromSpellId = (spellId) => {
        const spellObject = getSpells();
        if (spellObject === undefined) return console.error("Spell object is undefined");
        const spell = spellObject[spellId];
        if (spell === undefined) return console.error("Spell is undefined");
        const spellPath = spell.iconPath;

        return PROXY_STATIC_PREFIX + spellPath;
    }

    const getSplashArtFromChromaId = (chromaId) => {
        const chromaMap = getChromaSkins();
        if (chromaMap === undefined) return console.error("Chroma map is undefined");
        const splashId = chromaMap[chromaId];

        return splashId;
    }


    if (!session.bans) {
        session.bans = {}
    }
    if (!session.bans.myTeamBans) session.bans.myTeamBans = [];
    if (!session.bans.theirTeamBans) session.bans.theirTeamBans = [];

    if (!session.myTeam) session.myTeam = [];
    if (!session.theirTeam) session.theirTeam = [];


    const renderMyTeamBans = (passedBans, maxBans) => {
        const bans = [];

        for (let index = 0; index < Globals.CHAMP_SELECT_MAX_BANS_PER_TEAM; index++) {
            const championValue = passedBans[index];

            console.log(`${index} ${championValue}`);

            if (index >= maxBans) {
                continue;
            }
            if (!championValue) {
                bans.push(
                    <div className={styles.singleBanContainer} key={"MyTeamBan-" + index}>
                        <img className={styles.banImage} src={`${Globals.PROXY_STATIC_PREFIX}/lol-game-data/assets/v1/champion-icons/-1.png`} alt={""}/>
                        <div className={styles.banFilter}></div>
                    </div>
                );
            } else {
                bans.push(
                    <div className={styles.singleBanContainer} key={"MyTeamBan-" + index}>
                        <img className={styles.banImage} src={`${Globals.PROXY_STATIC_PREFIX}/lol-game-data/assets/v1/champion-icons/${championValue}.png`} alt={""}/>
                        <div className={styles.banFilter}></div>
                    </div>
                );
            }
        }

        return bans.reverse();
    }

    const renderTheirTeamBans = (passedBans, maxBans) => {
        const bans = [];

        for (let index = 0; index < Globals.CHAMP_SELECT_MAX_BANS_PER_TEAM; index++) {
            const championValue = passedBans[index];

            console.log(`${index} ${championValue}`);

            if (index >= maxBans) {
                bans.push(
                    <div className={styles.theirTeamBansComponent} key={"MyTeamBan-" + index}>
                        <div className={styles.theirTeamBansImageContainer}>
                        </div>
                    </div>
                )
                continue;
            }
            if (!championValue) {
                bans.push(
                    <div className={styles.theirTeamBansComponent} key={"MyTeamBan-" + index}>
                        <div className={styles.theirTeamBansImageContainer}>
                            <img
                                src={`${Globals.PROXY_STATIC_PREFIX}/lol-game-data/assets/v1/champion-icons/-1.png`}
                                alt="Icon"
                                className={styles.theirTeamBansImage}
                            />
                        </div>
                    </div>
                );
            } else {
                bans.push(
                    <div className={styles.theirTeamBansComponent} key={"MyTeamBan-" + index}>
                        <div className={styles.theirTeamBansImageContainer}>
                            <img
                                src={`${Globals.PROXY_STATIC_PREFIX}/lol-game-data/assets/v1/champion-icons/${championValue}.png`}
                                alt="Icon"
                                className={styles.theirTeamBansImage}
                            />
                        </div>
                    </div>
                );
            }
        }

        return bans;
    }



    const renderMyTeamStrategy = (session) => {
        if (!session) return (<></>);
        let myTeam = session.myTeam;
        let timer = session.timer;
        if (!timer) return <>Unknown Timer Phase</>
        let timerPhase = session.timer.phase;
        console.log("Current Phase " + timerPhase);
        switch (timerPhase) {
            case 'PLANNING':
            case 'BAN_PICK':
            case 'FINALIZATION':
                return renderMyTeam(myTeam);
            default:
                return <>Unknown Timer Phase: {timerPhase}</>
        }
    }

    const renderMyTeam = (myTeam) => {
        const myTeamArray = [];

        for (let index = 0; index < Globals.CHAMP_SELECT_MAX_MEMBERS_PER_TEAM; index++) {

            const currentSummoner = myTeam[index];
            {
                myTeamArray.push(
                    renderFriendlyState(currentSummoner, index)
                )
            }
        }
        return myTeamArray;
    }

    const renderFriendlyState = (currentSummoner, index) => {
        if (!currentSummoner) return (<></>);
        if (!currentSummoner.state) return (<></>);

        let state = currentSummoner.state;
        switch (state) {
            case "PREPARATION":
                 return renderSummonerPREPARATION(currentSummoner, index);
            case "BANNING":
                return renderSummonerBANNING(currentSummoner, index);
            case "AWAITING_PICK":
                return renderSummonerAWAITING_PICK(currentSummoner, index);
            case "AWAITING_BAN_RESULT":
                return renderSummonerAWAITING_BAN_RESULT(currentSummoner, index);
            case "PICKING_WITH_BAN":
            case "PICKING_WITHOUT_BAN":
                return renderSummonerPICKING(currentSummoner, index);
            case 'AWAITING_FINALIZATION':
                return renderSummonerAWAITING_FINALIZATION(currentSummoner, index);
            case 'FINALIZATION':
                return renderSummonerFINALIZATION(currentSummoner, index);
            default:
                return (
                    <>Unknown State: {state}</>
                )
        }
    }

    const renderSummonerPREPARATION = (currentSummoner, index) => {
        return (
            <div className={styles.champSelectBANNING} key={"MyTeamPick-" + index}>
                <div className={styles.borderBox}>
                    {
                        renderBGImageFromPickIntent(currentSummoner.championPickIntent)
                    }
                    <div className={styles.teammateContent}>
                        <div className={styles.statusContainer}>
                            Declaring Intent
                        </div>
                        <div className={styles.positionContainer}>
                            {
                                renderPositionIcon(currentSummoner.assignedPosition)
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const renderSummonerBANNING = (currentSummoner, index) => {
        return (
            <div className={styles.champSelectBANNING} key={"MyTeamPick-" + index}>
                <div className={styles.borderBox}>
                    <div className={styles.banningBGContainer}>
                        {
                            validChampionId(currentSummoner.banAction.championId) ? (
                                <>
                                    <img src={`${Globals.PROXY_STATIC_PREFIX}/lol-game-data/assets/v1/champion-splashes/${currentSummoner.banAction.championId}/${currentSummoner.banAction.championId+"000"}.jpg`}
                                         className={styles.banningBGImage}/>
                                    <div className={styles.banningBGFilter}/>
                                </>
                            ) : (
                                <>
                                    <div className={styles.banningBGFilter}/>
                                </>
                            )
                        }

                    </div>
                    <div className={styles.teammateContent}>
                        <div className={styles.statusContainer}>
                            Banning...
                        </div>
                        <div className={styles.positionContainer}>
                            {
                                renderPositionIcon(currentSummoner.assignedPosition)
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const renderSummonerAWAITING_PICK = (currentSummoner, index) => {
        return (
            <div className={styles.champSelectFINALIZATION} key={"MyTeamPick-" + index}>
                <div className={styles.finalizationBGContainer}>
                    {
                        renderBGImageFromPickIntent(currentSummoner.championPickIntent)
                    }
                    <div className={styles.finalizationBGFilter}/>
                </div>
                <div className={styles.teammateContent}>
                    <div className={styles.finalizationContentSummonerSpells}>
                        <div className={styles.finalizationContentSummonerSpellContainer}>
                            <img className={styles.champSelectComponentSummonerSpellImage}
                                 draggable={false}
                                 alt={"Summoner Spell"}
                                 src={getPathFromSpellId(currentSummoner.spell1Id)}
                            />
                        </div>
                        <div className={styles.finalizationContentSummonerSpellContainer}>
                            <img className={styles.champSelectComponentSummonerSpellImage}
                                 draggable={false}
                                 alt={"Summoner Spell"}
                                 src={getPathFromSpellId(currentSummoner.spell2Id)}
                            />
                        </div>
                    </div>
                    <div className={styles.statusContainer}>
                        Awaiting Pick
                    </div>
                    <div className={styles.positionContainer}>
                        {
                            renderPositionIcon(currentSummoner.assignedPosition)
                        }
                    </div>
                </div>
            </div>
        )
    }

    const renderSummonerAWAITING_BAN_RESULT = (currentSummoner, index) => {
        return (
            <div className="champSelectFINALIZATION" key={"MyTeamPick-" + index}>
                <div className="borderBox">AWAITING BAN RESULST</div>
            </div>
        )
    }

    const renderSummonerPICKING = (currentSummoner, index) => {

        const BODER_CLASS_STYLE = (currentSummoner.cellId === session.localPlayerCellId) ? styles.champSelectPICKING_SELF : styles.champSelectPICKING;

        return (
            <div className={BODER_CLASS_STYLE} key={"MyTeamPick-" + index}>
                <div className={styles.borderBox}>
                    <div className={styles.pickingBGContainer}>
                        {
                            validChampionId(currentSummoner.pickAction.championId) ? (
                                <>
                                    <img src={`${Globals.PROXY_STATIC_PREFIX}/lol-game-data/assets/v1/champion-splashes/${currentSummoner.pickAction.championId}/${currentSummoner.pickAction.championId+"000"}.jpg`}
                                         className={styles.pickingBGImage}/>
                                    <div className={styles.pickingBGFilter}/>
                                </>
                            ) : (
                                <>
                                    <div className={styles.pickingBGFilter}/>
                                </>
                            )
                        }
                    </div>
                    <div className={styles.teammateContent}>
                        <div className={styles.statusContainer}>
                                Picking...
                        </div>
                        <div className={styles.positionContainer}>
                            {
                                renderPositionIcon(currentSummoner.assignedPosition)
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const renderSummonerAWAITING_FINALIZATION = (currentSummoner, index) => {
        return (
            <div className={styles.champSelectFINALIZATION} key={"MyTeamPick-" + index}>
                <div className={styles.finalizationBGContainer}>
                    <img src={`${Globals.PROXY_STATIC_PREFIX}/lol-game-data/assets/v1/champion-splashes/${currentSummoner.championId}/${currentSummoner.championId+"000"}.jpg`}
                         className={styles.finalizationBGImage}
                    />
                    <div className={styles.finalizationBGFilter}/>
                </div>
                <div className={styles.teammateContent}>
                    <div className={styles.finalizationContentSummonerSpells}>
                        <div className={styles.finalizationContentSummonerSpellContainer}>
                            <img className={styles.champSelectComponentSummonerSpellImage}
                                 draggable={false}
                                 alt={"Summoner Spell"}
                                 src={getPathFromSpellId(currentSummoner.spell1Id)}
                            />
                        </div>
                        <div className={styles.finalizationContentSummonerSpellContainer}>
                            <img className={styles.champSelectComponentSummonerSpellImage}
                                 draggable={false}
                                 alt={"Summoner Spell"}
                                 src={getPathFromSpellId(currentSummoner.spell2Id)}
                            />
                        </div>
                    </div>
                    <div className={styles.championNameContainer}>
                        {
                            champions[currentSummoner.championId] ? champions[currentSummoner.championId].name : ""
                        }
                    </div>
                    <div className={styles.positionContainer}>
                        {
                            renderPositionIcon(currentSummoner.assignedPosition)
                        }
                    </div>
                </div>
            </div>
        )
    }

    const renderSummonerFINALIZATION = (currentSummoner, index) => {
        return (
            <div className={styles.champSelectFINALIZATION} key={"MyTeamPick-" + index}>
                <div className={styles.finalizationBGContainer}>
                    <img src={`${Globals.PROXY_STATIC_PREFIX}/lol-game-data/assets/v1/champion-splashes/${currentSummoner.championId}/${getSplashArtFromChromaId(currentSummoner.selectedSkinId)}.jpg`}
                         className={styles.finalizationBGImage}
                    />
                    <div className={styles.finalizationBGFilter}/>
                </div>
                <div className={styles.teammateContent}>
                    <div className={styles.finalizationContentSummonerSpells}>
                        <div className={styles.finalizationContentSummonerSpellContainer}>
                            <img className={styles.champSelectComponentSummonerSpellImage}
                                 draggable={false}
                                 alt={"Summoner Spell"}
                                 src={getPathFromSpellId(currentSummoner.spell1Id)}
                            />
                        </div>
                        <div className={styles.finalizationContentSummonerSpellContainer}>
                            <img className={styles.champSelectComponentSummonerSpellImage}
                                 draggable={false}
                                 alt={"Summoner Spell"}
                                 src={getPathFromSpellId(currentSummoner.spell2Id)}
                            />
                        </div>
                    </div>
                    <div className={styles.championNameContainer}>
                        {
                            champions[currentSummoner.championId].name
                        }
                    </div>
                    <div className={styles.positionContainer}>
                        {
                            renderPositionIcon(currentSummoner.assignedPosition)
                        }
                    </div>
                </div>
            </div>
        )
    }

    const renderPositionIcon = (position) => {
        if (position === undefined || position === "") return (<></>);
        return (
            <img src={`${STATIC_PREFIX}/assets/svg/positions/${position}.svg`} className={styles.positionImage} draggable={false}/>
        )
    }

    const renderTheirTeamStrategy = (session) => {
        if (!session) return (<></>);
        let theirTeam = session.theirTeam;
        let timer = session.timer;
        if (!timer) return <>Unknown Timer Phase</>
        let timerPhase = session.timer.phase;
        console.log("Current Phase " + timerPhase);
        switch (timerPhase) {
            case 'PLANNING':
            case 'BAN_PICK':
            case 'FINALIZATION':
                return renderTheirTeam(theirTeam);
            default:
                return <>Unknown Timer Phase: {timerPhase}</>
        }
    }

    const renderTheirTeam = (theirTeam) => {
        const theirTeamArray = [];

        for (let index = 0; index < Globals.CHAMP_SELECT_MAX_MEMBERS_PER_TEAM; index++) {

            const currentSummoner = theirTeam[index];
            {
                theirTeamArray.push(
                    renderEnemyState(currentSummoner, index)
                )
            }
        }
        return theirTeamArray;
    }


    const renderEnemyState = (currentSummoner, index) => {
        return (
            <></>
        )
    }

    const renderChampionSelector = (session) => {
        let emptyResponse = (<></>);
        if (session === undefined) return emptyResponse;
        if (session.localPlayerPhase === undefined) return emptyResponse;
        switch (session.localPlayerPhase) {
            case 'PREPARATION':
                return renderPickContainer(false)
            case 'BANNING':
                return renderBanContainer(true)
            case 'AWAITING_PICK':
                return renderPickContainer(false)
            case 'AWAITING_BAN_RESULT':
                return emptyResponse;
            case 'PICKING_WITH_BAN':
            case 'PICKING_WITHOUT_BAN':
                return renderPickContainer(true);
            case 'AWAITING_FINALIZATION':
                return emptyResponse;
            case 'FINALIZATION':
                return emptyResponse;
            default:
                return <>Unknown Phase: {session.localPlayerPhase}</>
        }
    }

    const renderPickContainer = (allowLockIn) => {
        const lockIn = () => {
            axios.post(Globals.REST_PREFIX + "/champSelect/pick", {
                championId: currentPickSelected,
                lockIn: true
            }).catch((error) => {
                console.log(error);
            })
        }

        return (
            <div className={styles.champSelectWrapper}>
                <input onChange={handleSearch}
                    className={styles.searchInput}
                >
                </input>
                    {
                        filteredChampions === undefined ? (<div>Loading...</div>) :
                            Object.values(filteredChampions) // Exclude champion with id -1
                                .sort((a, b) => {
                                    if (a.name < b.name) {
                                        return -1;
                                    }
                                    if (a.name > b.name) {
                                        return 1;
                                    }
                                    return 0;
                                })
                                .map(champion =>
                                    (<ChampionCard setActive={setCurrentPickSelected}
                                                   isActive={champion.id === currentPickSelected} key={champion.id}
                                                   id={champion.id} championName={champion.name}/>))
                    }
                 {allowLockIn ? (<button className={styles.championSelectorLockInButton} onClick={() => lockIn()}>Lock
                    In</button>) : (<></>)}
            </div>
        )
    }

    const renderBanContainer = (allowLockIn) => {

        const lockIn = () => {
            axios.post(Globals.REST_PREFIX + "/champSelect/ban", {
                championId: currentBanSelected,
                lockIn: true
            }).catch((error) => {
                console.log(error);
            })
        }

        return (
            <> <div className={styles.championSelectorContainer}>
                {
                    filteredChampions === undefined ? (<div>Loading...</div>) :
                        Object.values(filteredChampions)
                            .sort((a, b) => {
                                if (a.name < b.name) {
                                    return -1;
                                }
                                if (a.name > b.name) {
                                    return 1;
                                }
                                return 0;
                            })
                            .map(champion =>
                                (<ChampionCard setActive={setCurrentBanSelected}
                                               isActive={champion.id === currentBanSelected} key={champion.id}
                                               id={champion.id} championName={champion.name}/>))
                }
            </div>
                {allowLockIn ? (<button  className={styles.championSelectorLockInButton} onClick={() => lockIn()}>Lock In</button>) : (<></>)}
            </>
        )

    }

    return (
        <div className={styles.mainContainer}>
            <div className={styles.myTeamSection}>
                <div className={styles.alliedBanContainer}>
                    <div className={styles.banWrapper}>
                        {
                            renderMyTeamBans(session.bans.myTeamBans, session.bans.numBans / 2)
                        }
                    </div>
                </div>
                <div className={styles.teamContainer}>
                    {
                        renderMyTeamStrategy(session)
                    }
                </div>
                <div className={styles.utilContainer}>

                </div>
            </div>
            <div className={styles.champSelectSection}>
                <div className={styles.timerContainer}>

                </div>
                <div className={styles.selectUtilContainer}>
                        {
                            renderChampionSelector(session)
                        }
                        <button onClick={() => {setRunesVisible(true)}}>Runes</button>
                </div>
            </div>
            <div className={styles.theirTeamSection}>
                <div className={styles.banContainer}>
                    {/*{*/}
                    {/*    renderTheirTeamBans(session.bans.theirTeamBans, session.bans.numBans / 2)*/}
                    {/*}*/}
                </div>
                <div className={styles.teamContainer}>
                    {

                    }
                </div>
                <div className={styles.utilContainer}>

                </div>
            </div>
            {
                runesVisible ? (<RuneSelector setVisible={setRunesVisible}/>) : (<></>)
            }
        </div>
    )
}