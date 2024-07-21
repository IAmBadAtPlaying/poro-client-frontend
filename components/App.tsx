import {useDispatch, useSelector} from 'react-redux';
import axios from 'axios';
import styles from '../styles/App.module.css';
import * as Globals from '../Globals';
import {
    ACTION_SET_CHAMPIONS,
    ACTION_SET_PATCHER_STATE,
    ACTION_SET_GAMEFLOW_STATE,
    ACTION_SET_INTERNAL_STATE,
    ACTION_SET_SELF_PRESENCE,
    AppState,
    ACTION_UPDATE_FRIEND,
    ACTION_SET_FRIENDS,
    ACTION_SET_INVITATIONS,
    ACTION_SET_TICKER_MESSAGES,
    ACTION_SET_LOBBY_STATE,
    ACTION_SET_LOOT_STATE,
    ACTION_SET_MAP_ASSETS,
    ACTION_SET_CURRENT_SUMMONER,
    ACTION_SET_MATCHMAKING_SEARCH_STATE,
    ACTION_SET_HONOR_EOG_STATE,
    ACTION_SET_FRIEND_GROUPS,
    ACTION_SET_SINGLE_FRIEND_GROUP,
    ACTION_SET_CHAMP_SELECT_STATE,
    ACTION_SET_SKINS,
    ACTION_SET_SKINS_BY_CHAMPION,
    ACTION_SET_CHROMA_TO_PARENT_SKIN,
    ACTION_SET_SUMMONER_SPELLS,
    ACTION_SET_QUEUES,
    ACTION_SET_OWNED_CHAMPIONS,
    ACTION_SET_OWNED_SKINS, ACTION_SET_WINDOW_FOCUSED, ACTION_SET_ALL_DATA_LOADED
} from '../store';
import {
    ChampionState, ChampSelectState, CurrentSummonerState, EOGHonorState, Friend, FriendGroup,
    GameflowState,
    InternalState, Invitation, LobbyState, LootState, MapAssetAssets, MatchmakingSearchState,
    MinimalChampion, OwnedChampion, OwnedChampionState, OwnedSkin, PatcherState,
    PresenceState, Queue, RemoteMapAssets, Skin, SummonerSpell, TickerMessage
} from '../types/Store';
import {useEffect, useState} from 'react';
import DynamicBackground from '../components/DynamicBackground';
import Application from '../components/Application';
import LoadingComponent from '../components/LoadingComponent';
import BugReporter from '../components/BugReporter';

