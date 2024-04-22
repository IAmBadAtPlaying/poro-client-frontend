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
    ACTION_SET_LOBBY_STATE, ACTION_SET_LOOT_STATE, ACTION_SET_MAP_ASSETS, ACTION_SET_CURRENT_SUMMONER
} from '../store';
import {
    ChampionState, CurrentSummonerState, Friend,
    GameflowState,
    InternalState, Invitation, LobbyState, LootState, MapAssetAssets,
    MinimalChampion, PatcherState,
    PresenceState, RemoteMapAssets, TickerMessage
} from '../types/Store';
import {useEffect, useState} from 'react';
import DynamicBackground from '../components/DynamicBackground';
import Application from '../components/Application';
import LoadingComponent from '../components/LoadingComponent';
import BugReporter from '../components/BugReporter';

export default function App() {

    const dispatch = useDispatch();

    const internalState = useSelector((state: AppState) => state.internalState);
    const [connected, setConnected] = useState(false);

    let socket: WebSocket;

    interface Message {
        event: string;
        data: object | object[];
    }

    useEffect(
        () => {
            setTimeout(
                () => {
                    console.log('Initiating WebSocket Connection!');
                    connect();
                },
                1000
            );

            return () => {
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
    }

    const handleMessage = (messageText: string) => {
        if (messageText === '') {
            return;
        }
        try {
            const message: Message = JSON.parse(messageText);
            console.log(message);
            switch (message.event) {
                case Globals.INITIAL_FRIEND_LIST_UPDATE:
                    dispatch(
                        ACTION_SET_FRIENDS(
                            message.data as Record<string, Friend>
                        )
                    );
                    break;
                case Globals.FRIEND_UPDATE:
                    dispatch(
                        ACTION_UPDATE_FRIEND(
                            message.data as Friend
                        )
                    );
                    break;
                case Globals.INITIAL_SELF_PRESENCE_STATE_UPDATE:
                case Globals.SELF_PRESENCE_STATE_UPDATE:
                    dispatch(
                        ACTION_SET_SELF_PRESENCE(
                            message.data as (PresenceState | Record<string, never>)
                        )
                    );
                    break;
                case Globals.INITIAL_LOBBY_STATE_UPDATE:
                case Globals.LOBBY_STATE_UPDATE:
                    dispatch(
                        ACTION_SET_LOBBY_STATE(
                            message.data as (LobbyState | Record<string, never>)
                        )
                    );
                    break;
                case Globals.INITIAL_GAMEFLOW_PHASE_UPDATE:
                case Globals.GAMEFLOW_PHASE_UPDATE:
                    dispatch(
                        ACTION_SET_GAMEFLOW_STATE(
                            message.data as (GameflowState | Record<string, never>)
                        )
                    );
                    break;
                case Globals.INITIAL_CHAMPION_SELECT_UPDATE:
                case Globals.CHAMPION_SELECT_UPDATE:
                    break;
                case Globals.INITIAL_LOOT_UPDATE:
                case Globals.LOOT_UPDATE:
                    dispatch(
                        ACTION_SET_LOOT_STATE(
                            message.data as (LootState | Record<string, never>)
                        )
                    );
                    break;
                case Globals.INITIAL_PATCHER_STATE_UPDATE:
                case Globals.PATCHER_STATE_UPDATE:
                    dispatch(
                        ACTION_SET_PATCHER_STATE(
                            message.data as (PatcherState | Record<string, never>)
                        )
                    );
                    break;
                case Globals.INITIAL_INTERNAL_STATE_UPDATE:
                case Globals.INTERNAL_STATE_UPDATE:
                    dispatch(
                        ACTION_SET_INTERNAL_STATE(
                            message.data as (InternalState | Record<string, never>)
                        )
                    );
                    break;
                case Globals.INITIAL_TICKER_MESSAGE_ARRAY_UPDATE:
                case Globals.TICKER_MESSAGE_ARRAY_UPDATE:
                    dispatch(
                        ACTION_SET_TICKER_MESSAGES(
                            message.data as TickerMessage[]
                        )
                    );
                    break;
                case Globals.INITIAL_INVITATIONS_ARRAY_UPDATE:
                case Globals.INVITATIONS_ARRAY_UPDATE:
                    dispatch(
                        ACTION_SET_INVITATIONS(
                            message.data as Invitation[]
                        )
                    );
                    break;
                case Globals.INITIAL_CURRENT_SUMMONER_UPDATE:
                case Globals.CURRENT_SUMMONER_UPDATE:
                    dispatch(
                        ACTION_SET_CURRENT_SUMMONER(
                            message.data as CurrentSummonerState
                        )
                    );
                    break;
                default:
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

    const fetchMapAssets = () => {
        console.log('[Fetch] Map Assets');
        axios.get(Globals.PROXY_STATIC_PREFIX + '/lol-game-data/assets/v1/map-assets/map-assets.json')
            .then((response) => {
                if (response.data.errorCode) {
                    console.error('Failed to load Map Assets');
                    return;
                }
                const fetchedMapAssets = Globals.RemoteMapAssetsToMapAssets(response.data as RemoteMapAssets);
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

    function fetchStaticData() {
        fetchChampions();
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
                return (
                    <>
                        <Application/>
                        <DynamicBackground/>
                    </>
                );
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