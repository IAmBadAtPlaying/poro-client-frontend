import {Color} from './types/Color';
import {MapAssetAssets, MapAssets, RemoteMapAssets} from "./types/Store";

const VERSION_MAJOR: number = 0;
const VERSION_MINOR: number = 1;
const VERSION_PATCH: number = 4;

export const VERSION: string = `${VERSION_MAJOR}.${VERSION_MINOR}.${VERSION_PATCH}`;

export const APPLICATION_PORT: number = 35199;
export const SOCKET_PORT: number = 8887;

export const VERSION_SHORT: string = `v${VERSION_MAJOR}.${VERSION_MINOR}.${VERSION_PATCH}`;
export const VERSION_LONG: string = `Version ${VERSION_MAJOR}.${VERSION_MINOR}.${VERSION_PATCH}`;

export const BROWSER_TITLE: string = `Poro-Client ${VERSION_SHORT}`;

//================================ URL PATHS ================================
const BASE_URL: string = `http://127.0.0.1:${APPLICATION_PORT}`;

export const PROXY_PREFIX: string = BASE_URL+'/proxy';
export const PROXY_STATIC_PREFIX: string = PROXY_PREFIX+'/static';
export const STATIC_PREFIX: string = BASE_URL+'/static';
export const REST_PREFIX: string = BASE_URL+'/rest';
export const REST_V2_PREFIX: string = BASE_URL+'/rest/v2';

export const WEBSOCKET_URL: string = `ws://127.0.0.1:${SOCKET_PORT}`;

export const GITHUB_ISSUES_URL: string = 'https://github.com/IAmBadAtPlaying/poro-client/issues';

//=================================== REST URL ===================================
export const FETCH_BACKEND_STATUS_URL: string = REST_V2_PREFIX + '/status';
export const POST_SEARCH_LEAGUE_PROCESS_URL: string = REST_V2_PREFIX + '/status/findProcess';

//=================================== FETCH STATIC SHARED URL ===================================
export const FETCH_SKINS_URL: string = PROXY_STATIC_PREFIX+'/lol-game-data/assets/v1/skins.json';
export const FETCH_QUEUES_URL: string = PROXY_STATIC_PREFIX+'/lol-game-data/assets/v1/queues.json';
export const FETCH_WARD_URL: string = PROXY_STATIC_PREFIX+'/lol-game-data/assets/v1/ward-skins.json';
export const FETCH_ICONS_URL: string = PROXY_STATIC_PREFIX+'/lol-game-data/assets/v1/summoner-icons.json';
export const FETCH_EMOTES_URL: string = PROXY_STATIC_PREFIX+'/lol-game-data/assets/v1/summoner-emotes.json';
export const FETCH_REGALIA_URL: string = PROXY_STATIC_PREFIX+'/lol-game-data/assets/v1/regalia.json';
export const FETCH_SUMMONER_SPELLS_URL: string = PROXY_STATIC_PREFIX+'/lol-game-data/assets/v1/summoner-spells.json';

//=================================== FETCH DYNAMIC SHARED URL ===================================

export const FETCH_CLIENT_SYSTEM_STATES_URL: string = PROXY_PREFIX + '/lol-platform-config/v1/namespaces/ClientSystemStates';
export const FETCH_OWNED_CHAMPIONS_MINIMAL_URL: string = PROXY_PREFIX + '/lol-champions/v1/owned-champions-minimal';
export const FETCH_SKIN_INVENTORY_URL: string = PROXY_PREFIX + '/lol-inventory/v2/inventory/CHAMPION_SKIN';


//=================================== URLS FROM PARAMETERS ===================================
export function getChampionIconURL(championId: number): string {
    if (championId <= 0) championId = -1;
    return PROXY_PREFIX + `/lol-game-data/assets/v1/champion-icons/${championId}.png`;
}

export function getCenteredChampionSplashURL(skinId: number, championId: number | null): string {
    if (championId == null) championId = Number.parseInt(skinId.toString().slice(0, -3));
    return PROXY_PREFIX + `/lol-game-data/assets/v1/champion-splashes/${championId}/${skinId}.jpg`;
}

export function getUncenteredChampionSplashURL(skinId: number, championId: number | null): string {
    if (championId == null) championId = Number.parseInt(skinId.toString().slice(0, -3));
    return PROXY_PREFIX + `/lol-game-data/assets/v1/champion-splashes/uncentered/${championId}/${skinId}.jpg`;
}

