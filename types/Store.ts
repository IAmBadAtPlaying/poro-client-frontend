import * as Globals from '../Globals';

//======================== SYSTEM CLIENT STATES ========================
export interface SystemClientState {
    advancedTutorialCompleted: boolean,
    archivedStatsEnabled: boolean,
    buddyNotesEnabled: boolean,
    championTradeThroughLCDS: boolean,
    clientHeartBeatRateSeconds: number,
    currentSeason: number,
    displayPromoGamesPlayedEnabled: boolean,
    enabledQueueIdsList: number[],
    freeToPlayChampionForNewPlayersIdList: number[],
    freeToPlayChampionIdList: number[],
    freeToPlayChampionsForNewPlayersMaxLevel: number,
    gameMapEnabledDTOList: object[],
    gameModeToInactiveSpellIds: object,
    inactiveAramSpellIdList: number[],
    inactiveChampionIdList: number[],
    inactiveClassicSpellIdList: number[],
    inactiveOdinSpellIdList: number[],
    inactiveSpellIdList: number[],
    inactiveTutorialSpellIdList: number[],
    knownGeographicGameServerRegions: string[],
    leagueServiceEnabled: boolean,
    leaguesDecayMessagingEnabled: boolean,
    localeSpecificChatRoomsEnabled: boolean,
    masteryPageOnServer: boolean,
    maxMasteryPagesOnServer: number,
    minNumPlayersForPracticeGame: number,
    modularGameModeEnabled: boolean,
    observableCustomGameModes: string,
    observableGameModes: string[],
    observerModeEnabled: boolean,
    practiceGameEnabled: boolean,
    practiceGameTypeConfigIdList: number[],
    queueThrottleDTO: object,
    replayServiceAddress: string,
    replaySystemStates: object,
    riotDataServiceDataSendProbability: number,
    runeUniquePerSpellBook: boolean,
    sendFeedbackEventsEnabled: boolean,
    spectatorSlotLimit: number,
    storeCustomerEnabled: boolean,
    teamServiceEnabled: boolean,
    tournamentSendStatsEnabled: boolean,
    tournamentShortCodesEnabled: boolean,
    tribunalEnabled: boolean,
    unobtainableChampionSkinIDList: number[]
}

//======================== INTERNAL STATES ========================
export interface InternalState {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    state: Globals.BACKEND_STATE_STARTING | Globals.BACKEND_STATE_AWAITING_LEAGUE_PROCESS | Globals.BACKEND_STATE_NO_PROCESS_IDLE | Globals.BACKEND_STATE_AWAITING_LCU_CONNECTION | Globals.BACKEND_STATE_CONNECTED | Globals.BACKEND_STATE_DISCONNECTED | Globals.BACKEND_STATE_STOPPING;
}

//======================== FRIENDS ========================

export interface FriendGroup {
    collapsed: boolean,
    id: number,
    isLocalized: boolean,
    isMetaGroup: boolean,
    name: string,
    priority: number
}


export interface LolPresence {
    bannerIdSelected: number,
    challengeCrystalLevel: string,
    challengePoints: number,
    challengeTokensSelected: string, //In this wonderful form "[ID_1],[ID_2],[ID_3]", I surely love league of legends
    championId: number,
    companionId: string,
    damageSkinId: number,
    gameId: number,
    gameMode: string,
    gameQueueType: string,
    gameStatus: string,
    iconOverride: string,
    isObservable: boolean,
    level: string,
    mapId: string,
    mapSkinId: string,
    masteryScore: string,
    playerTitleSelected: string
    profileIcon: string,
    pty: string, //This is just JSON Stringified, awesome!
    puuid: string,
    queueId: string
    rankedLeagueDivision: string,
    rankedLeagueTier: string,
    rankedLosses: string,
    rankedPrevSeasonDivision: string,
    rankedPrevSeasonTier: string,
    rankedSplitRewardLevel: string,
    rankedWins: string,
    regalia: string, //Also JSON Stringified
    skinVariant: string,
    skinname: string,
    timestamp: string,
}

export interface Friend {
    availability: '' | 'chat' | 'dnd' | 'online' | 'away' | 'mobile' | 'offline',
    displayGroupId: number,
    displayGroupName: string,
    gameName: string,
    gameTag: string,
    groupId: number,
    groupName: string,
    iconId: number,
    id: string,
    isP2PConversationMuted: boolean,
    lastSeenOnlineTimestamp: any,
    lol: LolPresence | Record<string, never>,
    name: string,
    note: string,
    patchline: string,
    pid: string,
    platformId: string,
    product: string,
    productName: string,
    puuid: string,
    statusMessage: string,
    summary: string,
    summonerId: number,
    time: number
}

