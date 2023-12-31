export const APPLICATION_PORT = 35199;
export const SOCKET_PORT = 8887;

const VERSION = "0.1.4";

const BASE_URL = "http://127.0.0.1:"

export const PROXY_STATIC_PREFIX = BASE_URL+APPLICATION_PORT+"/proxy/static";
export const PROXY_PREFIX =  BASE_URL+ APPLICATION_PORT+"/proxy";
export const STATIC_PREFIX = BASE_URL+APPLICATION_PORT+"/static";
export const CONFIG_PREFIX = BASE_URL+APPLICATION_PORT+"/config";
export const REST_PREFIX = BASE_URL+APPLICATION_PORT+"/rest";

const CONFIG_USERDATA_PREFIX = REST_PREFIX+"/dynamic/userdata";

export const CONFIG_USER_BACKGROUND = CONFIG_USERDATA_PREFIX+"/background";

export const SOCKET_URL = "ws://127.0.0.1:"+SOCKET_PORT;

export const VERSION_SHORT = "v"+VERSION;
export const VERSION_LONG = "Version "+VERSION;

export const BROWSER_TITLE = "Poro-Client " + VERSION_SHORT;

export const CHAMP_SELECT_MAX_BANS_PER_TEAM = 5;
export const CHAMP_SELECT_MAX_MEMBERS_PER_TEAM = 5;

export const BACKGROUND_TYPE_IMAGE = "LOCAL_IMAGE";
export const BACKGROUND_TYPE_VIDEO = "LOCAL_VIDEO";
export const BACKGROUND_TYPE_LCU_IMAGE = "LCU_IMAGE";
export const BACKGROUND_TYPE_LCU_VIDEO = "LCU_VIDEO";
export const BACKGROUND_TYPE_NONE = "NONE";

export const GITHUB_ISSUES_LINK = "https://github.com/IAmBadAtPlaying/poro-client-frontend/issues";

export function isJsonObjectEmpty(jsonObj) {
    if (typeof jsonObj === 'object') {
        for (let objKey in jsonObj) {
            if(Object.hasOwn(jsonObj, objKey)) {
                return false;
            }
        }
        return true;
    }
    return false;
}

/*
*
* GAMEFLOW
*
 */

export const GAMEFLOW_NONE = "None";
export const GAMEFLOW_TERMINATED_IN_ERROR = "TerminatedInError";
export const GAMEFLOW_LOBBY = "Lobby";
export const GAMEFLOW_READY_CHECK = "ReadyCheck";
export const GAMEFLOW_CHAMP_SELECT = "ChampSelect";
export const GAMEFLOW_GAME_START = "GameStart";
export const GAMEFLOW_IN_PROGRESS = "InProgress";
export const GAMEFLOW_RECONNECT = "Reconnect";
export const GAMEFLOW_MATCHMAKING = "Matchmaking";
export const GAMEFLOW_WAITING_FOR_STATS = "WaitingForStats";
export const GAMEFLOW_END_OF_GAME = "EndOfGame";
export const GAMEFLOW_PRE_END_OF_GAME = "PreEndOfGame";
export const GAMEFLOW_CHECKED_INTO_TOURNAMENT = "CheckedIntoTournament";

export const CONTAINER_NONE = "";
export const CONTAINER_PLAY = "Play";
export const CONTAINER_COLLECTION = "Collection";
export const CONTAINER_LOOT = "Loot";
export const CONTAINER_PROFILE = "Profile";
export const CONTAINER_TASKS = "Tasks";
export const CONTAINER_CONFIG = "Configuration";


export const GAME_STATUS_TO_STRING = {inGame: "In Game", championSelect: "Champ Select", outOfGame: "Game ended", hosting_ARAM_UNRANKED_5x5: "Creating ARAM", hosting_NORMAL: "Creating Normal", hosting_RANKED_SOLO_5x5: "Creating Ranked"};
export const AVAILABILITY_ORDER = ['','chat','dnd', 'online', 'away', 'mobile', 'offline'];

/*
*
* COLORS
*
* adapted from https://brand.riotgames.com/en-us/league-of-legends/color
*
* */


// ---HEXTECH MAGIC---
export const BLUE1 = "#CDFAFA";
export const BLUE2 = "#0AC889";
export const BLUE3 = "#0397AB";
export const BLUE4 = "#005A82";
export const BLUE5 = "#0A323C";
export const BLUE6 = "#091428";
export const BLUE7 = "#0A1428";

// ---HEXTECH METAL---
export const GOLD1 = "#F0E6D2";
export const GOLD2 = "#C8AA6E";
export const GOLD3 = "#C8AA6E";
export const GOLD4 = "#C89B3C";
export const GOLD5 = "#785A28";
export const GOLD6 = "#463714";
export const GOLD7 = "#32281E";

// ---TEXT AND BACKGROUND---
export const GREY1 = "#A09B8C";
export const GREY1DOT5 = "#5B5A56";
export const GREY2 = "#3C3C41";
export const GREY3 = "#1E2328";
export const GREY_COOL = "#1E282D";
export const HEXTECH_BLACK = "#010A13";

/*
*
* GRADIENTS
*
* */


// Background only
const GRADIENT_DARK_BLUE = BLUE6 +"->"+ BLUE7;

// Hextech Metal only
const GRADIENT_GOLD = GOLD5 + "->"+GOLD4;

// Magic Elements only
const GRADIENT_BLUE = BLUE4 + "->" + BLUE2;