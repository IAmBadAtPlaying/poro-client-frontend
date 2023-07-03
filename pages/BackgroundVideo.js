import styles from "../styles/Home.module.css"

export default function BackgroundVideo({url}) {
    return (
        <div className={styles.videoContainer}>
            <video className={styles.video} src={url} autoPlay={true} loop={true} muted={true} controls={false}></video>
        </div>
    )
}