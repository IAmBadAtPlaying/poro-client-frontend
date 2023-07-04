import styles from '../styles/card.module.css'

export default function PlayerCard({ id,  playerName}) {
    return (
        <div>
            <a href={`https://www.op.gg/summoners/e/${playerName}`}>
                <div className={styles.card}>
                    <div className={styles.imageContainer}>
                        <img src={`http://127.0.0.1:2023/proxy/static/lol-game-data/assets/v1/profile-icons/${id}.jpg`} alt="Loading" width={200} height={200}/>
                    </div>
                    <h3>{playerName}</h3>
                    <p>Id: {id}</p>
                </div>
            </a>
        </div>
    )
}
