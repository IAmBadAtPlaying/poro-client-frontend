import styles from "../../styles/indexRework/statusProfile.module.css";
import * as Globals from "../../globals";

export default function StatusProfile({presence}) {
    if (!presence) return <></>;

    const {icon, name, availability} = presence;

    if (!name) return <></>;

    const renderStatus = (currentAvailability) => {
        switch (currentAvailability) {
            case "chat":
            case "online":
               return styles.statusAvailable;
            case "away":
                return styles.statusAway;
            case "dnd":
                return styles.statusDnd;
            case "mobile":
                return styles.statusOffline;
            case "offline":
            default:
                return styles.statusOffline;
        }
    }

    const renderStatusMessage = (currentAvailability) => {
        switch (currentAvailability) {
            case "chat":
            case "online":
                return "Online";
            case "away":
                return "Away";
            case "dnd":
                return "Do not disturb";
            case "mobile":
                return "Mobile";
            case "offline":
                return "Offline";
            default:
                return "Unknown";
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.profileImageWrapper}>
                <img src={Globals.PROXY_STATIC_PREFIX+ "/lol-game-data/assets/v1/profile-icons/"+icon+".jpg"}
                     className={styles.profileIcon} draggable={false}/>
            </div>
            <div className={styles.socialInfo}>
                <div className={styles.socialInfoName}>
                    <div>
                        {name}
                    </div>
                </div>
                <div className={styles.socialInfoStatus}>
                    <div className={styles.statusDotWrapper}>
                        <div className={styles.statusDot + " " + renderStatus(availability)}>
                        </div>
                    </div>
                    <div>
                        {
                            renderStatusMessage(availability)
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}