//======================== QUEUE ========================
export interface GameTypeConfig {
    advancedLearningQuests: boolean,
    allowTrades: boolean,
    banMode: string,
    banTimerDuration: number,
    battleBoost: boolean,
    crossTeamChampionPool: boolean,
    deathMatch: boolean,
    doNotRemove: boolean,
    duplicatePick: boolean,
    exclusivePick: boolean,
    gameModeOverride: any,
    id: number,
    learningQuests: boolean,
    mainPickTimerDuration: number,
    maxAllowableBans: number,
    name: string,
    numPlayersPerTeamOverride: any,
    onboardCoopBeginner: boolean,
    pickMode: string,
    postPickTimerDuration: number,
    reroll: boolean,
    teamChampionPool: boolean
}

export interface QueueRewards {
    isChampionPointsEnabled: boolean,
    isIpEnabled: boolean,
    isXpEnabled: boolean,
    partySizeIpRewards: [],
}

export enum QueueAvailability {
    AVAILABLE = 'Available',
    PLATFORM_DISABLED = 'PlatformDisabled'
}

export interface Queue {
    allowablePremadeSizes: number[],
    areFreeChampionsAllowed: boolean,
    assetMutator: string,
    category: string,
    championsRequiredToPlay: number,
    description: string,
    detailedDescription: string,
    gameMode: string,
    gameTypeConfig: GameTypeConfig
    id: number,
    isRanked: boolean,
    isTeamBuilderManaged: boolean,
    isVisible: boolean,
    lastToggledOffTime: number,
    lastToggledOnTime: number,
    mapId: number,
    maxDivisionForPremadeSize2: string,
    maxTierForPremadeSize2: string,
    maximumParticipantListSize: number,
    minLevel: number,
    minimumParticipantListSize: number,
    name: string,
    numPlayersPerTeam: number,
    queueAvailability: QueueAvailability,
    queueRewards: QueueRewards,
    removalFromGameAllowed: boolean,
    removalFromGameDelayMinutes: number,
    shortName: string,
    showPositionSelector: boolean,
    showQuickPlaySlotSelection: boolean,
    spectatorEnabled: boolean,
    type: string
}

//======================== REGALIA ========================

export interface Regalia {
    id: string,
    idSecondary: string,
    assetPath: string,
    isSelectable: boolean,
    regaliaType: string,
    localizedName: string,
    localizedDescription: string
}

//======================== SUMMONER SPELLS ========================

export interface SummonerSpell {
    id: number,
    name: string,
    description: string,
    summonerLevel: number,
    cooldown: number,
    gameModes: string[],
    iconPath: string,
}

//======================== CHAMPIONS ========================

export interface MinimalChampion {
    id: number,
    alias: string,
    name: string,
    roles: string[],
}

export interface ChampionState {
    [key: string]: MinimalChampion;
}

export interface OwnedChampion {
    expirationDate: string,
    f2p: boolean,
    inventoryType: 'CHAMPION',
    itemId: number,
    loyalty: boolean,
    loyaltySources: string[],
    owned: boolean,
    ownershipType: string,
    payload: object;
    purchaseDate: string,
    quantity: number,
    rental: boolean,
    uuid: string,
    wins: number,
}

export interface OwnedChampionState {
    [key: number]: OwnedChampion;
}

//======================== HONOR EOG ========================
export interface EOGHonorPlayer {
    championName: string,
    skinSplashPath: string,
    summonerName: string,
    puuid: string,
    summonerId: number,
    gameName: string,
}

export interface EOGHonorState {
    gameId: number,
    eligiblePlayers: EOGHonorPlayer[],
}


//============================================================
//======================== WS-UPDATES ========================
//============================================================

export interface AbstractUpdateMessage {
    event: string,
    data: object | object[] | null,
}

export interface InternalStateUpdate extends AbstractUpdateMessage {
    event: string,
    data: {
        state: string,
    } | Record<string, never>
}

export interface PatcherUpdate extends AbstractUpdateMessage {
    event: string,
    data: {
        patcher: object,
    } | Record<string, never>
}

export interface HonorEndOfGameUpdate extends AbstractUpdateMessage {
    event: string,
    data: {
        honor: object,
    } | Record<string, never>
}

//======================== PATCHER ========================

export interface PatcherComponent {
    action: string,
    id: string,
    isCorrupted: boolean,
    isUpToDate: boolean,
    isUpdateAvailable: boolean,
    progess: any,
    timeOfLastUpToDateCheckISO8601: string
}

