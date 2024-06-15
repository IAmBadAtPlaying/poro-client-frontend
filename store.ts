import {configureStore, createAction, createReducer} from '@reduxjs/toolkit';
import {
    ActiveContainerState,
    ChampionState, ChampSelectState, ContainerState, CurrentSummonerState, EOGHonorState,
    Friend, FriendGroup,
    GameflowState,
    InternalState,
    Invitation, LobbyState, LootState, MapAssets, MatchmakingSearchState, OwnedChampionState, OwnedSkinState,
    PatcherState,
    PresenceState, Queue, Skin, SummonerSpell, TickerMessage, WindowFocusState
} from './types/Store';
import * as Globals from './Globals';

// eslint-disable @typescript-eslint/no-unused-vars
export interface AppState {
    //========= STATIC =========
    mapAssets: MapAssets | Record<string, never>,
    summonerSpells: Record<number, SummonerSpell>
    skins: Record<number, Skin>
    queues: Record<number, Queue>
    champions: ChampionState
    regaliaInfo: object

    //========= STATIC MAPS =========
    skinsByChampion: Record<number, number[]>
    chromaToParentSkin: Record<number, number>

    //========= DYNAMIC =========
    internalState: InternalState | Record<string, never>,
    friends: Record<string, Friend>,
    friendGroups: Record<number, FriendGroup>
    selfPresence: PresenceState | Record<string, never>,
    gameflowState: GameflowState | Record<string, never>,
    patcherState: PatcherState | Record<string, never>,
    lobbyState: LobbyState | Record<string, never>,
    lootState: LootState | Record<string, never>,
    matchmakingSearchState: MatchmakingSearchState | Record<string, never>,
    invitations: Invitation[],
    tickerMessages: TickerMessage[],
    taskList: object[],
    currentChatFriend: object,
    currentSummoner: CurrentSummonerState | Record<string, never>
    honorEOGState: EOGHonorState | Record<string, never>
    champSelectState: ChampSelectState | Record<string, never>

    //--- INVENTORY ---
    ownedIcons: object[],
    ownedWards: object[],
    ownedEmotes: object[],
    ownedSkins: OwnedSkinState | Record<number, never>,
    ownedChampions: OwnedChampionState | Record<number, never>,

    //--- UI STATES ---
    windowFocused: WindowFocusState,

    activeContainer: ActiveContainerState
}


const INITIAL_MAP_ASSETS_STATE = {};
const INITIAL_SUMMONER_SPELLS = {};
const INITIAL_SKIN_STATE = {};
const INITIAL_QUEUES = {};
const INITIAL_CHAMPION_STATE = {};

const INITIAL_SKINS_BY_CHAMPION = {};
const INITIAL_CHROMA_TO_PARENT_SKIN = {};

const INITIAL_OWNED_CHAMPIONS = {};

const INITIAL_PRESENCE_STATE = {} as PresenceState | Record<string, never>;

const INITIAL_PATCHER_STATE = {} as PatcherState | Record<string, never>;

const INITIAL_FRIENDS_STATE = {} as Record<string, Friend> | Record<string, never>;

const INITIAL_FRIEND_GROUP_STATE = {} as Record<number, FriendGroup> | Record<number, never>;

const INITIAL_GAMEFLOW_STATE = {} as GameflowState | Record<string, never>;

const INITIAL_INTERNAL_STATE = {} as InternalState | Record<string, never>;

const INITIAL_LOBBY_STATE = {} as LobbyState | Record<string, never>;

const INITIAL_LOOT_STATE = {} as LootState | Record<string, never>;

const INITIAL_INVITATIONS = [] as Invitation[];

const INITIAL_TICKER_MESSAGES = [] as TickerMessage[];

const INITIAL_HONOR_EOG_STATE = {} as EOGHonorState | Record<string, never>;

const INITIAL_WINDOW_FOCUSED = {focused: true} as WindowFocusState;

const INITIAL_ACTIVE_CONTAINER = {container: ContainerState.NONE} as ActiveContainerState;

const INITIAL_CURRENT_SUMMONER = {} as CurrentSummonerState | Record<string, never>;

const INITIAL_MATCHMAKING_SEARCH_STATE = {} as MatchmakingSearchState | Record<string, never>;