export default function App() {

    const dispatch = useDispatch();

    const internalState = useSelector((state: AppState) => state.internalState);
    const allDataLoaded = useSelector((state: AppState) => state.allDataLoaded);
    const [connected, setConnected] = useState(false);


    let socket: WebSocket;

    interface Message {
        event: string;
        data: object | object[];
    }

    const handleVisibilityChange = () => {
        if (document.hidden) {
            console.log('The tab is now inactive.');
        } else {
            console.log('The tab is now active.');
        }
    };

    useEffect(
        () => {
            document.addEventListener(
                'visibilitychange',
                handleVisibilityChange
            );

            document.body.style.overflow = 'hidden';
            setTimeout(
                () => {
                    console.log('Initiating WebSocket Connection!');
                    connect();
                },
                1000
            );

            return () => {
                document.removeEventListener(
                    'visibilitychange',
                    handleVisibilityChange
                );

                if (socket === undefined) {
                    return;
                }
                socket.onclose = function () {
                };
                socket.close();
            };
        },
        []
    );

    useEffect(
        () => {
            if (!connected) {
                resetStates();
            }
        },
        [connected]
    );


    useEffect(
        () => {
            if (internalState?.state != Globals.BACKEND_STATE_CONNECTED) {
                return;
            }
            fetchStaticData();
        },
        [internalState]
    );

    function resetStates() {
        dispatch(
            ACTION_SET_CHAMP_SELECT_STATE(
                {}
            )
        );
        dispatch(
            ACTION_SET_CHAMPIONS(
                {}
            )
        );
        dispatch(
            ACTION_SET_GAMEFLOW_STATE(
                {}
            )
        );
        dispatch(
            ACTION_SET_INTERNAL_STATE(
                {}
            )
        );
        dispatch(
            ACTION_SET_SELF_PRESENCE(
                {}
            )
        );
        dispatch(
            ACTION_SET_PATCHER_STATE(
                {}
            )
        );
        dispatch(
            ACTION_SET_FRIENDS(
                {}
            )
        );
        dispatch(
            ACTION_SET_FRIEND_GROUPS(
                []
            )
        );
        dispatch(
            ACTION_SET_LOBBY_STATE(
                {}
            )
        );
        dispatch(
            ACTION_SET_LOOT_STATE({}
            )
        );
        dispatch(
            ACTION_SET_INVITATIONS(
                []
            )
        );
        dispatch(
            ACTION_SET_TICKER_MESSAGES(
                []
            )
        );
        dispatch(
            ACTION_SET_ALL_DATA_LOADED(
                false
            )
        );
    }

    const handleMessage = (messageText: string) => {
        if (messageText === '') {
            return;
        }
        try {
            const message: Message = JSON.parse(messageText);
            console.log(message);
            switch (message.event) {
                case Globals.UPDATES.INITIAL_FRIEND_LIST_UPDATE:
                    dispatch(
                        ACTION_SET_FRIENDS(
                            message.data as Record<string, Friend>
                        )
                    );
                    break;
                case Globals.UPDATES.FRIEND_UPDATE:
                    dispatch(
                        ACTION_UPDATE_FRIEND(
                            message.data as Friend
                        )
                    );
                    break;
                case Globals.UPDATES.INITIAL_SELF_PRESENCE_STATE_UPDATE:
                case Globals.UPDATES.SELF_PRESENCE_STATE_UPDATE:
                    dispatch(
                        ACTION_SET_SELF_PRESENCE(
                            message.data as (PresenceState | Record<string, never>)
                        )
                    );
                    break;
                case Globals.UPDATES.INITIAL_LOBBY_STATE_UPDATE:
                case Globals.UPDATES.LOBBY_STATE_UPDATE:
                    dispatch(
                        ACTION_SET_LOBBY_STATE(
                            message.data as (LobbyState | Record<string, never>)
                        )
                    );
                    break;
                case Globals.UPDATES.INITIAL_CHAMPION_SELECT_UPDATE:
                case Globals.UPDATES.CHAMPION_SELECT_UPDATE:
                    dispatch(
                        ACTION_SET_CHAMP_SELECT_STATE(
                            message.data as ChampSelectState
                        )
                    );
                    break;
                case Globals.UPDATES.INITIAL_LOOT_UPDATE:
                case Globals.UPDATES.LOOT_UPDATE:
                    dispatch(
                        ACTION_SET_LOOT_STATE(
                            message.data as (LootState | Record<string, never>)
                        )
                    );
                    break;
                case Globals.UPDATES.INITIAL_PATCHER_STATE_UPDATE:
                case Globals.UPDATES.PATCHER_STATE_UPDATE:
                    dispatch(
                        ACTION_SET_PATCHER_STATE(
                            message.data as (PatcherState | Record<string, never>)
                        )
                    );
                    break;
                case Globals.UPDATES.INTERNAL_STATE_UPDATE:
                case Globals.UPDATES.INITIAL_INTERNAL_STATE_UPDATE:
                    dispatch(
                        ACTION_SET_INTERNAL_STATE(
                            message.data as (InternalState | Record<string, never>)
                        )
                    );
                    break;
                case Globals.UPDATES.INITIAL_TICKER_MESSAGE_ARRAY_UPDATE:
                case Globals.UPDATES.TICKER_MESSAGE_ARRAY_UPDATE:
                    dispatch(
                        ACTION_SET_TICKER_MESSAGES(
                            message.data as TickerMessage[]
                        )
                    );
                    break;
                case Globals.UPDATES.INITIAL_INVITATIONS_ARRAY_UPDATE:
                case Globals.UPDATES.INVITATIONS_ARRAY_UPDATE:
                    dispatch(
                        ACTION_SET_INVITATIONS(
                            message.data as Invitation[]
                        )
                    );
                    break;
                case Globals.UPDATES.FRIEND_GROUP_UPDATE:
                    dispatch(
                        ACTION_SET_SINGLE_FRIEND_GROUP(
                            message.data as FriendGroup
                        )
                    );
                    break;
                case Globals.UPDATES.INITIAL_FRIEND_GROUP_UPDATE:
                    dispatch(
                        ACTION_SET_FRIEND_GROUPS(
                            message.data as FriendGroup[]
                        )
                    );
                    break;
                case Globals.UPDATES.INITIAL_CURRENT_SUMMONER_UPDATE:
                case Globals.UPDATES.CURRENT_SUMMONER_UPDATE:
                    dispatch(
                        ACTION_SET_CURRENT_SUMMONER(
                            message.data as CurrentSummonerState
                        )
                    );
                    break;
                case Globals.UPDATES.INITIAL_MATCHMAKING_SEARCH_STATE_UPDATE:
                case Globals.UPDATES.MATCHMAKING_SEARCH_STATE_UPDATE:
                    dispatch(
                        ACTION_SET_MATCHMAKING_SEARCH_STATE(
                            message.data as MatchmakingSearchState
                        )
                    );
                    break;
                case Globals.UPDATES.INITIAL_HONOR_EOG_UPDATE:
                case Globals.UPDATES.HONOR_EOG_UPDATE:
                    dispatch(
                        ACTION_SET_HONOR_EOG_STATE(
                            message.data as EOGHonorState
                        )
                    );
                    break;
                case Globals.UPDATES.INITIAL_GAMEFLOW_PHASE_UPDATE:
                case Globals.UPDATES.GAMEFLOW_PHASE_UPDATE:
                    dispatch(
                        ACTION_SET_GAMEFLOW_STATE(
                            message.data as (GameflowState | Record<string, never>)
                        )
                    );
                    break;
                case Globals.UPDATES.INITIAL_QUEUE_UPDATE:
                case Globals.UPDATES.QUEUE_UPDATE:
                    dispatch(
                        ACTION_SET_QUEUES(
                            message.data as Record<number, Queue>
                        )
                    );
                    break;
                case Globals.UPDATES.INITIAL_OWNED_CHAMPIONS_UPDATE:
                case Globals.UPDATES.OWNED_CHAMPIONS_UPDATE:
                    // eslint-disable-next-line no-case-declarations
                    const ownedChampions = message.data as OwnedChampion[];
                    // eslint-disable-next-line no-case-declarations
                    const championState = {} as OwnedChampionState;
                    ownedChampions.forEach((ownedChampion) => {
                        championState[ownedChampion.itemId] = ownedChampion;
                    });

                    console.log(championState);
                    dispatch(
                        ACTION_SET_OWNED_CHAMPIONS(
                            championState
                        )
                    );
                    break;
                case Globals.UPDATES.INITIAL_OWNED_SKINS_UPDATE:
                case Globals.UPDATES.OWNED_SKINS_UPDATE:
                    // eslint-disable-next-line no-case-declarations
                    const ownedSkins = message.data as OwnedSkin[];
                    // eslint-disable-next-line no-case-declarations
                    const skinState = {} as Record<number, OwnedSkin>;

                    ownedSkins.forEach((ownedSkin) => {
                        skinState[ownedSkin.itemId] = ownedSkin;
                    });

                    console.log(skinState);
                    dispatch(
                        ACTION_SET_OWNED_SKINS(
                            skinState
                        )
                    );
                    break;
                case Globals.UPDATES.INITIAL_UPDATES_DONE_UPDATE:
                    dispatch(
                        ACTION_SET_ALL_DATA_LOADED(
                            true
                        )
                    );
                    break;
                default:
                    console.log('Unknown Event: ' + message.event);
                    console.log(message.data);
                    break;
            }
        } catch (e) {
            console.error(e);
        }
    };

    function connect() {
        const host = Globals.WEBSOCKET_URL;
        socket = new WebSocket(host);
        socket.onopen = function () {
            setConnected(true);
            console.log('Connected to ' + host);
            createKeepAlive();
        };
        socket.onmessage = function (msg) {
            handleMessage(msg.data);
        };
        socket.onclose = function () {
            setConnected(false);
            setTimeout(
                () => {
                    connect();
                },
                5000
            );
            console.log('Disconnected from Host!');
        };
        socket.onerror = function () {
        };
    }

    const fetchSkins = () => {
        console.log('[Fetch] Skins');
        axios.get(Globals.PROXY_STATIC_PREFIX + '/lol-game-data/assets/v1/skins.json')
            .then((response) => {
                if (response.data.errorCode) {
                    console.error('Failed to load Skins');
                    return;
                }
                console.log(response.data);
                console.log('[Fetch] Skins - Done');
                const skins = response.data as Record<string, Skin>;

                const skinsByChampionId = {} as Record<number, number[]>;
                const chromaToParentSkin = {} as Record<number, number>;

                Object.entries(skins).forEach(([skinId, skin]) => {
                    const skinIdNumber = parseInt(skinId);

                    //Champion ID are included in the skin id like this {championId}000
                    const championId = Math.floor(skinIdNumber / 1000);

                    if (skinsByChampionId[championId] === undefined) {
                        skinsByChampionId[championId] = [];
                    }
                    skinsByChampionId[championId].push(skin.id);

                    chromaToParentSkin[skin.id] = skinIdNumber;
                    if (skin.chromas) {
                        for (const chroma of skin.chromas) {
                            chromaToParentSkin[chroma.id] = skinIdNumber;
                        }
                    }
                });


                dispatch(
                    ACTION_SET_SKINS(
                        skins
                    )
                );

                dispatch(
                    ACTION_SET_SKINS_BY_CHAMPION(
                        skinsByChampionId
                    )
                );

                dispatch(
                    ACTION_SET_CHROMA_TO_PARENT_SKIN(
                        chromaToParentSkin
                    )
                );

            })
            .catch((error) => {
                console.error(error);
            });
    };

    const fetchMapAssets = () => {
        console.log('[Fetch] Map Assets');
        axios.get(Globals.PROXY_STATIC_PREFIX + '/lol-game-data/assets/v1/map-assets/map-assets.json')
            .then((response) => {
                if (response.data.errorCode) {
                    console.error('Failed to load Map Assets');
                    return;
                }
                const fetchedMapAssets = Globals.getMapAssetsFromRemoteMapAssets(response.data as RemoteMapAssets);
                console.log(fetchedMapAssets);
                console.log('[Fetch] Map Assets - Done');
                dispatch(
                    ACTION_SET_MAP_ASSETS(
                        fetchedMapAssets
                    )
                );
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const fetchChampions = () => {
        console.log('[Fetch] Champions');
        axios.get(Globals.PROXY_STATIC_PREFIX + '/lol-game-data/assets/v1/champion-summary.json')
            .then((response) => {
                const intermediate: ChampionState = {};
                if (response.data.errorCode) {
                    console.error('Failed to load Champions');
                    return;
                }
                response.data.forEach((champion: MinimalChampion) => {
                    if (champion.id === -1) {
                        return;
                    }
                    intermediate[champion.id] = champion;
                });
                console.log(intermediate);
                console.log('[Fetch] Champions - Done');
                dispatch(
                    ACTION_SET_CHAMPIONS(
                        intermediate
                    )
                );
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const fetchSummonerSpells = () => {
        console.log('[Fetch] Summoner Spells');
        axios.get(
            Globals.PROXY_STATIC_PREFIX + '/lol-game-data/assets/v1/summoner-spells.json'
        )
            .then((response) => {
                if (response.data.errorCode) {
                    console.error('Failed to load Summoner Spells');
                    return;
                }

                const idToSummonerSpell = {} as Record<number, SummonerSpell>;

                response.data.forEach((summonerSpell: SummonerSpell) => {
                    idToSummonerSpell[summonerSpell.id] = summonerSpell;
                });

                console.log(response.data);
                console.log('[Fetch] Summoner Spells - Done');
                dispatch(
                    ACTION_SET_SUMMONER_SPELLS(
                        idToSummonerSpell
                    )
                );
            })
            .catch((error) => {
                console.error(error);
            });
    };

    function fetchStaticData() {
        fetchChampions();
        fetchSkins();
        fetchSummonerSpells();
        fetchMapAssets();
    }

    function createKeepAlive() {
        setTimeout(
            createKeepAlive,
            250000
        );
        socket.send(JSON.stringify([]));
    }

    const renderContent = () => {
        switch (internalState?.state) {
            case Globals.BACKEND_STATE_CONNECTED:
                if (!allDataLoaded) {
                    return <LoadingComponent/>;
                }

                return <>
                    <Application/>
                    <DynamicBackground/>
                </>;
            default:
                return <LoadingComponent/>;
        }
    };

    return (
        <div className={styles.container}>
            <BugReporter/>
            {
                renderContent()
            }
        </div>
    );
}