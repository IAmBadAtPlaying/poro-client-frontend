import LobbyMemberCard from "./LobbyMemberCard";
import styles from "../styles/LobbyContainer.module.css"
import * as Globals from '../globals'
import {axiosSend} from "../pages";

function stopMatchmaking () {
    axiosSend("DELETE", "/lol-lobby/v2/lobby/matchmaking/search", "");
}

export default function MatchmakingContainer({lobbyConfig}) {


    return (
        <div className={styles.lobby_container}>
            {Globals.isJsonObjectEmpty(lobbyConfig) || (lobbyConfig === undefined)? (
                <>
                </>
            ) : (
                <>
                    <div className={styles.lobby_type_display}>
                        {"Current Gamemode: " + lobbyConfig.gameConfig.gameMode}
                    </div>
                    <div className={styles.member_container}>
                        {lobbyConfig.members.map((member, index) => {
                            if (!member.puuid) {
                            }
                            return <LobbyMemberCard key={`Member-${index}`} member={member} />
                        })}
                    </div>
                    <div className={styles.button_container}>
                        <button className={styles.start_matchmaking_button} onClick={stopMatchmaking} type={"submit"}>Stop Matchmaking</button>
                    </div>
                </>
            )}

        </div>
    )
}