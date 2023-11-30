import Head from 'next/head';
import styles from '../styles/indexRework.module.css';
import * as Globals from '../globals';
import {useEffect, useState} from 'react';
import LoadingComponent from "../components/LoadingComponent";
import LobbyContainer from "../components/LobbyContainer";
import TaskContainer from "../components/TaskContainer";
import MatchmakingContainer from "../components/MatchmakingContainer";
import ReworkedChampionSelectContainer from "../components/ReworkedChampSelectContainer";
import LobbyGamemodeSelector from "../components/LobbyGamemodeSelector";
import ReadyCheckContainer from "../components/gameflow/ReadyCheckContainer";
import LootContainer from "../components/LootContainer";
import ProfileContainer from "../components/ProfileContainer";
import axios from "axios";
import CustomBackground from "../components/customComponents/CustomBackground";
import StatusProfile from "../components/indexReworked/StatusProfile";
import ReworkedConfigContainer from "../components/config/ReworkedConfigContainer";
import FriendList from "../components/social/FriendList";
import ReconnectContainer from "../components/gameflow/ReconnectContainer";

export let socket

let pktNr = 0;
const availabilityOrder = ['', 'chat', 'dnd', 'online', 'away', 'mobile', 'offline'];

let audio;
let globalChampions = {};
let globalChatIdentity = {};
let globalSpells = {};
let globalChromaSkins = {};
let globalMapAssets = {}

const messageMap = new Map();

export function subscribeToMessageUpdates(conversationId, callback) {
    console.log("Subscribing to message updates: " + conversationId)
    if (conversationId === undefined || callback === undefined) return;
    if (messageMap.has(conversationId)) {
        messageMap.get(conversationId).push(callback);
    } else {
        messageMap.set(conversationId, [callback]);
    }
}


export function unsubscribeFromMessageUpdates(conversationId, callback) {
    if (conversationId === undefined || callback === undefined) {
        console.error("Invalid conversationId or callback");
        return;
    }
    if (messageMap.has(conversationId)) {
        const callbacks = messageMap.get(conversationId);
        const index = callbacks.indexOf(callback);
        if (index > -1) {
            callbacks.splice(index, 1);
        }
    } else console.error("No callbacks for conversationId: " + conversationId + ", How did you get here?");
}

export function axiosSend(method, url, body) {
    if (method === undefined || url === undefined) return;
    url = Globals.PROXY_PREFIX + url;
    switch (method) {
        case 'GET':
            axios.get(url, body).then((response) => {
                console.log(response)
            }).catch((error) => {
                console.log(error)
            });
            break;
        case 'POST':
            axios.post(url, body).then((response) => {
                console.log(response)
            }).catch((error) => {
                console.log(error)
            });
            break;
        case 'PUT':
            axios.put(url, body).then((response) => {
                console.log(response)
            }).catch((error) => {
                console.log(error)
            });
            break;
        case 'DELETE':
            axios.delete(url, body).then((response) => {
                console.log(response)
            }).catch((error) => {
                console.log(error)
            });
            break
        case 'PATCH':
            axios.patch(url, body).then((response) => {
                console.log(response)
            }).catch((error) => {
                console.log(error)
            });
            break;
        default:
            console.error("Invalid request type: " + method);
            break;
    }
}

export function send(jsonArray) {
    if (jsonArray instanceof Array) {
        pktNr += 1;
        jsonArray.push(pktNr);
        let toSend = JSON.stringify(jsonArray)
        console.log("Sending: " + toSend);
        socket.send(toSend);
        return pktNr;
    }
}

export function AUDIO_PLAY_BIG_BUTTON() {
    if (audio === undefined) return;
    try {
        const playAudio = audio.cloneNode();
        playAudio.volume = 0.5;
        playAudio.play();
    } catch (e) {
        console.log(e);
    }

}

export function getChatIdentity() {
    return globalChatIdentity;
}

export const getChampions = () => {
    return globalChampions;
}

export const getSpells = () => {
    return globalSpells;
}

export const getChromaSkins = () => {
    return globalChromaSkins;
}

export function getAssetMap() {
    return globalMapAssets;
}