//================================= HARDCODED VALUES ===================================

export const CHAMP_SELECT_MAX_BANS_PER_TEAM = 5;
export const CHAMP_SELECT_MAX_MEMBERS_PER_TEAM = 5;

//================================= ENUMS ===================================
export const BACKGROUND_TYPE_IMAGE = 'LOCAL_IMAGE';
export const BACKGROUND_TYPE_VIDEO = 'LOCAL_VIDEO';
export const BACKGROUND_TYPE_LCU_IMAGE = 'LCU_IMAGE';
export const BACKGROUND_TYPE_LCU_VIDEO = 'LCU_VIDEO';
export const BACKGROUND_TYPE_NONE = 'NONE';

export const BACKEND_STATE_STARTING = 'STARTING';
export const BACKEND_STATE_AWAITING_LEAGUE_PROCESS = 'AWAITING_LEAGUE_PROCESS';
export const BACKEND_STATE_NO_PROCESS_IDLE = 'NO_PROCESS_IDLE';
export const BACKEND_STATE_AWAITING_LCU_CONNECTION = 'AWAITING_LCU_CONNECTION';
export const BACKEND_STATE_AWAITING_LCU_INIT = 'AWAITING_LCU_INIT';
export const BACKEND_STATE_CONNECTED = 'CONNECTED';
export const BACKEND_STATE_DISCONNECTED = 'DISCONNECTED';
export const BACKEND_STATE_STOPPING = 'STOPPING';

export const GAMEFLOW_NONE = 'None';
export const GAMEFLOW_TERMINATED_IN_ERROR = 'TerminatedInError';
export const GAMEFLOW_LOBBY = 'Lobby';
export const GAMEFLOW_READY_CHECK = 'ReadyCheck';
export const GAMEFLOW_CHAMP_SELECT = 'ChampSelect';
export const GAMEFLOW_GAME_START = 'GameStart';
export const GAMEFLOW_IN_PROGRESS = 'InProgress';
export const GAMEFLOW_RECONNECT = 'Reconnect';
export const GAMEFLOW_MATCHMAKING = 'Matchmaking';
export const GAMEFLOW_WAITING_FOR_STATS = 'WaitingForStats';
export const GAMEFLOW_END_OF_GAME = 'EndOfGame';
export const GAMEFLOW_PRE_END_OF_GAME = 'PreEndOfGame';
export const GAMEFLOW_CHECKED_INTO_TOURNAMENT = 'CheckedIntoTournament';

export const CONTAINER_NONE = 'None';
export const CONTAINER_PLAY = 'Play';
export const CONTAINER_COLLECTION = 'Collection';
export const CONTAINER_LOOT = 'Loot';
export const CONTAINER_PROFILE = 'Profile';
export const CONTAINER_TASKS = 'Tasks';
export const CONTAINER_CONFIG = 'Configuration';

export const GAME_STATUS_TO_STRING : Record<string, string> = {
    inGame: 'In Game',
    championSelect: 'Champ Select',
    outOfGame: 'Online',
    inQueue: 'Searching for Game',
    hosting_ARAM_UNRANKED_5x5: 'Creating ARAM Game',
    hosting_NORMAL: 'Creating Normal Game',
    hosting_Custom: 'Creating Custom Game',
    hosting_PRACTICETOOL: 'Creating Practice Tool Game',
    hosting_RIOTSCRIPT_BOT: 'Creating Co-Op vs AI Game',
    hosting_RANKED_SOLO_5x5: 'Creating Ranked Game'
};
export const AVAILABILITY_ORDER = ['','chat','dnd', 'online', 'away', 'mobile', 'offline'];

//================================= UTIL FUNCTIONS ===================================
export const applyMultipleStyles = (baseStyle: string, ...styles: string[]): string => {
    return styles.reduce((acc, style) => acc + ' ' + style, baseStyle);
};

//================================= TRANSFORM FUNCTIONS ===================================

export const remoteActivityToActivity = (remoteActivity: string): string => {
    return GAME_STATUS_TO_STRING[remoteActivity] ?? remoteActivity;
};

