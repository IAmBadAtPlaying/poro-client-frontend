import Head from 'next/head';
import styles from '../styles/Home2.module.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import ChampionCard from "../components/ChampionCard";
import LoadingComponent from "../components/LoadingComponent";
let socket

function connect(host) {
    socket = new WebSocket(host);
    socket.onopen = function (msg) {
        console.log("Connected to " + host);
        createKeepAlive();
        getFriendList();
    }
    socket.onmessage = function (msg) {
        console.log("Received message:" + msg.data);
    }
    socket.onclose = function (msg) {
        console.log("Disconnected from Host!");
    }
}

function createKeepAlive() {
    setTimeout(createKeepAlive, 290000)
    socket.send("[]");
}

function getFriendList() {
    let startUpRequest = new Array();
    startUpRequest.push(4);
    startUpRequest.push("FriendList");
}

function getSummonerProfile() {

}

export default function Home2() {
    const [champions, setChampions] = useState([]);
    useEffect(() => {
        async function fetchChampions() {
            try {
                const response = await axios.get('http://127.0.0.1:2023/proxy/static/lol-game-data/assets/v1/champion-summary.json');
                const data = response.data;
                setChampions(data);
            } catch (error) {
                console.error('Error fetching champion data:', error);
            }
        }

        fetchChampions();

        connect("ws://127.0.0.1:8887");
    }, []);

    return (
        <div className={styles.container}>
            <Head>
                <title>Create Next App</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main>
                <h1 className={styles.title}>
                    Welcome to the  <a href="https://nextjs.org">Poro-Client!</a>
                </h1>

                <p className={styles.description}>
                    Get started by selecting your favourite <code>Champion</code>
                </p>

                <div className={styles.grid}>
                    {
                        champions
                            .filter(champion => champion.id !== -1) // Exclude champion with id -1
                            .sort((a,b) => {
                                if(a.name < b.name) {
                                    return -1;
                                }
                                if(a.name > b.name) {
                                    return 1;
                                }
                                return 0;
                            })
                            .map(champion =>
                                (<ChampionCard key={champion.id} alias={champion.alias.toLowerCase()} id={champion.id} championName={champion.name} />))}
                </div>
            </main>

            <footer>
                <a
                    href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Powered by{' '}
                    <img src="/vercel.svg" alt="Vercel" className={styles.logo} />
                </a>
            </footer>
            <LoadingComponent />

            <style jsx>{`
        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        footer img {
          margin-left: 0.5rem;
        }
        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
          text-decoration: none;
          color: inherit;
        }
        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
        }
      `}</style>

            <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }
        * {
          box-sizing: border-box;
        }
      `}</style>
        </div>
    )
}
