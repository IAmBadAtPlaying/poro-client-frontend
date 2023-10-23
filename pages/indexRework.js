import Head from 'next/head';
import styles from '../styles/indexRework.module.css';
import * as Globals from '../globals';
import {useEffect, useRef, useState} from 'react';
import LoadingComponent from "../components/LoadingComponent";
import FriendComponent from "../components/FriendComponent";
import LobbyContainer from "../components/LobbyContainer";
import TaskContainer from "../components/TaskContainer";
import MatchmakingContainer from "../components/MatchmakingContainer";
import ReworkedChampionSelectContainer from "../components/ReworkedChampSelectContainer";
import LobbyGamemodeSelector from "../components/LobbyGamemodeSelector";
import ReadyCheckContainer from "../components/ReadyCheckContainer";
import ConfigContainer from "../components/ConfigContainer";
import LootContainer from "../components/LootContainer";
import ProfileContainer from "../components/ProfileContainer";
import axios from "axios";
import FriendMessageWindow from "../components/messaging/FriendMessageWindow";
import ChampionSelectContainer from "../components/ChampionSelectContainer";
import CustomBackground from "../components/backgrounds/CustomBackground";
export var socket

let pktNr = 0;
const availabilityOrder = ['','chat','dnd', 'online', 'away', 'mobile', 'offline'];

let audio;
let globalChampions = {};
let globalChatIdentity = {};
let globalSpells;
let globalChromaSkins;

const messageMap = new Map();

export function subscribeToMessageUpdates(conversationId, callback) {
    console.log("Subscribing to message updates: " +conversationId)
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
    } else console.error("No callbacks for conversationId: " + conversationId+ ", How did you get here?");
}