export default function Home() {

    const [queues, setQueues] = useState({});
    const [champions, setChampions] = useState([]);
    const [friends, setFriends] = useState({});
    const [lobby, setLobby] = useState({});
    const [container, setContainer] = useState(Globals.CONTAINER_NONE);
    const [gameflowState, setGameflowState] = useState("None");
    const [championSelectState, setChampionSelectState] = useState({});
    const [isConnected, setIsConnected] = useState(false);
    const [loot, setLoot] = useState({});
    const [taskList, setTaskList] = useState([]);
    const [currentChatFriend, setCurrentChatFriend] = useState({});
    const [presence, setPresence] = useState({});
    const [friendListCollapsed, setFriendListCollapsed] = useState(true);
    const [patcherStatus, setPatcherStatus] = useState({});
    const [config, setConfig] = useState({});
    const [backgroundFilterOpacity, setBackgroundFilterOpacity] = useState(0.3);
    const [backgroundVolume, setBackgroundVolume] = useState(0.8);

    useEffect(() => {
        if (!isConnected) return;
        fetchMapAssets();
        fetchChampions();
        fetchSummonerSpells();
        fetchChromaSkins();
        fetchUserConfig();
    }, [isConnected])

    const fetchUserConfig = () => {
        axios.get(Globals.REST_PREFIX + "/userconfig").then((response) => {
            setConfig(response.data);
        }).catch((error) => {
            console.log(error);
        });
    }

    const fetchChampions = () => {
        axios.get(Globals.PROXY_PREFIX + "/lol-game-data/assets/v1/champion-summary.json").then((response) => {
            let intermediate = {}
            if (response.data.errorCode) {
                console.error("Failed to load champions");
                return;
            }
            response.data.forEach((champion) => {
                intermediate[champion.id] = champion;
            });
            globalChampions = intermediate;
        })
    }

    const fetchSummonerSpells = () => {
        axios.get(Globals.PROXY_PREFIX + "/lol-game-data/assets/v1/summoner-spells.json").then((response) => {
            let intermediate = {};
            if (response.data.errorCode) {
                console.error("Failed to load summoner spells");
                return;
            }
            response.data.forEach((spell) => {
                intermediate[spell.id] = spell;
            });
            globalSpells = intermediate;
        }).catch((error) => {
            console.log(error);
        });
    }

    const fetchChromaSkins = () => {
        axios.get(Globals.PROXY_PREFIX + "/lol-game-data/assets/v1/skins.json").then((response) => {
            let intermediate = {};
            if (response.data.errorCode) {
                console.error("Failed to load skins");
                return;
            }
            Object.values(response.data).forEach((skin) => {
                if (skin.chromas) {
                    skin.chromas.forEach((chroma) => {
                        intermediate[chroma.id] = skin.id;
                    });
                }
                intermediate[skin.id] = skin.id;
            });
            globalChromaSkins = intermediate;
            setTimeout(() => {
                console.log(globalChampions);
                console.log(getChampions())
            }, 1000);
        }).catch(() => {
        });
    }

    const fetchMapAssets = () => {
        axios.get(Globals.PROXY_PREFIX + "/lol-game-data/assets/v1/map-assets/map-assets.json").then((response) => {
            let intermediate = {};
            if (response.data.errorCode) {
                console.error("Failed to load map assets");
                return;
            }
            Object.keys(response.data).forEach((key) => {
                if (intermediate[key] === undefined) {
                    const asset = response.data[key];
                    if (asset.length > 0) {
                        intermediate[key] = asset[0].assets;
                    }
                }
            });
            globalMapAssets = intermediate;
            console.log(globalMapAssets);
        }).catch(() => {
        });
    }

    function connect(host) {
        socket = new WebSocket(host);
        socket.onopen = function (msg) {
            setIsConnected(true);
            console.log("Connected to " + host);
            createKeepAlive();
            getInitialData();
        }
        socket.onmessage = function (msg) {
            handleMessage(msg.data)
        }
        socket.onclose = function (msg) {
            setIsConnected(false);
            resetAll();
            setTimeout(() => {
                connect(host)
            }, 5000);
            console.log("Disconnected from Host!");
        }
        socket.onerror = function (msg) {

        }
    }

    function getInitialData() {
        send([4]);
    }

    function closeCurrentChat() {
        setCurrentChatFriend({});
    }

    function createKeepAlive() {
        setTimeout(createKeepAlive, 250000)
        socket.send("[]");
    }

    function resetAll() {
        setFriends({});
    }

    function triggerUpdateMessage(conversationId, message) {
        console.log("Triggering update message");
        if (conversationId === undefined || message === undefined) return;
        if (messageMap.has(conversationId)) {
            const callbacks = messageMap.get(conversationId);
            console.log(callbacks.length)
            callbacks.forEach((callback) => {
                callback(message);
            });
        } else {
            console.log("No callbacks for conversationId: " + conversationId);
        }
    }


    function handleMessage(messageText) {
        if (!messageText.isEmpty) {
            try {
                const message = JSON.parse(messageText);
                if (message && message instanceof Object) {
                    console.log(message.event)
                    switch (message.event) {
                        case 'FriendListUpdate':
                            const {
                                puuid,
                                availability,
                                statusMessage,
                                summonerId,
                                iconId,
                                name,
                                lol,
                                id
                            } = message.data;
                            setFriends(prevFriends => {
                                console.log("Updating " + name + ": " + availability + " - " + lol);
                                prevFriends[puuid] = {
                                    iconId,
                                    name,
                                    puuid,
                                    summonerId,
                                    availability,
                                    statusMessage,
                                    lol,
                                    id
                                };
                                return prevFriends;
                            });
                            break;
                        case 'InitialFriendListUpdate':
                            const initialFriends = message.data;
                            setFriends(initialFriends);
                            break;
                        case 'InitialSelfPresenceUpdate':
                        case 'SelfPresenceUpdate':
                            const currentPresence = message.data;
                            setPresence(currentPresence);
                            break;
                        case 'InitialLobbyUpdate':
                        case 'LobbyUpdate':
                            const initialLobby = message.data;
                            setLobby(initialLobby);
                            break;
                        case 'InitialGameflowUpdate':
                        case 'GameflowPhaseUpdate':
                            const currentGameflowState = message.data;
                            console.log(currentGameflowState.phase)
                            setGameflowState(currentGameflowState.phase);
                            break;
                        case 'InitialChampSelectUpdate':
                        case 'ChampSelectUpdate':
                            const currentChampSelectState = message.data;
                            setChampionSelectState(currentChampSelectState);
                            break;
                        case 'TaskUpdate':
                        case 'InitialTaskUpdate':
                            const currentTasks = message.data;
                            setTaskList(currentTasks);
                            break;
                        case 'InitialQueues':
                            const currentQueues = message.data;
                            setQueues(currentQueues);
                            break;
                        case 'MessageUpdate':
                            const messagePayload = message.data;
                            if (messagePayload === undefined) return;
                            console.log(messagePayload)
                            const conversationId = messagePayload.conversationId;
                            const messageData = messagePayload.message;
                            triggerUpdateMessage(conversationId, messageData);
                            break;
                        case 'ConversationUpdate':
                            const conversationPayload = message.data;
                            if (conversationPayload === undefined) return;
                            const conversationId2 = conversationPayload.id;
                            const messages = conversationPayload.messages;
                            console.log(messages)
                            triggerUpdateMessage(conversationId2, messages);
                            break;
                        case 'InitialLoot':
                        case 'LootUpdate':
                            const currentLoot = message.data;
                            setLoot(currentLoot);
                            break;
                        case 'InitialPatcher':
                        case 'PatcherUpdate':
                            const currentPatcherStatus = message.data;
                            setPatcherStatus(currentPatcherStatus);
                            break;
                        default:
                            break;
                    }
                }
            } catch (e) {
                console.log(e);
            }
        }
    }

    useEffect(() => {
        if (typeof document !== 'undefined') {
            document.body.style.overflow = "hidden";
            document.body.style.margin = "0";
            document.body.style.padding = "0";
            document.body.style.width = "100.00vw";
            document.body.style.height = "100.00vh";

            audio = new Audio();
            audio.src = Globals.PROXY_STATIC_PREFIX + "/lol-game-data/assets/assets/events/ps2021/audio/sfx-ps-ui-champ-button-click.ogg";
            audio.load();

            window.onbeforeunload = function () {
                // return 'Are you sure you want to leave?';
            };

        }
    }, []);
    useEffect(() => {
        connect("ws://127.0.0.1:8887");
    }, []);

    useEffect(() => {
        if (isConnected) {
            axios.get(Globals.PROXY_PREFIX + "/lol-chat/v1/me").then((response) => {
                globalChatIdentity = response.data;
                console.log("Chat Identity");
                console.log(response.data);
            }).catch((error) => {
                console.log(error);
            });
        }

    }, [isConnected])



    const renderLobby = (state) => {
        switch (state) {
            case Globals.GAMEFLOW_READY_CHECK:
            case Globals.GAMEFLOW_LOBBY:
                return <LobbyContainer lobbyConfig={lobby} availableQueues={queues}/>
                break;
            case Globals.GAMEFLOW_MATCHMAKING:
                return <MatchmakingContainer lobbyConfig={lobby}/>
                break;
            case Globals.GAMEFLOW_CHAMP_SELECT:
                return <ReworkedChampionSelectContainer session={championSelectState}/>;
                break;
            case Globals.GAMEFLOW_GAME_START:
                return <div>GAME - START</div>;
                break;
            case Globals.GAMEFLOW_IN_PROGRESS:
                return <div>GAME - INPROGRESS</div>;
                break;
            case Globals.GAMEFLOW_RECONNECT:
                return <ReconnectContainer/>
                break;
            case Globals.GAMEFLOW_WAITING_FOR_STATS:
                return <div>WAITING FOR STATS</div>
                break;
            case Globals.GAMEFLOW_PRE_END_OF_GAME:
                return <div>PRE END OF GAME</div>
                break;
            case Globals.GAMEFLOW_END_OF_GAME:
                return <div>END OF GAME</div>
                break;
            case Globals.GAMEFLOW_NONE:
            case Globals.GAMEFLOW_TERMINATED_IN_ERROR: //Really Rare Edge Case
                return <LobbyGamemodeSelector availableQueues={queues}/>
                break;
            case Globals.GAMEFLOW_CHECKED_INTO_TOURNAMENT:
                return <div>This client doesnt support clash tournaments, please use the League Client</div>
                break;
            default:
                return <div>Unknown State : {state}</div>
                break;
        }
    }


    const renderReadyCheck = (state) => {
        let result = (<div></div>)
        switch (state) {
            case 'ReadyCheck':
                result = (<ReadyCheckContainer/>);
                break;
            default:
                break;
        }
        return result;
    }

    const changeContainer = (newContainer) => {
        if (newContainer === container) return;
        setContainer(newContainer);
    }

    const renderCurrentStateReminder = () => {
        return <></>
    }

    const renderActualContent = () => {
        return (
            <>
                <div className={styles.content}>
                    <CustomBackground clientProperties={config.clientProperties} currentContainer={container} currentGameflow={gameflowState}/>
                    {renderBackButton()}
                    <div className={styles.currentContainer}>
                        {renderContainer()}
                    </div>
                    <FriendList friends={friends} collapsed={friendListCollapsed} self={presence}/>
                </div>
                {renderReadyCheck(gameflowState)}
                {renderCurrentStateReminder()}
            </>
        )
    }

    const renderContainer = () => {
        switch (container) {
            case Globals.CONTAINER_NONE:
                return (
                    <>
                        <div>
                            <div className={styles.selectContainer}>
                                <div className={styles.selectElement + " " +styles.selectElementPlay} onClick={() => {changeContainer(Globals.CONTAINER_PLAY)}}>
                                    PLAY
                                </div>
                                <div className={styles.selectElement} onClick={() => {setContainer(Globals.CONTAINER_COLLECTION)}}>
                                    Collection
                                </div>
                                <div className={styles.selectElement} onClick={() => {setContainer(Globals.CONTAINER_LOOT)}}>
                                    Loot
                                </div>
                                <div className={styles.selectElement} onClick={() => {setContainer(Globals.CONTAINER_PROFILE)}}>
                                    Profile
                                </div>
                                <div className={styles.selectElement} onClick={() => {setContainer(Globals.CONTAINER_TASKS)}}>
                                    Tasks
                                </div>
                                <div className={styles.selectElement} onClick={() => {setContainer(Globals.CONTAINER_CONFIG)}}>
                                    Configuration
                                </div>
                            </div>
                        </div>
                    </>
                )
            case Globals.CONTAINER_PLAY:
                return (
                    renderLobby(gameflowState)
                )
            case Globals.CONTAINER_COLLECTION:
                return (
                    <>TODO: COLLECTION</>
                )
            case Globals.CONTAINER_LOOT:
                return (
                    <LootContainer loot={loot}/>
                )
            case Globals.CONTAINER_PROFILE:
                return (
                    <>TODO: PROFILE</>
                )
            case Globals.CONTAINER_TASKS:
                return (
                    <TaskContainer taskList={taskList}/>
                )
            case Globals.CONTAINER_CONFIG:
                return (
                    <ReworkedConfigContainer config={config} patcherStatus={patcherStatus}/>
                )
            default:
                return (
                    <div></div>
                )
        }
    }

    const renderBackButton = () => {
        if (container === Globals.CONTAINER_NONE) return <></>;
        return (
            <div className={styles.backButtonContainer} >
                <div className={styles.backButton} onClick={() => {changeContainer(Globals.CONTAINER_NONE)}}>
                    Back
                </div>
                <div className={styles.backButtonCurrentContainer} >
                    &#47;&#47; {container}
                </div>
            </div>
        )
    }


    return (
        <div className={styles.appContainer}>
            <Head>
                <title>{Globals.BROWSER_TITLE}</title>
                <link rel="icon" href={`${Globals.STATIC_PREFIX}/assets/svg/icon.svg`}/>
            </Head>

            {isConnected ? renderActualContent() : (<LoadingComponent reason={`Waiting for the League Client to start`}/>)}
        </div>
    )
}
