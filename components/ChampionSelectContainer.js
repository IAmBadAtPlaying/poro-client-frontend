import {useEffect, useState} from "react";
import styles from '../styles/ChampionSelectContainer.module.css';
import Image from "next/image";
import * as Globals from "../globals";

export default function ChampionSelectContainer({session}) {

    if (!session.bans) {
        session.bans = {}
    }
    if (!session.bans.myTeamBans) session.bans.myTeamBans = [];
    if (!session.bans.theirTeamBans) session.bans.theirTeamBans = [];


    const renderMyTeamBans = (passedBans, maxBans) => {
        const bans = [];

        for (let index = 0; index < Globals.CHAMP_SELECT_MAX_BANS_PER_TEAM; index++) {
            const championValue = passedBans[index];

            console.log(`${index} ${championValue}`);

            if (index >= maxBans) {
                bans.push(
                    <div className={styles.myTeamBansComponent} key={"MyTeamBan-" + index}>
                        <div className={styles.myTeamBansComponent}>
                        </div>
                    </div>
                )
                continue;
            }
            if (!championValue) {
                bans.push(
                    <div className={styles.myTeamBansComponent} key={"MyTeamBan-" + index}>
                        <div className={styles.myTeamBansComponent}>
                            <img
                                src={`${Globals.PROXY_STATIC_PREFIX}/lol-game-data/assets/v1/champion-icons/-1.png`}
                                alt="Icon"
                                className={styles.myTeamBansImage}
                            />
                        </div>
                    </div>
                );
            } else {
                bans.push(
                    <div className={styles.myTeamBansComponent} key={"MyTeamBan-" + index}>
                        <div className={styles.myTeamBansComponent}>
                            <img
                                src={`${Globals.PROXY_STATIC_PREFIX}/lol-game-data/assets/v1/champion-tiles/${championValue}/${championValue}000.jpg`}
                                alt="Icon"
                                className={styles.myTeamBansImage}
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
                        <div className={styles.theirTeamBansComponent}>
                        </div>
                    </div>
                )
                continue;
            }
            if (!championValue) {
                bans.push(
                    <div className={styles.theirTeamBansComponent} key={"MyTeamBan-" + index}>
                        <div className={styles.theirTeamBansComponent}>
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
                        <div className={styles.theirTeamBansComponent}>
                            <img
                                src={`${Globals.PROXY_STATIC_PREFIX}/lol-game-data/assets/v1/champion-tiles/${championValue}/${championValue}000.jpg`}
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

            </div>
        </div>
    )
}