export interface PatcherState {
    action: string,
    components: PatcherComponent[],
    id: string,
    isCorrupted: boolean,
    isStopped: boolean,
    isUpToDate: boolean,
    isUpdateAvailable: boolean,
    percentPatched: number,
}

//======================== PRESENCE ========================
export interface PresenceState {
    availability: string,
    gameName: string,
    gameTag: string,
    icon: number,
    id: string,
    lol: LolPresence,
    name: string,
    pid: string,
    puuid: string,
    regalia: object,
    statusMessage: string,
    summonerId: number,
}

//======================== INVITATIONS ========================

export interface GameConfig {
    gameMode: string,
    inviteGameType: string,
    mapId: number,
    queueId: number
}

export interface Invitation {
    canAcceptInvitation: boolean,
    fromSummonerName: string,
    fromGameName?: string,
    fromTagLine?: string,
    gameConfig: GameConfig,
    invitationId: string,
    invitationType: string,
    state: string
}

//======================== TICKER MESSAGES ========================

export interface TickerMessage {
    createdAt: string,
    heading: string,
    message: string,
    severity: string,
    updatedAt: string
}

//======================== LOBBY ========================

export interface LobbyInvitation {
    invitationId: string,
    invitationType: string,
    state: string,
    timestamp: string,
    toSummonerId: number,
    toSummonerName: string
}

export interface LobbyConfig {
    allowablePremadeSizes: number[],
    customTeam100: object[],
    customTeam200: object[],
    gameMode: string,
    isCustom: boolean,
    mapId: number,
    maxLobbySize: number,
    queueId: number,
    showPositionSelector: boolean
}

export interface LobbyRegalia {
    bannerType: string,
    crestType: string,
    highestRankedEntry: {
        division: string,
        queueType: string,
        splitRewardLevel: string,
        tier: string
    },
    lastSeasonHighestRank: object,
    profileIconId: number,
    selectedPrestigeCrest: number,
    summonerLevel: number
}

export interface QuickplaySlot {
    championId: number,
    perks: string;
    positionPreference: string,
    skinId: number,
    spell1: number,
    spell2: number
}

export interface LobbyMember {
    allowedChangeActivity: boolean,
    allowedInviteOthers: boolean,
    allowedKickOthers: boolean,
    allowedStartActivity: boolean,
    allowedToggleInvite: boolean,
    autoFillEligible: boolean,
    autoFillProtectedForPromos: boolean,
    autoFillProtectedForRemedy: boolean,
    autoFillProtectedForSoloing: boolean,
    autoFillProtectedForStreaking: boolean,
    botChampionId: number,
    botDifficulty: string,
    botId: string,
    firstPositionPreference: string,
    gameName: string,
    gameTag: string,
    intraSubteamPosition: null | any,
    isBot: boolean,
    isLeader: boolean,
    isSpectator: boolean,
    playerSlots: QuickplaySlot[],
    puuid: string,
    quickplayPlayerState: null | any,
    ready: boolean,
    regalia: Record<string, never> | LobbyRegalia,
    secondPositionPreference: string,
    showGhostedBanner: boolean,
    subteamIndex: number,
    summonerIconId: number,
    summonerId: number,
    summonerInternalName: string,
    summonerLevel: number,
    summonerName: string,
    teamId: number,
    tftNPEQueueBypass: boolean
}

export interface LobbyState {
    gameConfig?: LobbyConfig,
    partyId?: string,
    members: (LobbyMember | Record<string, never>)[],
    invitations: LobbyInvitation[],
    localMember: LobbyMember
}

//======================== LOOT ========================

export interface LootItem {
    assets: string,
    count: number,
    disenchantLootName: string,
    disenchantRecipeName: string,
    disenchantValue: number,
    displayCategories: string,
    expiryTime: number,
    isNew: boolean,
    isRental: boolean,
    itemDesc: string,
    itemStatus: string,
    localizedDescription: string,
    localizedName: string,
    localizedRecipeSubtitle: string,
    localizedRecipeTitle: string,
    lootId: string,
    lootName: string,
    parentItemStatus: string,
    parentStoreItemId: number,
    rarity: string,
    redeemableStatus: string,
    refId: string,
    rentalGames: number,
    rentalSeconds: number,
    shadowPath: string,
    splashPath: string,
    storeItemId: number,
    tags: string,
    tilePath: string,
    type: string,
    upgradeEssenceName: string,
    upgradeEssenceValue: number,
    upgradeLootName: string,
    value: number
}

