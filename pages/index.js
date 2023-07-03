import Head from 'next/head';
import styles from '../styles/Home.module.css';
import {useEffect, useRef, useState} from 'react';
import axios from 'axios';
import LoadingComponent from "./LoadingComponent";
import FriendComponent from "./FriendComponent";
import LobbyContainer from "./LobbyContainer";
import TaskContainer from "./TaskContainer";
import * as Globals from '../globals'
import {console} from "next/dist/compiled/@edge-runtime/primitives/console";
import OverlayComponentTest from "./OverlayComponentTest";
export var socket

let pktNr = 0;
const availabilityOrder = ['','chat','dnd', 'online', 'away', 'mobile', 'offline'];

let initialLoadDone = false;

export function send(jsonArray) {
    if (jsonArray instanceof Array) {
        pktNr += 1;
        jsonArray.push(pktNr);
        let toSend = JSON.stringify(jsonArray)
        console.log("Sending: " + toSend);
        socket.send(toSend);
    }
}

export default function Home() {
    const mainDiv = useRef();
    const [champions, setChampions] = useState([]);
    let [friends, setFriends] = useState({});
    let [lobby, setLobby] = useState({});
    let [container, setContainer] = useState("lobby");
    let [gameflowState, setGameflowState] = useState("None");
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
                            const { puuid, availability, statusMessage, summonerId, iconId, name } = message.data;
                            setFriends(prevFriends => {
                                prevFriends[puuid] = { iconId, name, puuid, summonerId,  availability, statusMessage};
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
                            console.log(currentGameflowState.GameflowPhase);
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
                return <LobbyContainer lobbyConfig={lobby} />;
            case 'tasks':
                return <TaskContainer />;
            case 'loot':
            default:
                return (<></>);
        }
    };
  return (
    <div className={styles.container}>
      <Head>
        <title>{Globals.BROWSER_TITLE}</title>
        <link rel="icon" href={`${Globals.STATIC_PREFIX}/assets/svg/icon.svg`} />
      </Head>
      <main>
          <div className={styles.mainContainer} ref={mainDiv}>
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
                     {Object.values(friends)
                         .sort((a, b) => {
                             if (!a.availability) a.availability= "offline";
                             if (!b.availability) b.availability= "offline";
                             const availabilityIndexA = availabilityOrder.indexOf(a.availability);
                             const availabilityIndexB = availabilityOrder.indexOf(b.availability);
                             return availabilityIndexA - availabilityIndexB;
                         })
                         .map((friend) => (
                             <FriendComponent key={friend.puuid} friend={friend} />
                         ))}
                 </div>
             </div>
          </div>
      </main>
        {isConnected ? (null): (<LoadingComponent reason={`Waiting for the League Client to start`}/>)}
    </div>
  )
}