const INITIAL_CHAMP_SELECT_STATE = {} as ChampSelectState | Record<string, never>;

export const ACTION_SET_MAP_ASSETS = createAction<MapAssets>('mapAssets/set');
export const ACTION_SET_SUMMONER_SPELLS = createAction<Record<number, SummonerSpell>>('summonerSpells/set');
export const ACTION_SET_SKINS = createAction<Record<number, Skin>>('skins/set');
export const ACTION_SET_QUEUES = createAction<Record<number, Queue>>('queues/set');
export const ACTION_SET_CHAMPIONS = createAction<ChampionState | Record<string, never>>('champions/set');

export const ACTION_SET_OWNED_SKINS = createAction<OwnedSkinState | Record<number, never>>('ownedSkins/set');
export const ACTION_SET_OWNED_CHAMPIONS = createAction<OwnedChampionState | Record<number, never>>('ownedChampions/set');

export const ACTION_SET_SKINS_BY_CHAMPION = createAction<Record<number, number[]>>('skinsByChampion/set');
export const ACTION_SET_CHROMA_TO_PARENT_SKIN = createAction<Record<number, number>>('chromaToParentSkin/set');

export const ACTION_SET_FRIENDS = createAction<Record<string, Friend>>('friends/set');
export const ACTION_SET_FRIEND_GROUPS = createAction<Record<number, FriendGroup>>('friendGroups/set');
export const ACTION_SET_SINGLE_FRIEND_GROUP = createAction<FriendGroup>('friendGroup/setSingle');
export const ACTION_UPDATE_FRIEND = createAction<Friend>('friend/update');
export const ACTION_SET_SELF_PRESENCE = createAction<PresenceState | Record<string, never>>('presence/set');
export const ACTION_SET_PATCHER_STATE = createAction<PatcherState | Record<string, never>>('patcher/set');
export const ACTION_SET_GAMEFLOW_STATE = createAction<GameflowState | Record<string, never>>('gameflowState/set');
export const ACTION_SET_INTERNAL_STATE = createAction<InternalState | Record<string, never>>('internalState/set');
export const ACTION_SET_LOBBY_STATE = createAction<LobbyState | Record<string, never>>('lobbyState/set');
export const ACTION_SET_LOOT_STATE = createAction<LootState | Record<string, never>>('lootState/set');
export const ACTION_SET_INVITATIONS = createAction<Invitation[]>('invitations/set');
export const ACTION_SET_TICKER_MESSAGES = createAction<TickerMessage[]>('tickerMessages/set');
export const ACTION_SET_HONOR_EOG_STATE = createAction<EOGHonorState | Record<string, never>>('honorEOG/set');
export const ACTION_SET_WINDOW_FOCUSED = createAction<WindowFocusState>('windowFocused/set');
export const ACTION_SET_ACTIVE_CONTAINER = createAction<ContainerState>('activeContainer/set');
export const ACTION_SET_CURRENT_SUMMONER = createAction<CurrentSummonerState | Record<string, never>>('currentSummoner/set');
export const ACTION_SET_MATCHMAKING_SEARCH_STATE = createAction<MatchmakingSearchState | Record<string, never>>('matchmakingSearchState/set');
export const ACTION_SET_CHAMP_SELECT_STATE = createAction<ChampSelectState | Record<string, never>>('champSelectState/set');


const mapAssetsReducer = createReducer(
    INITIAL_MAP_ASSETS_STATE,
    (builder) => {
        builder
            .addCase(
                ACTION_SET_MAP_ASSETS,
                (state, action) => {
                    return action.payload;
                }
            )
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .addDefaultCase((state, action) => {
            });
    }
);
const summonerSpellsReducer = createReducer(
    INITIAL_SUMMONER_SPELLS,
    (builder) => {
        builder
            .addCase(
                ACTION_SET_SUMMONER_SPELLS,
                (state, action) => {
                    return action.payload;
                }
            )
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .addDefaultCase((state, action) => {
            });
    }
);
const skinsReducer = createReducer(
    INITIAL_SKIN_STATE,
    builder => {
        builder
            .addCase(
                ACTION_SET_SKINS,
                (state, action) => {
                    return action.payload;
                }
            )
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .addDefaultCase((state, action) => {
            });
    }
);
const queueReducer = createReducer(
    INITIAL_QUEUES,
    builder => {
        builder
            .addCase(
                ACTION_SET_QUEUES,
                (state, action) => {
                    return action.payload;
                }
            )
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .addDefaultCase((state, action) => {
            });
    }
);
const championReducer = createReducer(
    INITIAL_CHAMPION_STATE,
    (builder) => {
        builder.addCase(
            ACTION_SET_CHAMPIONS,
            (state, action) => {
                return action.payload;
            }
        )
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .addDefaultCase((state, action) => {

            });
    }
);

