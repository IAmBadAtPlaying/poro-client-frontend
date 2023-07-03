import styles from '../styles/card.module.css';
import BackgroundImage from './BackgroundImage';

export default function ChampionCard({ id,  championName, alias}) {
    return (
        <div className={styles.default}>
            <button className={styles.champSelectButton} onClick={() => logName(championName)}>
            <div className={styles.card}>
                    <BackgroundImage url={`http://127.0.0.1:2023/proxy/static/lol-game-data/assets/v1/champion-tiles/${id}/${id}000.jpg`} width={100} height={100} />
                    <h3>{championName}</h3>
              </div>
            </button>
        </div>
    )
}

function logName(name) {
    console.log(name);
}
