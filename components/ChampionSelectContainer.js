import {useEffect, useState} from "react";
import styles from '../styles/champSelect/ChampionSelectContainer.module.css';
import {getChampions, getChromaSkins, getSpells} from "../pages";
import * as Globals from "../globals";
import ChampionCard from "./ChampionCard";
import {PROXY_STATIC_PREFIX} from "../globals";
import axios from "axios";
import RuneSelector from "./RuneSelector";

export default function ChampionSelectContainer({session}) {
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
    }, [currentBanSelected])

    useEffect(() => {
        axios.post(Globals.REST_PREFIX + "/champSelect/pick", {
            championId: currentPickSelected,
            lockIn: false
        }).catch((error) => {
            console.log(error);
        })
    }, [currentPickSelected])

    const lockIn = () => {
        axios.post(Globals.REST_PREFIX + "/champSelect/pick", {
            championId: currentPickSelected,
            lockIn: true
        }).catch((error) => {
            console.log(error);
        })
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
                bans.push(
                    <div className={styles.myTeamBansComponent} key={"MyTeamBan-" + index}>
                        <div className={styles.myTeamBansImageContainer}>
                        </div>
                    </div>
                )
                continue;
            }
            if (!championValue) {
                bans.push(
                    <div className={styles.myTeamBansComponent} key={"MyTeamBan-" + index}>
                        <div className={styles.myTeamBansImageContainer}>
                            <img
                                src={`${Globals.PROXY_STATIC_PREFIX}/lol-game-data/assets/v1/champion-icons/-1.png`}
                                alt="Icon"
                                className={styles.myTeamBansImage}
                                draggable={false}
                            />
                        </div>
                    </div>
                );
            } else {
                bans.push(
                    <div className={styles.myTeamBansComponent} key={"MyTeamBan-" + index}>
                        <div className={styles.myTeamBansImageContainer}>
                            <img
                                src={`${Globals.PROXY_STATIC_PREFIX}/lol-game-data/assets/v1/champion-icons/${championValue}.png`}
                                alt="Icon"
                                className={styles.myTeamBansImage}
                                draggable={false}
                            />
                        </div>
                    </div>
                );
            }
        }

        return bans;
    };

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
        if (!timer) return renderMyTeam(myTeam, true);
        let timerPhase = session.timer.phase;
        console.log("Current Phase " + timerPhase);
        switch (timerPhase) {
            case 'PLANNING':
            case 'BAN_PICK':
            case 'FINALIZATION':
                return renderMyTeam(myTeam, false);
            default:
                return <>Unknown Timer Phase: {timerPhase}</>
        }
    }

    const renderMyTeam = (myTeam, useIntentAsValue) => {
        const myTeamArray = [];

        for (let index = 0; index < Globals.CHAMP_SELECT_MAX_MEMBERS_PER_TEAM; index++) {

            const currentSummoner = myTeam[index];
            {
                myTeamArray.push(
                    createMyTeamPickComponent(currentSummoner, useIntentAsValue, index)
                )
            }
        }
        return myTeamArray;
    }

    const renderTheirTeam = (theirTeam) => {
        const theirTeamArray = [];

        for (let index = 0; index < Globals.CHAMP_SELECT_MAX_MEMBERS_PER_TEAM; index++) {

            const currentSummoner = theirTeam[index];
            if (!currentSummoner || currentSummoner.championId === 0) {
                theirTeamArray.push(
                    <div className={styles.theirTeamPickComponent} key={"MyTeamPick-" + index}>
                        <div className={styles.theirTeamPickImageContainer}>
                            <img
                                draggable={false}
                                src={`${Globals.PROXY_STATIC_PREFIX}/lol-game-data/assets/v1/champion-icons/-1.png`}
                                alt="Icon"
                                className={styles.theirTeamPickImage}
                            />
                        </div>
                    </div>
                )
            } else {
                theirTeamArray.push(
                    <div className={styles.theirTeamPickComponent} key={"MyTeamPick-" + index}>
                        <div className={styles.theirTeamPickImageContainer}>
                            <img
                                draggable={false}
                                src={`${Globals.PROXY_STATIC_PREFIX}/lol-game-data/assets/v1/champion-icons/${currentSummoner.championId}.png`}
                                alt="Icon"
                                className={styles.theirTeamPickImage}
                            />
                        </div>
                        <div>
                            <span>TEST</span><br></br>
                            {currentSummoner.spell1Id}<br></br>
                            {currentSummoner.spell2Id}
                        </div>
                    </div>
                )
            }
        }
        return theirTeamArray;
    }

    const createMyTeamPickComponent = (currentSummoner, useIntentAsValue, index) => {
        let errorDefault = (
            <div className={styles.myTeamPickComponent} key={"MyTeamPick-" + index}>
                <div className={styles.testPickSummonerSpellSection}>
                    <div className={styles.testPickSummonerSpellImageContainer}>
                        <img
                            className={styles.myTeamPickSummonerSpellImage}
                            draggable={false}
                            alt={""}
                            src={""}
                        />
                    </div>
                    <div className={styles.testPickSummonerSpellImageContainer}>

                    </div>
                </div>
                <div className={styles.testPickChampionIconSection}>
                    <div className={styles.testPickChampionIconImageContainer}>
                        <div className={styles.testPickChampionIconImageMask}>
                            <img
                                draggable={false}
                                src={`${Globals.PROXY_STATIC_PREFIX}/lol-game-data/assets/v1/champion-icons/-1.png`}
                                alt="Icon"
                                className={styles.myTeamPickImage}
                            />
                        </div>
                    </div>
                </div>
                <div className={styles.testPickInfoSection}>
                    <div className={styles.testPickInfoPosition}>
                        <span></span>
                    </div>
                    <div className={styles.testPickInfoChampionName}>
                        <span></span>
                    </div>
                    <div className={styles.testPickInfoSummonerName}>

                    </div>
                </div>
            </div>);
        console.log("-------INDEX " + index + "-------")
        if (!currentSummoner) {
            console.log("Summoner error")
            return errorDefault;
        }
        console.log(currentSummoner.stateDebug);
        console.log(currentSummoner.state);

        return renderState(currentSummoner, index);

    }

    const renderState = (currentSummoner, index) => {
        if (!currentSummoner) return (<></>);
        if (!currentSummoner.state) return (<></>);

        let state = currentSummoner.stateDebug;
        console.log("" + index + " " + state)
        switch (state) {
            case 'PREPARATION':
                return renderSummonerPREPARATION(currentSummoner, index);
            case 'BANNING':
                return renderSummonerBANNING(currentSummoner, index);
            case 'AWAITING_PICK':
                return renderSummonerAWAITING_PICK(currentSummoner, index);
            case 'AWAITING_BAN_RESULT':
                return renderSummonerAWAITING_BAN_RESULT(currentSummoner, index);
            case 'PICKING_WITH_BAN':
            case 'PICKING_WITHOUT_BAN':
                console.log("PICKING_WITH_BAN")
                return renderSummonerPICKING(currentSummoner, index);
            case 'AWAITING_FINALIZATION':
                return renderSummonerAWAITING_FINALIZATION(currentSummoner, index);
            case 'FINALIZATION':
                return renderSummonerFINALIZATION(currentSummoner, index);
            default:
                return <>Unknown State: {state}</>
        }
    }

    const renderSummonerPREPARATION = (currentSummoner, index) => {
        //TODO: Pick Intent, pickAction read just read the intent

        if (currentSummoner.championPickIntent === 0) {
            currentSummoner.championPickIntent = -1;
        }

        console.log(currentSummoner.assignedPosition)
        if (currentSummoner.assignedPosition === undefined) {
            currentSummoner.assignedPosition = "";
        }

        return (
            <div className={styles.myTeamPickComponent} key={"MyTeamPick-" + index}>
                <div className={styles.testPickSummonerSpellSection}>
                    <div className={styles.testPickSummonerSpellImageContainer}>
                        <img
                            className={styles.myTeamPickSummonerSpellImage}
                            draggable={false}
                            alt={""}
                            src={getPathFromSpellId(currentSummoner.spell1Id)}
                        />
                    </div>
                    <div className={styles.testPickSummonerSpellImageContainer}>
                        <img
                            className={styles.myTeamPickSummonerSpellImage}
                            draggable={false}
                            alt={"Summoner Spell"}
                            src={getPathFromSpellId(currentSummoner.spell2Id)}
                        />
                    </div>
                </div>
                <div className={styles.testPickChampionIconSection}>
                    <div className={styles.testPickChampionIconImageContainer}>
                        <div className={styles.testPickChampionIconImageMask}>
                            <img
                                draggable={false}
                                src={`${Globals.PROXY_STATIC_PREFIX}/lol-game-data/assets/v1/champion-icons/${currentSummoner.championPickIntent}.png`}
                                alt="Icon"
                                className={styles.myTeamPickImage}
                            />
                        </div>
                    </div>
                </div>
                <div className={styles.testPickInfoSection}>
                    <div className={styles.testPickInfoPosition}>
                        <span>Declaring Intent</span>
                    </div>
                    <div className={styles.testPickInfoChampionName}>
                        <span>{getPositionFromInternalName(currentSummoner.assignedPosition)}</span>
                    </div>
                    <div className={styles.testPickInfoSummonerName}>

                    </div>
                </div>
            </div>
        );
    }

    const renderSummonerBANNING = (currentSummoner, index) => {
        //TODO: Read banAction, Ban is actively in progress
        if (currentSummoner.banAction === undefined) {
            return (
                <div className={styles.myTeamPickComponent} key={"MyTeamPick-" + index}>

                </div>
            );
        }

        if (currentSummoner.banAction.championId === 0) {
            currentSummoner.banAction.championId = -1;
        }

        return (
            <div className={styles.myTeamPickComponent} key={"MyTeamPick-" + index}>
                <div className={styles.testPickChampionStateIndicatorBANNING}>

                </div>
                <div className={styles.testPickSummonerSpellSection}>
                </div>
                <div className={styles.testPickChampionIconSection}>
                    <div className={styles.testPickChampionIconImageContainer}>
                        <div className={styles.testPickChampionIconImageMaskBAN}>
                            <img
                                draggable={false}
                                src={`${Globals.PROXY_STATIC_PREFIX}/lol-game-data/assets/v1/champion-icons/${currentSummoner.banAction.championId}.png`}
                                alt="Icon"
                                className={styles.myTeamPickImage}
                            />
                        </div>
                    </div>
                </div>
                <div className={styles.testPickInfoSection}>
                    <div className={styles.testPickInfoPosition}>
                        <span>Banning ...</span>
                    </div>
                    <div className={styles.testPickInfoChampionName}>
                    </div>
                    <div className={styles.testPickInfoSummonerName}>

                    </div>
                </div>
            </div>);
    }

    const renderSummonerAWAITING_BAN_RESULT = (currentSummoner, index) => {
        //TODO: Read ban action, Ban is not in progress, completed! this might never happen lookin at the logic
        return (
            <div className={styles.myTeamPickComponent} key={"MyTeamPick-" + index}>

            </div>
        );
    }

    const renderSummonerAWAITING_PICK = (currentSummoner, index) => {
        //TODO: Show the pick intent, pick action is not in progress NO summoner spells

        if (currentSummoner.championPickIntent === 0) {
            currentSummoner.championPickIntent = -1;
        }

        return (
            <div className={styles.myTeamPickComponent} key={"MyTeamPick-" + index}>
                <div className={styles.testPickSummonerSpellSection}>
                    <div className={styles.testPickSummonerSpellImageContainer}>
                        <img
                            className={styles.myTeamPickSummonerSpellImage}
                            draggable={false}
                            alt={"Summoner Spell"}
                            src={getPathFromSpellId(currentSummoner.spell1Id)}
                        />
                    </div>
                    <div className={styles.testPickSummonerSpellImageContainer}>
                        <img
                            className={styles.myTeamPickSummonerSpellImage}
                            draggable={false}
                            alt={"Summoner Spell"}
                            src={getPathFromSpellId(currentSummoner.spell2Id)}
                        />
                    </div>
                </div>
                <div className={styles.testPickChampionIconSection}>
                    <div className={styles.testPickChampionIconImageContainer}>
                        <div className={styles.testPickChampionIconImageMask}>
                            <img
                                draggable={false}
                                src={`${Globals.PROXY_STATIC_PREFIX}/lol-game-data/assets/v1/champion-icons/${currentSummoner.championPickIntent}.png`}
                                alt="Icon"
                                className={styles.myTeamPickImage}
                            />
                        </div>
                    </div>
                </div>
                <div className={styles.testPickInfoSection}>
                    <div className={styles.testPickInfoPosition}>
                        <span></span>
                    </div>
                    <div className={styles.testPickInfoChampionName}>
                        <span><b>{champions[currentSummoner.championPickIntent].name}</b></span>
                    </div>
                    <div className={styles.testPickInfoSummonerName}>

                    </div>
                </div>
            </div>
        );
    }

    const renderSummonerPICKING = (currentSummoner, index) => {
        //TODO: Show the pick action champId, pick action is in progress, summoner spells

        if (currentSummoner.pickAction === undefined) {
            return (
                <div className={styles.myTeamPickComponent} key={"MyTeamPick-" + index}>

                </div>
            );
        }

        if (currentSummoner.pickAction.championId === 0) {
            currentSummoner.pickAction.championId = -1;
        }

        return (
            <div className={styles.myTeamPickComponent} key={"MyTeamPick-" + index}>
                <div className={(currentSummoner.cellId === session.localPlayerCellId) ? styles.testPickChampionStateIndicatorPICKING_SELF : styles.testPickChampionStateIndicatorPICKING}>

                </div>
                <div className={styles.testPickSummonerSpellSection}>
                    <div className={styles.testPickSummonerSpellImageContainer}>
                        <img
                            className={styles.myTeamPickSummonerSpellImage}
                            draggable={false}
                            alt={"Summoner Spell"}
                            src={getPathFromSpellId(currentSummoner.spell1Id)}
                        />
                    </div>
                    <div className={styles.testPickSummonerSpellImageContainer}>
                        <img
                            className={styles.myTeamPickSummonerSpellImage}
                            draggable={false}
                            alt={"Summoner Spell"}
                            src={getPathFromSpellId(currentSummoner.spell2Id)}
                        />
                    </div>
                </div>
                <div className={styles.testPickChampionIconSection}>
                    <div className={styles.testPickChampionIconImageContainer}>
                        <div className={styles.testPickChampionIconImageMask}>
                            <img
                                draggable={false}
                                src={`${Globals.PROXY_STATIC_PREFIX}/lol-game-data/assets/v1/champion-icons/${currentSummoner.pickAction.championId}.png`}
                                alt="Icon"
                                className={styles.myTeamPickImage}
                            />
                        </div>
                    </div>
                </div>
                <div className={styles.testPickInfoSection}>
                    <div className={styles.testPickInfoPosition}>
                        <span>Picking...</span>
                    </div>
                    <div className={styles.testPickInfoChampionName}>
                        <span><b>{champions[currentSummoner.pickAction.championId].name}</b></span>
                    </div>
                    <div className={styles.testPickInfoSummonerName}>

                    </div>
                </div>
            </div>
        );
    }

    const renderSummonerAWAITING_FINALIZATION = (currentSummoner, index) => {
        //TODO: Show the pick action, pick action is not in progress, completed! summoner spells skins

        if (currentSummoner.pickAction === undefined) {
            return (
                <div className={styles.myTeamPickComponent} key={"MyTeamPick-" + index}>

                </div>
            );
        }
        return (
            <div className={styles.myTeamPickComponent} key={"MyTeamPick-" + index}>
                <div className={styles.testPickSummonerSpellSection}>
                    <div className={styles.testPickSummonerSpellImageContainer}>
                        <img
                            className={styles.myTeamPickSummonerSpellImage}
                            draggable={false}
                            alt={"Summoner Spell"}
                            src={getPathFromSpellId(currentSummoner.spell1Id)}
                        />
                    </div>
                    <div className={styles.testPickSummonerSpellImageContainer}>
                        <img
                            className={styles.myTeamPickSummonerSpellImage}
                            draggable={false}
                            alt={"Summoner Spell"}
                            src={getPathFromSpellId(currentSummoner.spell2Id)}
                        />
                    </div>
                </div>
                <div className={styles.testPickChampionIconSection}>
                    <div className={styles.testPickChampionIconImageContainer}>
                        <div className={styles.testPickChampionIconImageMask}>
                            <img
                                draggable={false}
                                src={`${Globals.PROXY_STATIC_PREFIX}/lol-game-data/assets/v1/champion-icons/${currentSummoner.pickAction.championId}.png`}
                                alt="Icon"
                                className={styles.myTeamPickImage}
                            />
                        </div>
                    </div>
                </div>
                <div className={styles.testPickInfoSection}>
                    <div className={styles.testPickInfoPosition}>
                        <span>{getPositionFromInternalName(currentSummoner.assignedPosition)}</span>
                    </div>
                    <div className={styles.testPickInfoChampionName}>
                        <span><b>{champions[currentSummoner.championId].alias}</b></span>
                    </div>
                    <div className={styles.testPickInfoSummonerName}>

                    </div>
                </div>
            </div>
        );
    }

    const renderSummonerFINALIZATION = (currentSummoner, index) => {
        //TODO: Show pick action, pick action is in progress, summoner spells skins;
        return (
            <div className={styles.myTeamPickComponent} key={"MyTeamPick-" + index}>
                <div className={styles.testBackgroundImageContainer}>
                    <img className={styles.testBackgroundImage} src={`${Globals.PROXY_STATIC_PREFIX}/lol-game-data/assets/v1/champion-splashes/${currentSummoner.championId}/${getSplashArtFromChromaId(currentSummoner.selectedSkinId)}.jpg`}>
                    </img>
                    <div>

                    </div>
                </div>
                <div className={styles.testPickSummonerSpellSection}>
                    <div className={styles.testPickSummonerSpellImageContainer}>
                        <img
                            className={styles.myTeamPickSummonerSpellImage}
                            draggable={false}
                            alt={"Summoner Spell"}
                            src={getPathFromSpellId(currentSummoner.spell1Id)}
                        />
                    </div>
                    <div className={styles.testPickSummonerSpellImageContainer}>
                        <img
                            className={styles.myTeamPickSummonerSpellImage}
                            draggable={false}
                            alt={"Summoner Spell"}
                            src={getPathFromSpellId(currentSummoner.spell2Id)}
                        />
                    </div>
                </div>
                <div className={styles.testPickChampionIconSection}>
                    <div className={styles.testPickChampionIconImageContainer}>
                        <div className={styles.testPickChampionIconImageMask}>
                            <img
                                draggable={false}
                                src={`${Globals.PROXY_STATIC_PREFIX}/lol-game-data/assets/v1/champion-icons/${currentSummoner.championId}.png`}
                                alt="Icon"
                                className={styles.myTeamPickImage}
                            />
                        </div>
                    </div>
                </div>
                <div className={styles.testPickInfoSection}>
                    <div className={styles.testPickInfoPosition}>
                        <span>{currentSummoner.assignedPosition}</span>
                    </div>
                    <div className={styles.testPickInfoChampionName}>
                        <span><b>{champions[currentSummoner.championId].name}</b></span>
                    </div>
                    <div className={styles.testPickInfoSummonerName}>

                    </div>
                </div>
            </div>
        );
    }


    const renderChampionSelector = (session) => {
        let errorResponse = (<></>);
        if (session === undefined) return errorResponse;
        if (session.localPlayerPhase === undefined) return errorResponse;
        switch (session.localPlayerPhase) {
            case 'PREPARATION':
                return renderPickContainer(false)
            case 'BANNING':
                return renderBanContainer(true)
            case 'AWAITING_PICK':
                return renderPickContainer(false)
            case 'AWAITING_BAN_RESULT':
                return errorResponse;
            case 'PICKING_WITH_BAN':
            case 'PICKING_WITHOUT_BAN':
                return renderPickContainer(true);
            case 'AWAITING_FINALIZATION':
                return errorResponse;
            case 'FINALIZATION':
                return errorResponse;
            default:
                return <>Unknown Phase: {session.localPlayerPhase}</>
        }
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

    const renderPickContainer = (allowLockIn) => {


        return (
            <> <input
                type="text"
                placeholder="Search champions by name"
                onChange={handleSearch}
                className={styles.searchInput}
            />
                <div className={styles.championSelectorContainer}>
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
                </div>
                {allowLockIn ? (<button className={styles.championSelectorLockInButton} onClick={() => lockIn()}>Lock
                    In</button>) : (<></>)}
            </>
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
        <div>
            <div className={styles.myTeamBansContainer}>
                {
                    renderMyTeamBans(session.bans.myTeamBans, session.bans.numBans / 2)
                }
            </div>
            <div className={styles.theirTeamBansContainer}>
                {
                    renderTheirTeamBans(session.bans.theirTeamBans, session.bans.numBans / 2)
                }
            </div>
            <div className={styles.myTeamPickContainer}>
                {
                    renderMyTeamStrategy(session)
                }
            </div>
            <div className={styles.theirTeamPickContainer}>
                {
                    renderTheirTeam(session.theirTeam)
                }
            </div>
            <div>
                {
                    renderChampionSelector(session)
                }
            </div>
            <div className={styles.runeButtonContainer}>
                <button onClick={() => setRunesVisible(true)}>Set Runes</button>
            </div>
            {
                runesVisible ? (<RuneSelector setVisible={setRunesVisible}/>) : (<></>)
            }
        </div>
    )
}