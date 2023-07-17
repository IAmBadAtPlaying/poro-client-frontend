import Head from 'next/head';
import styles from '../styles/Home.module.css';
import {useEffect, useRef, useState} from 'react';
import axios from 'axios';
import LoadingComponent from "../components/LoadingComponent";
import FriendComponent from "../components/FriendComponent";
import LobbyContainer from "../components/LobbyContainer";
import TaskContainer from "../components/TaskContainer";
import MatchmakingContainer from "../components/MatchmakingContainer";
import * as Globals from '../globals'
import {console} from "next/dist/compiled/@edge-runtime/primitives/console";
import OverlayComponentTest from "../components/OverlayComponentTest";
import ChampionSelectContainer from "../components/ChampionSelectContainer";
import LobbyGamemodeSelector from "../components/LobbyGamemodeSelector";
import {log} from "next/dist/server/typescript/utils";
import {PROXY_STATIC_PREFIX} from "../globals";
import ReadyCheckContainer from "../components/ReadyCheckContainer";
export var socket

let pktNr = 0;
const availabilityOrder = ['','chat','dnd', 'online', 'away', 'mobile', 'offline'];

let audio;

export function send(jsonArray) {
    if (jsonArray instanceof Array) {
        pktNr += 1;
        jsonArray.push(pktNr);
        let toSend = JSON.stringify(jsonArray)
        console.log("Sending: " + toSend);
        socket.send(toSend);
    }
}

export function AUDIO_PLAY_GENERIC_BUTTON() {
    if (audio === undefined) return;
    const playAudio = audio.cloneNode();
    playAudio.volume = 0.5;
    playAudio.play();
}

export default function Home() {
    const mainDiv = useRef();
    const [champions, setChampions] = useState([]);
    let [friends, setFriends] = useState({});
    let [lobby, setLobby] = useState({});
    let [container, setContainer] = useState("lobby");
    let [gameflowState, setGameflowState] = useState("None");
    let [championSelectState, setChampionSelectState] = useState({});
    const [isConnected, setIsConnected] = useState(false);
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


    function createKeepAlive() {
        setTimeout(createKeepAlive, 290000)
        socket.send("[]");
    }

    function resetAll() {
        setFriends = {};
    }

    function handleMessage(messageText) {
        if (!messageText.isEmpty) {
            try {
                const message = JSON.parse(messageText);
                if (message && message instanceof Object) {
                    console.log(message.event)
                    switch (message.event) {
                        case 'FriendListUpdate':
                            const { puuid, availability, statusMessage, summonerId, iconId, name, lol} = message.data;
                            setFriends(prevFriends => {
                                console.log("Updating "+name+": " + availability +" - " + lol);
                                prevFriends[puuid] = { iconId, name, puuid, summonerId,  availability, statusMessage, lol};
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


            if (typeof mainDiv !== 'undefined') {
                mainDiv.current.style.backgroundImage = `url(${Globals.STATIC_PREFIX}/assets/png/background.png)`
            }
        }
    }, []);
    useEffect(() => {
        async function fetchChampions() {
            try {
                const response = await axios.get(Globals.PROXY_STATIC_PREFIX+'/lol-game-data/assets/v1/champion-summary.json');
                const data = response.data;
                setChampions(data);
            } catch (error) {
                console.error('Error fetching champion data:', error);
            }
        }

        fetchChampions();

        connect("ws://127.0.0.1:8887");
    }, []);



    const renderContent = (activeTab) => {
        switch (activeTab) {
            case 'lobby':
                return renderLobby(gameflowState);
            case 'tasks':
                return <TaskContainer />;
            case 'loot':
            default:
                return (<></>);
        }
    };


    const renderFullScreenGameInfo = (state) => {

    }

    const renderLobby = (state) => {
        switch (state) {
            case 'Lobby':
                return <LobbyContainer lobbyConfig={lobby} />;
            break;
            case 'Matchmaking':
                return <MatchmakingContainer lobbyConfig={lobby}/>
            break;
            case 'ReadyCheck':
                return <ReadyCheckContainer />
            break;
            case 'ChampSelect':
                return <></>;
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
                return <LobbyGamemodeSelector/>
            break;
            default:
                return <div>Unknown State : {state}</div>
            break;
        }
    }

  const renderFullScreen = (gameflowState) => {
    switch (gameflowState) {
        case 'ChampSelect':
            return (<ChampionSelectContainer session={championSelectState}/>)
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
                        <button className={styles.containerButton}>Profile</button>
                        <button className={styles.containerButton}>Loot</button>
                        <button className={styles.containerButton} onClick={() => setContainer("tasks")}>Tasks</button>
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
                                    <FriendComponent key={friend.puuid} friend={friend} />
                                ))
                        }
                    </div>
                </div>
            </>
        )
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>{Globals.BROWSER_TITLE}</title>
        <link rel="icon" href={`${Globals.STATIC_PREFIX}/assets/svg/icon.svg`} />
      </Head>
      <main>
          <div className={styles.mainContainer} ref={mainDiv}>
              {
                  renderFullScreen(gameflowState)
              }
          </div>
      </main>
        {isConnected ? (null): (<LoadingComponent reason={`Waiting for the League Client to start`}/>)}
    </div>
  )
}
