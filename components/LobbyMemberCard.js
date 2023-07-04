import styles from "../styles/LobbyMemberCard.module.css"
import * as Globals from '../globals'

export default function LobbyMemberCard({member}) {


    const renderPositionIcons = (firstPositionPreference, secondPositionPreference) => {
        if (firstPositionPreference !== undefined && firstPositionPreference!== '') {
            if (firstPositionPreference === 'FILL') {
                return (
                    <div className={styles.singlePositionContainer}>
                        <div className={styles.position}>
                            <img draggable={"false"} className={`${styles.positionImage} ${styles.noDrag}`} src={Globals.STATIC_PREFIX +"/assets/svg/positions/"+firstPositionPreference.toLowerCase()+".svg"}></img>
                        </div>
                    </div>
                )
            } else {
                return (
                    <div className={styles.dualPositionsContainer}>
                        <div className={styles.position}>
                            <img draggable={"false"} className={`${styles.positionImage} ${styles.noDrag}`} src={Globals.STATIC_PREFIX +"/assets/svg/positions/"+firstPositionPreference.toLowerCase()+".svg"}></img>
                        </div>
                        <div className={styles.position}>
                            <img draggable={"false"} className={`${styles.positionImage} ${styles.noDrag}`} src={Globals.STATIC_PREFIX +"/assets/svg/positions/"+secondPositionPreference.toLowerCase()+".svg"}></img>
                        </div>
                    </div>
                )
            }
        }
    }

    const renderLeaderIcon = (isLeader) => {
        if (isLeader) {
            return (
                <div className={styles.leaderCrownContainer}>
                    <img className={styles.leaderCrownImage} draggable={false} src={Globals.STATIC_PREFIX + "/assets/png/icon-crown.png"}></img>
                </div>
            )
        } else return (
            <></>
        )
    }

    return (
        <div className={styles.lobbyMemberCard}>
            {member.regalia ? (
                <>
                    <div className={styles.bannerDisplay}>
                        <img className={styles.bannerDisplayImage} src={""}/>
                    </div>
                    <div className={styles.profileContainer}>
                        <img draggable={false} className={`${styles.profileImage} ${styles.noDrag}`} src={Globals.PROXY_STATIC_PREFIX+"/lol-game-data/assets/v1/profile-icons/"+member.regalia.profileIconId+".jpg"} alt={""}/>
                        {member.regalia.crestType === "ranked" ? (
                            <>
                                <div className={styles.rankedAnimatedContainer}>
                                    <video draggable={false} className={`${styles.rankedVideo} ${styles.noDrag}`} src={Globals.STATIC_PREFIX + "/assets/webm/regalia/emblem-wings-magic-"+member.regalia.highestRankedEntry.tier.toLowerCase()+".webm"} autoPlay={true} controls={false} muted={true} loop={true}/>
                                    <img draggable={false} className={`${styles.rankedImage} ${styles.noDrag}`} src={Globals.STATIC_PREFIX + "/assets/png/regalia/plate/wings_" +  member.regalia.highestRankedEntry.tier.toLowerCase() + "_plate.png"} alt={" "}/>
                                </div>
                            </>
                        ) : (
                            <>
                                <img draggable={false}className={`${styles.prestigeImage} ${styles.noDrag}`} src={Globals.STATIC_PREFIX + "/assets/png/regalia/prestige/regalia-prestige-" +  member.regalia.selectedPrestigeCrest + ".png"} alt={""}/>
                            </>
                        )}
                        </div>
                    {renderLeaderIcon(member.isLeader)}
                    <div className={styles.displayName}>
                        {member.summonerName}
                    </div>
                    <div className={styles.title}>
                        {member.title}
                    </div>
                    <div className={styles.tokenContainer}>

                    </div>
                    {renderPositionIcons(member.firstPositionPreference, member.secondPositionPreference)}
                </>
            ): (
                <>
                </>
            )}
        </div>
    )
}