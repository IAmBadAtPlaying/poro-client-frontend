import {useDispatch, useSelector} from 'react-redux';
import {AppState} from '../../../../../store';
import * as Globals from '../../../../../Globals';
import axios from 'axios';
import {useEffect, useState} from 'react';
import styles
    from '../../../../../styles/Application/Containers/ContainerPlay/GameflowChampSelect/ChampionSelector.module.css';
import {OwnedChampion} from '../../../../../types/Store';

export enum SelectorOptions {
    PICK,
    BAN
}

export interface ChampSelectChampion {
    championId: number,
    selectable: boolean,
    name: string
}

export interface ChampionSelectorProps {
    bannedChampionIds: number[],
    selectedChampionIds: number[],
    allowLockIn: boolean,
    selectorMode: SelectorOptions,
}

export default function ChampionSelector(
    {
        bannedChampionIds,
        selectedChampionIds,
        allowLockIn,
        selectorMode
    }: ChampionSelectorProps
) {
    const [selectedPick, setSelectedPick] = useState<number>(-1);
    const [selectedBan, setSelectedBan] = useState<number>(-1);

    const selectPickChampion = (championId: number, lockIn: boolean) => {
        // if (allowLockIn && lockIn) {
        //     const stringerHowl = new Howl(
        //         {
        //             src: [Globals.PROXY_PREFIX + '/lol-game-data/assets/v1/champion-sfx-audios/' + championId + '.ogg'],
        //             volume: 0.5
        //         }
        //     );
        //
        //     const sfxHowl = new Howl(
        //         {
        //             src: [Globals.PROXY_PREFIX + '/lol-game-data/assets/v1/champion-choose-vo/' + championId + '.ogg'],
        //             volume: 0.5
        //         }
        //     );
        //
        //     stringerHowl.load();
        //     sfxHowl.load();
        //
        //     stringerHowl.play();
        //     sfxHowl.play();
        // }

        axios.post(
            Globals.REST_PREFIX + '/champSelect/pick',
            {
                championId: championId,
                lockIn: allowLockIn ? lockIn : false
            }
        ).then(
            () => {
            }
        ).catch(
            () => {
            }
        );
    };

    const selectBanChampion = (championId: number, lockIn: boolean) => {
        // if (allowLockIn && lockIn) {
        //     const sfHowl = new Howl(
        //         {
        //             src: [Globals.PROXY_PREFIX + '/lol-game-data/assets/v1/champion-ban-vo/' + championId + '.ogg'],
        //             volume: 0.5
        //         }
        //     );
        //
        //     sfHowl.load();
        //     sfHowl.play();
        // }
        axios.post(
            Globals.REST_PREFIX + '/champSelect/ban',
            {
                championId: championId,
                lockIn: allowLockIn ? lockIn : false
            }
        ).then(
            () => {
            }
        ).catch(
            () => {
            }
        );
    };


    useEffect(
        () => {
            if (selectedPick !== -1) {
                selectPickChampion(
                    selectedPick,
                    false
                );
            }
        },
        [selectedPick]
    );

    useEffect(
        () => {
            if (selectedBan !== -1) {
                selectBanChampion(
                    selectedBan,
                    false
                );
            }
        },
        [selectedBan]
    );

    const champions = useSelector((state: AppState) => state.champions);
    const ownedChampions = useSelector((state: AppState) => state.ownedChampions);
    const skins = useSelector((state: AppState) => state.skins);

    const selectableChampions = [] as ChampSelectChampion[];
    switch (selectorMode) {
        case SelectorOptions.BAN:
            Object.values(champions).forEach(champion => {
                const csChampion = {
                    championId: champion.id,
                    selectable: !bannedChampionIds.includes(champion.id),
                    name: champion.name
                };
                selectableChampions.push(csChampion);
            });
            break;
        case SelectorOptions.PICK:
            Object.values(ownedChampions).forEach((champion: OwnedChampion) => {
                const selectable = !selectedChampionIds.includes(champion.itemId) && !bannedChampionIds.includes(champion.itemId);

                const csChampion = {
                    championId: champion.itemId,
                    selectable: selectable,
                    name: champions[champion.itemId].name
                };

                selectableChampions.push(csChampion);
            });
    }

    const getChampionTile = (championId: number) => {
        const championBaseSkinId = championId * 1000;

        if (skins[championBaseSkinId]) {
            return Globals.PROXY_STATIC_PREFIX + skins[championBaseSkinId].splashPath;
        } else {
            return '';
        }


    };


    const handleChampionClick = (championId: number) => {
        switch (selectorMode) {
            case SelectorOptions.BAN:
                setSelectedBan(championId);
                break;
            case SelectorOptions.PICK:
                setSelectedPick(championId);
        }
    };

    const checkIfActive = (championId: number) => {
        switch (selectorMode) {
            case SelectorOptions.BAN:
                return selectedBan === championId;
            case SelectorOptions.PICK:
                return selectedPick === championId;
        }
    };

    const handleLockIn = () => {
        switch (selectorMode) {
            case SelectorOptions.BAN:
                selectBanChampion(
                    selectedBan,
                    true
                );
                break;
            case SelectorOptions.PICK:
                selectPickChampion(
                    selectedPick,
                    true
                );
        }
    };

    console.log(bannedChampionIds);

    return (
        <div className={styles.champSelectContainer}>
            {
                selectableChampions
                    .sort(
                        (a, b) => {
                            return a.name.localeCompare(b.name);
                        }
                    )
                    .map(champion => {
                        return (
                            <div className={styles.contentWrapper} key={champion.championId}>
                                <div className={Globals.applyMultipleStyles(
                                    styles.innerCard,
                                    checkIfActive(champion.championId) ? styles.active : ''
                                )} onClick={() => {
                                    champion.selectable ? handleChampionClick(champion.championId) : () => {
                                    }
                                    ;
                                }}>
                                    <div className={styles.imageContainer}>
                                        <img className={Globals.applyMultipleStyles(
                                            styles.championImage,
                                            champion.selectable ? '' : styles.unselectable
                                        )} src={getChampionTile(champion.championId)} alt=""/>
                                    </div>
                                </div>
                            </div>
                        );
                    })
            }
            {
                allowLockIn ? (
                    <div className={styles.buttonContainer}>
                        <button onClick={handleLockIn} className={styles.button}>
                            Lock In
                        </button>
                    </div>
                ) : <></>
            }
        </div>
    );
}