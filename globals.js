export const PROXY_PORT = 35199;
export const STATIC_PORT = 35199;
export const SOCKET_PORT = 8887;

const VERSION = "0.1.3"

export const PROXY_STATIC_PREFIX = "http://127.0.0.1:"+PROXY_PORT+"/proxy/static";
export const PROXY_PREFIX = "http://127.0.0.1:"+PROXY_PORT+"/proxy";
export const STATIC_PREFIX = "http://127.0.0.1:"+STATIC_PORT+"/static";

export const SOCKET_URL = "ws://127.0.0.1:"+SOCKET_PORT;

export const VERSION_SHORT = "v"+VERSION
export const VERSION_LONG = "Version "+VERSION

export const BROWSER_TITLE = "Poro-Client " + VERSION_SHORT

export const CHAMP_SELECT_MAX_BANS_PER_TEAM = 5

export const GITHUB_ISSUES_LINK = "https://github.com/IAmBadAtPlaying/poro-client-frontend/issues"

export function isJsonObjectEmpty(jsonObj) {
    if (typeof jsonObj === 'object') {
        for (var key in jsonObj) {
            if(jsonObj.hasOwnProperty(key)) {
                return false;
            }
        }
        return true;
    }
    return false;
}

export const TASKS = {};

export const TASK_AUTO_ACCEPT_QUEUE = {name: "Auto Accept Queue", parameters: [{name: "Delay", description: "Time till Ready-Check gets accepted", backendKey: "delay"}]};
export const TASK_AUTO_PICK_CHAMP = {name: "Auto Pick Champion", parameters: [{name: "Delay", description: "Time until the champion gets picked", backendKey: "delay"},{name:"Champion ID", description:"Champion ID of the champion you want to get picked", backendKey: "championId"}]};

/*
*
* COLORS
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
export const GREY1DOT5 = "#5B5A56"
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