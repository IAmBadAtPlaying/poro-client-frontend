import LobbyMemberCard from "./LobbyMemberCard";
import styles from "../styles/LobbyContainer.module.css"
import * as Globals from '../globals'
import * as Index from '../pages/index'
import {useEffect, useState} from "react";
import LobbyContainerRoleSelection from "./LobbyContainerRoleSelection";
import LobbyGamemodeSelector from "./LobbyGamemodeSelector";
import {PROXY_STATIC_PREFIX} from "../globals";
import {axiosSend} from "../pages/index";

function startMatchmaking () {
    console.log("Starting Matchmaking")
    axiosSend("POST", "/lol-lobby/v2/lobby/matchmaking/search", "");
}



export default function LobbyContainer({lobbyConfig, availableQueues}) {
    let [showSelector, setShowSelector] = useState(false);
    let [firstPositionPreference, setFirstPositionPreference] = useState("UNSELECTED");
    let [secondPositionPreference, setSecondPositionPreference] = useState("UNSELECTED");

    const updateOwnRoles = (firstPref, secondPref) =>{
        if (firstPref === undefined || firstPref === "UNSELECTED") return;
        if (secondPref === undefined || secondPref === "UNSELECTED") return;
        if (firstPref === secondPref) return;
        console.log(firstPref +" "+ secondPref)
        axiosSend("PUT", "/lol-lobby/v1/lobby/members/localMember/position-preferences", "{\"firstPreference\":\""+firstPref+"\",\"secondPreference\": \""+secondPref+"\"}");
    }

    const updateFirstPositionPreference = (firstPref) => {
        console.log("updating for val " + firstPref);
        if (firstPref === firstPositionPreference) return;
        if (firstPref === secondPositionPreference && firstPref !== "UNSELECTED") {
            console.log("Switching: " + firstPref + " - " +secondPositionPreference);
            const firstBuffer = firstPositionPreference;
            updateOwnRoles(secondPositionPreference,firstBuffer)
            setFirstPositionPreference(secondPositionPreference)
            setSecondPositionPreference(firstBuffer)
            return;
        }
        updateOwnRoles(firstPref,secondPositionPreference)
        setFirstPositionPreference(firstPref)
    }

    const updateSecondPositionPreference = (secondPref) => {
        if (firstPositionPreference === "FILL") return;
        if (secondPref === secondPositionPreference) return;
        if (secondPref === firstPositionPreference && secondPref !== "UNSELECTED") {
            const secondBuffer = secondPositionPreference;
            updateOwnRoles(secondBuffer,firstPositionPreference);
            setSecondPositionPreference(firstPositionPreference);
            setFirstPositionPreference(secondBuffer);
            return;
        }
        setSecondPositionPreference(secondPref)
        updateOwnRoles(firstPositionPreference, secondPref);
    }

    const renderPositionSelector = (doRender) => {
        if (doRender) {
            return (
                <div className={styles.positionSelectContainer}>
                    <LobbyContainerRoleSelection setPositionPreference={updateFirstPositionPreference} positionPreference={firstPositionPreference}/>
                    {renderSecondPositionPref(firstPositionPreference)}
                </div>
            )
        } else  return (
            <>
            </>
        )
    }

    const renderFunction = () => {
      return (
          Globals.isJsonObjectEmpty(lobbyConfig) || (lobbyConfig === undefined)? (
                  <>
                  </>
              ) : (
                  <>
                      <div className={styles.lobby_type_display} onClick={() => setShowSelector(true)}>
                          {"Current Gamemode: " + lobbyConfig.gameConfig.gameMode}
                      </div>
                      <div className={styles.member_container}>
                          {lobbyConfig.members.map((member, index) => {
                              if (!member.puuid) {
                              }
                              return <LobbyMemberCard key={`Member-${index}`} member={member} />
                          })}
                      </div>
                      {renderPositionSelector(lobbyConfig.gameConfig.showPositionSelector)}
                      <div className={styles.button_container}>
                          <button className={styles.start_matchmaking_button} onClick={startMatchmaking} type={"submit"}>Start Matchmaking</button>
                      </div>
                  </>
              )
      )
    }

    const renderSecondPositionPref = (firstPref) => {
      if (firstPref !== "FILL") {
          return (
              <LobbyContainerRoleSelection setPositionPreference={updateSecondPositionPreference} positionPreference={secondPositionPreference}/>
          )
      } else return <div style={{flex: 1, height: "100%",width: "100%"}}></div>
    }

    return (
        <div className={styles.lobby_container}>
            {showSelector ? (
                <LobbyGamemodeSelector showFunction={setShowSelector} availableQueues={availableQueues}/>
            ) : (
                renderFunction()
            )}
        </div>
    )
}