export function axiosSend(method, url, body) {
    if (method === undefined || url === undefined) return;
    url = Globals.PROXY_PREFIX + url;
    switch (method) {
        case 'GET':
            axios.get(url, body).then((response) => {console.log(response)}).catch((error) => {console.log(error)});
            break;
        case 'POST':
            axios.post(url, body).then((response) => {console.log(response)}).catch((error) => {console.log(error)});
            break;
        case 'PUT':
            axios.put(url, body).then((response) => {console.log(response)}).catch((error) => {console.log(error)});
            break;
        case 'DELETE':
            axios.delete(url, body).then((response) => {console.log(response)}).catch((error) => {console.log(error)});
            break
        case 'PATCH':
            axios.patch(url, body).then((response) => {console.log(response)}).catch((error) => {console.log(error)});
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

export function getChampions() {
    return globalChampions;
}

export function getSpells() {
    return globalSpells;
}

export function getChromaSkins() {
    return globalChromaSkins;
}

export default function Home() {
    const [queues, setQueues] = useState({});
    const [champions, setChampions] = useState([]);
    const [friends, setFriends] = useState({});
    const [lobby, setLobby] = useState({});
    const [container, setContainer] = useState("lobby");
    const [gameflowState, setGameflowState] = useState("None");
    const [championSelectState, setChampionSelectState] = useState({});
    const [isConnected, setIsConnected] = useState(false);
    const [loot,setLoot] = useState({});
    const [taskList, setTaskList] = useState([]);
    const [currentChatFriend, setCurrentChatFriend] = useState({});
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
            setTimeout(() => {connect(host)}, 5000);
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
                            const { puuid, availability, statusMessage, summonerId, iconId, name, lol, id} = message.data;
                            setFriends(prevFriends => {
                                console.log("Updating "+name+": " + availability +" - " + lol);
                                prevFriends[puuid] = { iconId, name, puuid, summonerId,  availability, statusMessage, lol, id};
                                return prevFriends;
                            });
                            break;
                        case 'InitialFriendListUpdate':
                            const initialFriends = message.data;
                            setFriends(initialFriends);
                            break;
                        case 'InitialLobbyUpdate':
                        case 'LobbyUpdate':
                            const initialLobby = message.data;
                            setLobby(initialLobby);
                            break;
                        case 'InitialGameflowUpdate':
                        case 'GameflowPhaseUpdate':
                            const currentGameflowState = message.data;
                            setGameflowState(currentGameflowState.GameflowPhase);
                            break;
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
                            console.log("Loot Update")
                            setLoot(currentLoot);
                            break;
                        case 'DataTransfer':
                            const currentData = message.data;
                            const dataTransferType = currentData.dataType;
                            const dataTransferData = currentData.data;
                            if (dataTransferType === undefined) return;
                            console.log(message.data);
                            switch (dataTransferType) {
                                case 'Champions':
                                    globalChampions = dataTransferData;
                                    break;
                                case 'SummonerSpells':
                                    globalSpells = dataTransferData;
                                    break;
                                case 'ChromaSkins':
                                    globalChromaSkins = dataTransferData;
                                    break;
                                default:
                                    break;
                            }
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
            audio.src = Globals.PROXY_STATIC_PREFIX+ "/lol-game-data/assets/assets/events/ps2021/audio/sfx-ps-ui-champ-button-click.ogg";
            audio.load();

            window.onbeforeunload = function(){
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



    const renderContent = (activeTab) => {
        switch (activeTab) {
            case 'lobby':
                return renderLobby(gameflowState);
            case 'tasks':
                return <TaskContainer taskList={taskList} />;
            case 'loot':
                return <LootContainer loot={loot}/>;
            case 'profile':
                return <ProfileContainer />;
            case 'config':
                return <ConfigContainer />
            default:
                return (<>{activeTab}</>);
        }
    };


    const renderFullScreenGameInfo = (state) => {

    }

    const renderLobby = (state) => {
        switch (state) {
            case 'Lobby':
                return <LobbyContainer lobbyConfig={lobby} availableQueues={queues} />;
                break;
            case 'Matchmaking':
                return <MatchmakingContainer lobbyConfig={lobby}/>
                break;
            case 'ReadyCheck':
                return <ReadyCheckContainer />
                break;
            case 'ChampSelect':
                return <ReworkedChampionSelectContainer session={championSelectState}/>;
                break;
            case 'GameStart':
                return <div>GAME - START</div>;
                break;
            case 'InProgress':
                return <div>GAME - INPROGRESS</div>;
                break;
            case 'Reconnect':
                return <div>RECONNECT - COMPONENT</div>;
                break;
            case 'WaitingForStats':
                return <div>WAITING FOR STATS</div>
                break;
            case 'PreEndOfGame':
                return <div>PRE END OF GAME</div>
                break;
            case 'EndOfGame':
                return <div>END OF GAME</div>
                break;
            case 'None':
            case 'TerminatedInError': //Really Rare Edge Case
                return <LobbyGamemodeSelector availableQueues={queues}/>
                break;
            case 'CheckedIntoTournament':
                return <div>This client doesnt support clash tournaments, please use the League Client</div>
                break;
            default:
                return <div>Unknown State : {state}</div>
                break;
        }
    }

    const renderFullScreen = (gameflowState) => {
        switch (gameflowState) {
            // case 'ChampSelect':
            //     return (<ChampionSelectContainer session={championSelectState}/>)
            default:
                return renderNormalLobby()
                break;
        }
    }


    const renderNormalLobby = () => {
        return (
            <>
                <div className={styles.mainContent}>
                    <div className={styles.containerSelector}>
                        <button className={styles.containerButton} onClick={() => setContainer("lobby")}>Lobby</button>
                        <button className={styles.containerButton} onClick={() => setContainer("profile")}>Profile</button>
                        <button className={styles.containerButton} onClick={() => setContainer("loot")}>Loot</button>
                        <button className={styles.containerButton} onClick={() => setContainer("tasks")}>Tasks</button>
                        <button className={styles.containerButton} onClick={() => setContainer("config")}>Config</button>
                    </div>
                    <div className={styles.contentContainer}>
                        {(renderContent(container))}
                    </div>
                </div>
                <div className={styles.friendsTab}>
                    <div className={styles.friendsGrid}>
                        {/* Render the FriendComponents */}
                        {
                            Object.values(friends)
                                .sort((a, b) => {
                                    if (!a.availability) a.availability = "offline";
                                    if (!b.availability) b.availability = "offline";

                                    const availabilityIndexA = availabilityOrder.indexOf(a.availability);
                                    const availabilityIndexB = availabilityOrder.indexOf(b.availability);

                                    if (availabilityIndexA !== availabilityIndexB) {
                                        return availabilityIndexA - availabilityIndexB;
                                    } else {
                                        const displayNameA = a.name.toLowerCase();
                                        const displayNameB = b.name.toLowerCase();

                                        if (displayNameA < displayNameB) {
                                            return -1;
                                        } else if (displayNameA > displayNameB) {
                                            return 1;
                                        } else {
                                            return 0;
                                        }
                                    }
                                })
                                .map((friend) => (
                                    <FriendComponent key={friend.puuid} friend={friend} setCurrentConversationFriend={setCurrentChatFriend} />
                                ))
                        }
                    </div>
                </div>
                {
                    Globals.isJsonObjectEmpty(currentChatFriend) ?
                        (<></>) :
                        (<div className={styles.friendsChatWindow}>
                            <FriendMessageWindow friend={currentChatFriend} onClose={closeCurrentChat}/>
                        </div>)
                }
            </>
        )
    }

    return (
        <div className={styles.appContainer}>
            <Head>
                <title>{Globals.BROWSER_TITLE}</title>
                <link rel="icon" href={`${Globals.STATIC_PREFIX}/assets/svg/icon.svg`} />
            </Head>
            <div className={styles.navbar}>

            </div>
            <div className={styles.content}>
                <CustomBackground backgroundType={Globals.BACKGROUND_TYPE_LCU_IMAGE} background={"/lol-game-data/assets/v1/champion-splashes/uncentered/103/103076.jpg"} backgroundFileExtension={"jpg"} filterOpacity={0.3}/>
            </div>
            <div className={styles}>

            </div>
            {/*<div className={styles.container}>*/}
            {/*    <Head>*/}
            {/*        <title>{Globals.BROWSER_TITLE}</title>*/}
            {/*        <link rel="icon" href={`${Globals.STATIC_PREFIX}/assets/svg/icon.svg`} />*/}
            {/*    </Head>*/}
            {/*    <main>*/}
            {/*        <div className={styles.mainContainer} ref={mainDiv}>*/}
            {/*            {*/}
            {/*                renderFullScreen(gameflowState)*/}
            {/*            }*/}
            {/*        </div>*/}
            {/*    </main>*/}
            {/*    {isConnected ? (null): (<LoadingComponent reason={`Waiting for the League Client to start`}/>)}*/}
            {/*</div>*/}
        </div>
    )
}