export interface LootState {
    [key: string]: LootItem;
}


//======================== GAMEFLOW ========================

export interface GameflowState {
    gameDodge: object,
    phase: string,
}

//======================== MAP ASSETS ========================

export interface RemoteMapAssetProperties {
    suppressRunesMasteriesPerks: boolean;
}

export interface MapAssetAssets extends Partial<Record<string, string>> {
    'champ-select-flyout-background'?: string;
    'champ-select-planning-intro'?: string;
    'game-select-icon-default'?: string;
    'game-select-icon-disabled'?: string;
    'game-select-icon-hover'?: string;
    'icon-defeat'?: string;
    'icon-empty'?: string;
    'icon-hover'?: string;
    'icon-leaver'?: string;
    'icon-victory'?: string;
    'parties-background'?: string;
    'social-icon-leaver'?: string;
    'social-icon-victory'?: string;
    'game-select-icon-active'?: string;
    'ready-check-background'?: string;
    'map-north'?: string;
    'map-south'?: string;
    'gameflow-background'?: string;
    'icon-v2'?: string;
    'icon-defeat-v2'?: string;
    'icon-loss-forgiven-v2'?: string;
    'icon-leaver-v2'?: string;
    'gameflow-background-dark'?: string;
    'champ-select-background-sound'?: string;
    'gameselect-button-hover-sound'?: string;
    'music-inqueue-loop-sound'?: string;
    'postgame-ambience-loop-sound'?: string;
    'sfx-ambience-pregame-loop-sound'?: string;
    'ready-check-background-sound'?: string;
    'game-select-icon-active-video'?: string;
    'game-select-icon-intro-video'?: string;
    'icon-defeat-video'?: string;
    'icon-victory-video'?: string;
}

export interface RemoteTutorialCard {
    header: string;
    footer: string;
    description: string;
    imagePath: string;
}

export interface RemoteMapAsset {
    isDefault: boolean
    description: string
    mapStringId: string
    gameMode: string
    gameModeName: string
    gameModeShortName: string
    gameModeDescription: string
    name: string
    gameMutator: string
    isRGM: boolean
    properties: RemoteMapAssetProperties,
    perPositionRequiredSummonerSpells: object
    perPositionDisallowedSummonerSpells: object
    assets: MapAssetAssets
    locStrings: object
    categorizedContentBundles: object
    tutorialCards: RemoteTutorialCard[]
}

export interface RemoteMapAssets {
    [key: string]: RemoteMapAsset[];
}

export interface MapAssets {
    [key: string]: Record<string, RemoteMapAsset | never>;
}

//======================= CURRENT SUMMONER =======================

export interface CurrentSummonerState {
    accountId: number,
    displayName: string,
    gameName: string,
    internalName: string,
    nameChangeFlag: boolean,
    percentCompleteForNextLevel: number,
    privacy: string,
    profileIconId: number,
    puuId: string,
    rerollPoints: {
        currentPoints: number,
        maxRolls: number,
        numberOfRolls: number,
        pointsCostToRoll: number,
        pointsToReroll: number
    },
    summonerId: number,
    summonerLevel: number,
    tagLine: string,
    unnamed: boolean,
    xpSinceLastLevel: number,
    xpUntilNextLevel: number
}

//======================= SUMMONER SPELLS =======================

export interface SummonerSpell {
    id: number,
    name: string,
    description: string,
    summonerLevel: number,
    cooldown: number,
    gameModes: string[],
    iconPath: string,
}

export interface SummonerSpellState extends Record<number, SummonerSpell> {}

//======================= SKINS =======================

export interface Skin {
    id: number,
    isBase: boolean,
    name: string,
    splashPath: string,
    uncenteredSplashPath: string,
    tilePath: string,
    loadScreenPath: string,
    loadScreenVintagePath: string,
    skinType: string,
    rarity: string,
    isLegacy: boolean,
    splashVideoPath: string | null,
    collectionSplashVideoPath: string | null,
    featuresText: string | null,
    chromaPath: string | null,
    emblems: unknown,
    regionRarityId: number,
    rarityGemPath: null,
    skinLines: {
        id: number,
    }[],
    skinAugments: null,
    description: string,
    chromas?: {
        id: number,
        name: string,
        chromaPath: string,
        colors: string[],
        description: {
            region: string,
            description: string
        }[],
        rarities: {
            region: string,
            description: number
        }[]
    }[]
}