const ownedSkinsReducer = createReducer(
    INITIAL_SKIN_STATE,
    builder => {
        builder
            .addCase(
                ACTION_SET_OWNED_SKINS,
                (state, action) => {
                    return action.payload;
                }
            )
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .addDefaultCase((state, action) => {
            });
    }
);
const ownedChampionsReducer = createReducer(
    INITIAL_OWNED_CHAMPIONS,
    builder => {
        builder
            .addCase(
                ACTION_SET_OWNED_CHAMPIONS,
                (state, action) => {
                    return action.payload;
                }
            )
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .addDefaultCase((state, action) => {

            });
    }
);

const presenceReducer = createReducer(
    INITIAL_PRESENCE_STATE,
    builder => {
        builder
            .addCase(
                ACTION_SET_SELF_PRESENCE,
                (state, action) => {
                    return action.payload;
                }
            )
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .addDefaultCase((state, action) => {
            });
    }
);

const patcherReducer = createReducer(
    INITIAL_PATCHER_STATE,
    builder => {
        builder
            .addCase(
                ACTION_SET_PATCHER_STATE,
                (state, action) => {
                    return action.payload;
                }
            )
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .addDefaultCase((state, action) => {
            });
    }
);

const friendsReducer = createReducer(
    INITIAL_FRIENDS_STATE,
    builder => {
        builder
            .addCase(
                ACTION_SET_FRIENDS,
                (state, action) => {
                    return action.payload;
                }
            )
            .addCase(
                ACTION_UPDATE_FRIEND,
                (state, action) => {
                    const newState: Record<string, Friend> = {...state};
                    const friend = action.payload;
                    newState[friend?.puuid] = friend;
                    return newState;
                }
            )
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .addDefaultCase((state, action) => {
            });
    }
);

const friendGroupReducer = createReducer(
    INITIAL_FRIEND_GROUP_STATE,
    builder => {
        builder
            .addCase(
                ACTION_SET_FRIEND_GROUPS,
                (state, action) => {
                    return action.payload;
                }
            )
            .addCase(
                ACTION_SET_SINGLE_FRIEND_GROUP,
                (state, action) => {
                    const newState: Record<number, FriendGroup> = {...state};
                    const group = action.payload;
                    newState[group.id] = group;
                    return newState;
                }
            )
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .addDefaultCase((state, action) => {
            });
    }
);

const gameflowStateReducer = createReducer(
    INITIAL_GAMEFLOW_STATE,
    builder => {
        builder
            .addCase(
                ACTION_SET_GAMEFLOW_STATE,
                (state, action) => {
                    return action.payload;
                }
            )
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .addDefaultCase((state, action) => {
            });
    }
);

const lobbyStateReducer = createReducer(
    INITIAL_LOBBY_STATE,
    builder => {
        builder
            .addCase(
                ACTION_SET_LOBBY_STATE,
                (state, action) => {
                    return action.payload;
                }
            )
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .addDefaultCase((state, action) => {
            });
    }
);

const lootStateReducer = createReducer(
    INITIAL_LOOT_STATE,
    builder => {
        builder
            .addCase(
                ACTION_SET_LOOT_STATE,
                (state, action) => {
                    return action.payload;
                }
            )
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .addDefaultCase((state, action) => {
            });
    }
);

const invitationsReducer = createReducer(
    INITIAL_INVITATIONS,
    builder => {
        builder
            .addCase(
                ACTION_SET_INVITATIONS,
                (state, action) => {
                    return action.payload;
                }
            )
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .addDefaultCase((state, action) => {
            });
    }
);

const tickerMessagesReducer = createReducer(
    INITIAL_TICKER_MESSAGES,
    builder => {
        builder
            .addCase(
                ACTION_SET_TICKER_MESSAGES,
                (state, action) => {
                    return action.payload;
                }
            )
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .addDefaultCase((state, action) => {
            });
    }
);