export const remoteMapAssetsToMapAssets = (remoteMapAssets: RemoteMapAssets): MapAssets => {
    const intermediateObject = {} as MapAssets;
    Object.keys(remoteMapAssets).forEach((key) => {
        if (intermediateObject[key] !== undefined) return;
        const asset = remoteMapAssets[key];
        const assetsByGameMode: Record<string, MapAssetAssets> = {};
        if (asset.length === 0) return;
        for (const element of asset) {
            if (element.gameMode === undefined || assetsByGameMode[element.gameMode] !== undefined) continue;
            assetsByGameMode[element.gameMode] = element.assets;
        }
        intermediateObject[key] = assetsByGameMode;
    });

    return intermediateObject;
};

//================================= UPDATE-EVENTS ===================================

const getInitialUpdateString = (update: string): string  => {
    return `Initial${update}`;
};

export const INTERNAL_STATE_UPDATE = 'InternalStateUpdate';
export const INITIAL_INTERNAL_STATE_UPDATE = getInitialUpdateString(INTERNAL_STATE_UPDATE);

export const PATCHER_STATE_UPDATE = 'PatcherUpdate';
export const INITIAL_PATCHER_STATE_UPDATE = getInitialUpdateString(PATCHER_STATE_UPDATE);

export const SELF_PRESENCE_STATE_UPDATE = 'SelfPresenceUpdate';
export const INITIAL_SELF_PRESENCE_STATE_UPDATE = getInitialUpdateString(SELF_PRESENCE_STATE_UPDATE);

export const TICKER_MESSAGE_ARRAY_UPDATE = 'TickerMessageUpdate';
export const INITIAL_TICKER_MESSAGE_ARRAY_UPDATE = getInitialUpdateString(TICKER_MESSAGE_ARRAY_UPDATE);

export const INVITATIONS_ARRAY_UPDATE = 'InvitationsUpdate';
export const INITIAL_INVITATIONS_ARRAY_UPDATE = getInitialUpdateString(INVITATIONS_ARRAY_UPDATE);

export const LOBBY_STATE_UPDATE = 'LobbyUpdate';
export const INITIAL_LOBBY_STATE_UPDATE = getInitialUpdateString(LOBBY_STATE_UPDATE);

export const GAMEFLOW_PHASE_UPDATE = 'GameflowPhaseUpdate';
export const INITIAL_GAMEFLOW_PHASE_UPDATE = getInitialUpdateString(GAMEFLOW_PHASE_UPDATE);

export const CHAMPION_SELECT_UPDATE = 'ChampSelectUpdate';
export const INITIAL_CHAMPION_SELECT_UPDATE = getInitialUpdateString(CHAMPION_SELECT_UPDATE);

export const FRIEND_UPDATE = 'FriendUpdate';
export const INITIAL_FRIEND_LIST_UPDATE = getInitialUpdateString(FRIEND_UPDATE);

export const LOOT_UPDATE = 'LootUpdate';
export const INITIAL_LOOT_UPDATE = getInitialUpdateString(LOOT_UPDATE);

export const CURRENT_SUMMONER_UPDATE = 'CurrentSummonerUpdate';
export const INITIAL_CURRENT_SUMMONER_UPDATE = getInitialUpdateString(CURRENT_SUMMONER_UPDATE);

//================================= COLORS ===================================
// Taken from https://brand.riotgames.com/de-de/league-of-legends/color
export const BLUE1: Color = Color.fromHex('#CDFAFA');
export const BLUE2: Color = Color.fromHex('#0AC889');
export const BLUE3: Color = Color.fromHex('#0397AB');
export const BLUE4: Color = Color.fromHex('#005A82');
export const BLUE5: Color = Color.fromHex('#0A323C');
export const BLUE6: Color = Color.fromHex('#091428');
export const BLUE7: Color = Color.fromHex('#0A1428');

export const GOLD1: Color = Color.fromHex('#F0E6D2');
export const GOLD2: Color = Color.fromHex('#C8AA6E');
export const GOLD3: Color = Color.fromHex('#C8AA6E');
export const GOLD4: Color = Color.fromHex('#C89B3C');
export const GOLD5: Color = Color.fromHex('#785A28');
export const GOLD6: Color = Color.fromHex('#463714');
export const GOLD7: Color = Color.fromHex('#32281E');

export const GREY1: Color = Color.fromHex('#A09B8C');
export const GREY1DOT5: Color = Color.fromHex('#5B5A56');
export const GREY2: Color = Color.fromHex('#3C3C41');
export const GREY3: Color = Color.fromHex('#1E2328');
export const GREY_COOL: Color = Color.fromHex('#1E282D');
export const HEXTECH_BLACK: Color = Color.fromHex('#010A13');
