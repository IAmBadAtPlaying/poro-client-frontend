import styles from '../styles/ChampionCard.module.css';
import BackgroundImage from './BackgroundImage';
import Image from "next/image";
import * as Globals from "../globals";

export default function ChampionCard({ id,  championName, isActive, setActive}) {


    const pick = () => {
        setActive(id);
        console.log(championName);
    }

    return (
        <div className={styles.cardContainer}>
            <button className={isActive ? styles.champSelectButtonActive : styles.champSelectButton} onClick={() => pick()}>
            <div className={styles.card}>
                <img
                    src={Globals.PROXY_STATIC_PREFIX+ "/lol-game-data/assets/v1/champion-icons/"+id+".png"}
                    alt={"Icon " + id}
                    className={styles.image}
                />
                <div className={styles.championName}>{isActive}{championName}</div>
              </div>
            </button>
        </div>
    )
}
