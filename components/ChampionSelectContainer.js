import {useEffect, useState} from "react";
import styles from '../styles/ChampionSelectContainer.module.css';
import * as Globals from "../globals";

export default function ChampionSelectContainer({session}) {
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
        if (!timer) return renderMyTeam_PLANNING(myTeam);
        let timerPhase = session.timer.phase;
        console.log("Current Phase " + timerPhase);
        switch (timerPhase) {
            case 'PLANNING':
                return renderMyTeam_PLANNING(myTeam);
            break;
            case 'BAN_PICK':
                return renderMyTeam_BAN_PICK(myTeam);
            break;
            case 'FINALIZATION':
                return renderMyTeam_FINALIZATION(myTeam);
            break;
            default:
                return <>Unknown Timer Phase: {timerPhase}</>
            break;
        }
    }

    const renderMyTeam_FINALIZATION = (myTeam) => {
        return (
            <>Finalization
                {renderMyTeam_BAN_PICK(myTeam)}
            </>
        );
    }

    const renderMyTeam_PLANNING = (myTeam) => {
        const myTeamArray = [];

        for (let index = 0; index < Globals.CHAMP_SELECT_MAX_MEMBERS_PER_TEAM; index++) {

            const currentSummoner = myTeam[index];
                myTeamArray.push(
                    createMyTeamPickComponent(currentSummoner, true, index)
                )
        }
        return myTeamArray;
    }

    const renderMyTeam_BAN_PICK = (myTeam) => {
        const myTeamArray = [];

        for (let index = 0; index < Globals.CHAMP_SELECT_MAX_MEMBERS_PER_TEAM; index++) {

            const currentSummoner = myTeam[index];
             {
                myTeamArray.push(
                    createMyTeamPickComponent(currentSummoner, false, index)
                )
             }
        }
        return myTeamArray;
    }

    const renderTheirTeam = (theirTeam) => {
        const theirTeamArray = [];

        for (let index = 0; index < Globals.CHAMP_SELECT_MAX_MEMBERS_PER_TEAM; index++) {

            const currentSummoner = theirTeam[index];
            if (!currentSummoner || currentSummoner.championId === 0 ) {
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

        let errorDefault = (<div className={styles.theirTeamPickComponent} key={"MyTeamPick-" + index}>
            <div className={styles.theirTeamPickImageContainer}>
                <img
                    draggable={false}
                    src={`${Globals.PROXY_STATIC_PREFIX}/lol-game-data/assets/v1/champion-icons/-1.png`}
                    alt="Icon"
                    className={styles.theirTeamPickImage}
                />
            </div>
        </div>);
        console.log("-------INDEX " + index + "-------")
        if (!currentSummoner) {
            console.log("Summoner error")
            return errorDefault;
        }

        if(useIntentAsValue) return renderPickIntent(currentSummoner, index);

        console.log(currentSummoner.pickAction);
        if (currentSummoner.pickAction) {
            console.log("Pick Action exists!");
            if (currentSummoner.banAction) {
                return renderPickAndBan(currentSummoner, index);
            } else {
                return renderPickActionOnly(currentSummoner, index);
            }

        } else {
            if (currentSummoner.banAction) {
                return renderBanActionOnly(currentSummoner, index);
            } else {
                return renderPickIntent(currentSummoner, index);
            }
        }

    }

    const renderPickActionOnly = (currentSummoner, index) => {
        if (currentSummoner.pickAction.isInProgress) {
            if (!currentSummoner.pickAction.completed) {
                if (currentSummoner.pickAction.championId === 0) {
                    currentSummoner.pickAction.championId = -1;
                }
                return (<div className={styles.myTeamPickComponent} key={"MyTeamPick-" + index}>
                    <div className={styles.myTeamPickImageContainer}>
                        <img
                            draggable={false}
                            src={`${Globals.PROXY_STATIC_PREFIX}/lol-game-data/assets/v1/champion-icons/${currentSummoner.pickAction.championId}.png`}
                            alt="Icon"
                            className={styles.myTeamPickImage}
                        />
                    </div>
                    <div>
                        <span>HOVERING PICK</span><br></br>
                        {currentSummoner.spell1Id}<br></br>
                        {currentSummoner.spell2Id}
                    </div>
                </div>)
            } else {
                return <></>;
            }
        } else {
            if (!currentSummoner.pickAction.completed) {
                return (<div className={styles.myTeamPickComponent} key={"MyTeamPick-" + index}>
                    <div className={styles.myTeamPickImageContainer}>
                        <img
                            draggable={false}
                            src={`${Globals.PROXY_STATIC_PREFIX}/lol-game-data/assets/v1/champion-icons/-1.png`}
                            alt="Icon"
                            className={styles.myTeamPickImage}
                        />
                    </div>
                    <div>
                        <span>YET TO PICK</span><br></br>
                        {currentSummoner.spell1Id}<br></br>
                        {currentSummoner.spell2Id}
                    </div>
                </div>)
            } else {
                return (<div className={styles.myTeamPickComponent} key={"MyTeamPick-" + index}>
                    <div className={styles.myTeamPickImageContainer}>
                        <img
                            draggable={false}
                            src={`${Globals.PROXY_STATIC_PREFIX}/lol-game-data/assets/v1/champion-icons/${currentSummoner.pickAction.championId}.png`}
                            alt="Icon"
                            className={styles.myTeamPickImage}
                        />
                    </div>
                    <div>
                        <span>FINAL PICK</span><br></br>
                        {currentSummoner.spell1Id}<br></br>
                        {currentSummoner.spell2Id}
                    </div>
                </div>)
            }

        }
    }

    const renderBanActionOnly = (currentSummoner, index) => {
        if (currentSummoner.banAction.isInProgress) {
            if (!currentSummoner.banAction.completed) {
                if (currentSummoner.banAction.championId === 0) {
                    currentSummoner.banAction.championId = -1;
                }
                return (<div className={styles.myTeamPickComponent} key={"MyTeamPick-" + index}>
                    <div className={styles.myTeamPickImageContainer}>
                        <img
                            draggable={false}
                            src={`${Globals.PROXY_STATIC_PREFIX}/lol-game-data/assets/v1/champion-icons/${currentSummoner.banAction.championId}.png`}
                            alt="Icon"
                            className={styles.myTeamPickImage}
                        />
                    </div>
                    <div>
                        <span>HOVERING BAN</span><br></br>
                        {currentSummoner.spell1Id}<br></br>
                        {currentSummoner.spell2Id}
                    </div>
                </div>)
            } else {
                return <></>;
            }
        } else {
            if (!currentSummoner.banAction.completed) {
                return (<div className={styles.myTeamPickComponent} key={"MyTeamPick-" + index}>
                    <div className={styles.myTeamPickImageContainer}>
                        <img
                            draggable={false}
                            src={`${Globals.PROXY_STATIC_PREFIX}/lol-game-data/assets/v1/champion-icons/-1.png`}
                            alt="Icon"
                            className={styles.myTeamPickImage}
                        />
                    </div>
                    <div>
                        <span>YET TO BAN</span><br></br>
                        {currentSummoner.spell1Id}<br></br>
                        {currentSummoner.spell2Id}
                    </div>
                </div>)
            } else {
                return (<div className={styles.myTeamPickComponent} key={"MyTeamPick-" + index}>
                    <div className={styles.myTeamPickImageContainer}>
                        <img
                            draggable={false}
                            src={`${Globals.PROXY_STATIC_PREFIX}/lol-game-data/assets/v1/champion-icons/-1.png`}
                            alt="Icon"
                            className={styles.myTeamPickImage}
                        />
                    </div>
                    <div>
                        <span>YET TO PICK</span><br></br>
                        {currentSummoner.spell1Id}<br></br>
                        {currentSummoner.spell2Id}
                    </div>
                </div>)
            }
        }
    }

    const renderPickIntent = (currentSummoner, index) => {
        console.log(currentSummoner);
        if (!currentSummoner.championPickIntent || currentSummoner.championPickIntent === 0) {
            currentSummoner.championPickIntent = currentSummoner.championId
        }
        if (currentSummoner.championPickIntent === 0 ) {
            currentSummoner.championPickIntent = -1;
        }
        return (<div className={styles.myTeamPickComponent} key={"MyTeamPick-" + index}>
            <div className={styles.myTeamPickImageContainer}>
                <img
                    draggable={false}
                    src={`${Globals.PROXY_STATIC_PREFIX}/lol-game-data/assets/v1/champion-icons/${currentSummoner.championPickIntent}.png`}
                    alt="Icon"
                    className={styles.myTeamPickImage}
                />
            </div>
            <div>
                <span>PICK INTENT</span><br></br>
                {currentSummoner.spell1Id}<br></br>
                {currentSummoner.spell2Id}
            </div>
        </div>)
    }

    const renderPickAndBan = (currentSummoner, index) => {
        return (
            <div className={styles.myTeamPickComponent} key={"MyTeamPick-" + index}>
            <div className={styles.myTeamPickImageContainer}>
                <img
                    draggable={false}
                    src={`${Globals.PROXY_STATIC_PREFIX}/lol-game-data/assets/v1/champion-icons/${currentSummoner.pickAction.championId}.png`}
                    alt="Icon"
                    className={styles.myTeamPickImage}
                />
            </div>
            <div>
                <span>BAN: {currentSummoner.banAction.championId} {currentSummoner.banAction.completed ? ("Completed") : ("Not Completed")} {currentSummoner.banAction.isInProgress ? ("In Progress") : ("--")}</span><br></br>
                <span>Pick: {currentSummoner.pickAction.championId} {currentSummoner.pickAction.completed ? ("Completed") : ("Not Completed")} {currentSummoner.pickAction.isInProgress ? ("In Progress") : ("--")}</span>
                {currentSummoner.spell1Id}<br></br>
                {currentSummoner.spell2Id}
            </div>
        </div>)
    }

    return (
        <div>
            <div className={styles.myTeamBansContainer}>
                {
                    renderMyTeamBans(session.bans.myTeamBans, session.bans.numBans/2)
                }
            </div>
            <div className={styles.theirTeamBansContainer}>
                {
                    renderTheirTeamBans(session.bans.theirTeamBans, session.bans.numBans/2)
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
        </div>
    )
}