export interface OwnedSkin {
    expirationDate: string,
    f2p: boolean,
    inventoryType: 'CHAMPION_SKIN',
    itemId: number,
    loyalty: boolean,
    loyaltySources: string[],
    owned: boolean,
    ownershipType: string,
    payload: object;
    purchaseDate: string,
    quantity: number,
    rental: boolean,
    uuid: string,
    wins: number,
}

export interface OwnedSkinState extends Record<number, OwnedSkin> {}

export interface SkinState extends Record<number, Skin> {}

//This maps the chroma ID to the parent skin ID
export interface ChromaMap extends Record<number, number> {}

//This maps the champion ID to the skin IDs
export interface ChampionSkinMap extends Record<number, number[]> {}

//======================= MATCHMAKING =======================

export interface MatchmakingSearchState extends Record<string, any> {
    dodgeData: {
        dodgerId: number,
        state: string
    },
    lowPriorityData?: {
        bustedLeaverAccessToken: string,
        penalizedSummonerIds: number[],
        penaltyTime: number,
        penaltyTimeRemaining: number,
        reason: string
    },
    estimatedQueueTime: number,
    isCurrentlyInQueue: boolean,
    readyCheck: {
        dodgeWarning: string,
        playerResponse: string,
        state: string,
        suppressUx: boolean,
        timer: number
    }
    searchState: string,
    timeInQueue: number
}


//======================= CHAMP SELECT =======================

export interface ChampSelectState {
    bans: {
        myTeamBans: number[],
        theirTeamBans: number[]
    }
    benchChampions: {
        championId: number,
        isPriority: boolean
    }[],
    benchEnabled: boolean,
    gameId: number,
    hasSimultaneousBans: boolean,
    isCustomGame: boolean,
    localPlayerCellId: number,
    myTeam: {
        assignedPosition: string,
        banAction: {
            actorCellId: number,
            championId: number,
            completed: boolean,
            id: number,
            isAllyAction: boolean,
            isInProgress: boolean,
            pickTurn: number,
            type: string
        } | Record<string, never>,
        cellId: number,
        championId: number,
        championPickIntent: number,
        nameVisibilityType: string,
        obfuscatedPuuid: string,
        obfuscatedSummonerId: number,
        pickAction: {
            actorCellId: number,
            championId: number,
            completed: boolean,
            id: number,
            isAllyAction: boolean,
            isInProgress: boolean,
            pickTurn: number,
            type: string
        } | Record<string, never>
        puuId: string,
        selectedSkinId: number
        spell1Id: number,
        spell2Id: number,
        state: 'PREPARATION' | 'BANNING' | 'AWAITING_PICK' | 'AWAITING_BAN_RESULT' | 'PICKING_WITH_BAN' | 'PICKING_WITHOUT_BAN' | 'AWAITING_FINALIZATION' | 'FINALIZATION',
        summonerId: number,
        team: number,
        wardSkinId: number
    }[],
    rerollsRemaining: number,
    theirTeam: {
        assignedPosition: string,
        banAction: {
            actorCellId: number,
            championId: number,
            completed: boolean,
            id: number,
            isAllyAction: boolean,
            isInProgress: boolean,
            pickTurn: number,
            type: string
        } | Record<string, never>,
        cellId: number,
        championId: number,
        championPickIntent: number,
        nameVisibilityType: string,
        obfuscatedPuuid: string,
        obfuscatedSummonerId: number,
        pickAction: {
            actorCellId: number,
            championId: number,
            completed: boolean,
            id: number,
            isAllyAction: boolean,
            isInProgress: boolean,
            pickTurn: number,
            type: string
        } | Record<string, never>
        puuId: string,
        selectedSkinId: number
        spell1Id: number,
        spell2Id: number,
        state: string
        summonerId: number,
        team: number,
        wardSkinId: number
    }[],
    timer: {
        phase: 'PLANNING' | 'BAN_PICK' | 'FINALIZATION' | 'GAME_STARTING',
        isInfinite: boolean,
    }
}

//=========================================================
//======================= UI STATES =======================
//=========================================================

export interface WindowFocusState {
    focused: boolean
}

//======================= CONTAINER =======================
export enum ContainerState {
    NONE = ''+Globals.CONTAINER_NONE,
    PLAY = ''+Globals.CONTAINER_PLAY,
    COLLECTION = ''+Globals.CONTAINER_COLLECTION,
    LOOT = ''+Globals.CONTAINER_LOOT,
    TASKS = ''+Globals.CONTAINER_TASKS,
    CONFIG = ''+Globals.CONTAINER_CONFIG,
    PROFILE = ''+Globals.CONTAINER_PROFILE
}

export interface ActiveContainerState {
    container: ContainerState,
}