const internalStateReducer = createReducer(
    INITIAL_INTERNAL_STATE,
    builder => {
        builder
            .addCase(
                ACTION_SET_INTERNAL_STATE,
                (state, action) => {
                    return action.payload;
                }
            )
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .addDefaultCase((state, action) => {
            });
    }
);

const windowFocusedReducer = createReducer(
    INITIAL_WINDOW_FOCUSED,
    builder => {
        builder
            .addCase(
                ACTION_SET_WINDOW_FOCUSED,
                (state, action) => {
                    return action.payload;
                }
            )
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .addDefaultCase((state, action) => {
            });
    }
);

const activeContainerReducer = createReducer(
    INITIAL_ACTIVE_CONTAINER,
    builder => {
        builder
            .addCase(
                ACTION_SET_ACTIVE_CONTAINER,
                (state, action) => {
                    const container = action.payload;
                    return {container: container};
                }
            )
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .addDefaultCase((state, action) => {
            });
    }
);

const currentSummonerReducer = createReducer(
    INITIAL_CURRENT_SUMMONER,
    builder => {
        builder
            .addCase(
                ACTION_SET_CURRENT_SUMMONER,
                (state, action) => {
                    return action.payload;
                }
            )
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .addDefaultCase((state, action) => {
            });
    }
);

const champSelectStateReducer = createReducer(
    INITIAL_CHAMP_SELECT_STATE,
    builder => {
        builder
            .addCase(
                ACTION_SET_CHAMP_SELECT_STATE,
                (state, action) => {
                    return action.payload;
                }
            )
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .addDefaultCase((state, action) => {
            });
    }
);

const matchmakingSearchStateReducer = createReducer(
    INITIAL_MATCHMAKING_SEARCH_STATE,
    builder => {
        builder
            .addCase(
                ACTION_SET_MATCHMAKING_SEARCH_STATE,
                (state, action) => {
                    return action.payload;
                }
            )
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .addDefaultCase((state, action) => {
            });
    }
);

const honorEOGReducer = createReducer(
    INITIAL_HONOR_EOG_STATE,
    builder => {
        builder
            .addCase(
                ACTION_SET_HONOR_EOG_STATE,
                (state, action) => {
                    return action.payload;
                }
            )
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .addDefaultCase((state, action) => {
            });
    }
);

const skinsByChampionReducer = createReducer(
    INITIAL_SKINS_BY_CHAMPION,
    builder => {
        builder
            .addCase(
                ACTION_SET_SKINS_BY_CHAMPION,
                (state, action) => {
                    return action.payload;
                }
            )
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .addDefaultCase((state, action) => {
            });
    }
);

const chromaToParentSkinReducer = createReducer(
    INITIAL_CHROMA_TO_PARENT_SKIN,
    builder => {
        builder
            .addCase(
                ACTION_SET_CHROMA_TO_PARENT_SKIN,
                (state, action) => {
                    return action.payload;
                }
            )
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .addDefaultCase((state, action) => {
                return undefined;
            });
    }
);


export const store = configureStore({
    reducer: {
        mapAssets: mapAssetsReducer,
        summonerSpells: summonerSpellsReducer,
        skins: skinsReducer,
        queues: queueReducer,
        champions: championReducer,

        ownedSkins: ownedSkinsReducer,
        ownedChampions: ownedChampionsReducer,

        skinsByChampion: skinsByChampionReducer,
        chromaToParentSkin: chromaToParentSkinReducer,

        friends: friendsReducer,
        friendGroups: friendGroupReducer,
        selfPresence: presenceReducer,
        patcherState: patcherReducer,
        lobbyState: lobbyStateReducer,
        lootState: lootStateReducer,
        invitations: invitationsReducer,
        tickerMessages: tickerMessagesReducer,
        internalState: internalStateReducer,
        gameflowState: gameflowStateReducer,
        currentSummoner: currentSummonerReducer,
        champSelectState: champSelectStateReducer,
        matchmakingSearchState: matchmakingSearchStateReducer,
        honorEOGState: honorEOGReducer,

        windowFocused: windowFocusedReducer,
        activeContainer: activeContainerReducer
    }
});