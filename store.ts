import {configureStore, createAction, createReducer} from '@reduxjs/toolkit';
import {
    ActiveContainerState,
    ChampionState, ContainerState, CurrentSummonerState,
    Friend,
    GameflowState,
    InternalState,
    Invitation, LobbyState, LootState, MapAssets,
    PatcherState,
    PresenceState, TickerMessage
} from './types/Store';
import * as Globals from './Globals';

// eslint-disable @typescript-eslint/no-unused-vars
export interface AppState {
    //========= STATIC =========
    mapAssets: object,
    summonerSpells: object,
    skins: object,
    skinsByChampion: object,
    queues: object,
    champions: ChampionState,
    regaliaInfo: object

    //========= DYNAMIC =========
    internalState: InternalState | Record<string, never>,
    friends: Record<string, Friend>,
    selfPresence: PresenceState | Record<string, never>,
    gameflowState: GameflowState | Record<string, never>,
    patcherState: PatcherState | Record<string, never>,
    lobbyState: LobbyState | Record<string, never>,
    lootState: LootState | Record<string, never>,
    invitations: Invitation[],
    tickerMessages: TickerMessage[],
    taskList: object[],
    currentChatFriend: object,
    currentSummoner: CurrentSummonerState | Record<string, never>

    //--- INVENTORY ---
    ownedIcons: object[],
    ownedWards: object[],
    ownedEmotes: object[],
    ownedSkins: object[],
    ownedChampions: object[]

    //--- UI STATES ---
    activeContainer: ActiveContainerState
}

const INITIAL_CHAMPION_STATE = {};

const INITIAL_MAP_ASSETS_STATE = {};

const INITIAL_PRESENCE_STATE = {} as PresenceState | Record<string, never>;

const INITIAL_PATCHER_STATE = {} as PatcherState | Record<string, never>;

const INITIAL_FRIENDS_STATE = {} as Record<string, Friend> | Record<string, never>;

const INITIAL_GAMEFLOW_STATE = {} as GameflowState | Record<string, never>;

const INITIAL_INTERNAL_STATE = {} as InternalState | Record<string, never>;

const INITIAL_LOBBY_STATE = {} as LobbyState | Record<string, never>;

const INITIAL_LOOT_STATE = {} as LootState | Record<string, never>;

const INITIAL_INVITATIONS = [] as Invitation[];

const INITIAL_TICKER_MESSAGES = [] as TickerMessage[];

const INITIAL_ACTIVE_CONTAINER = {container: ContainerState.NONE} as ActiveContainerState;

const INITIAL_CURRENT_SUMMONER = {} as CurrentSummonerState | Record<string, never>;

export const ACTION_SET_QUEUES = createAction<object>('queues/set');
export const ACTION_SET_FRIENDS = createAction<Record<string, Friend>>('friends/set');
export const ACTION_UPDATE_FRIEND = createAction<Friend>('friend/update');
export const ACTION_SET_CHAMPIONS = createAction<ChampionState | Record<string, never>>('champions/set');
export const ACTION_SET_MAP_ASSETS = createAction<MapAssets>('mapAssets/set');

export const ACTION_SET_SELF_PRESENCE = createAction<PresenceState | Record<string, never>>('presence/set');
export const ACTION_SET_PATCHER_STATE = createAction<PatcherState | Record<string, never>>('patcher/set');
export const ACTION_SET_GAMEFLOW_STATE = createAction<GameflowState | Record<string, never>>('gameflowState/set');
export const ACTION_SET_INTERNAL_STATE = createAction<InternalState | Record<string, never>>('internalState/set');
export const ACTION_SET_LOBBY_STATE = createAction<LobbyState | Record<string, never>>('lobbyState/set');
export const ACTION_SET_LOOT_STATE = createAction<LootState | Record<string, never>>('lootState/set');
export const ACTION_SET_INVITATIONS = createAction<Invitation[]>('invitations/set');
export const ACTION_SET_TICKER_MESSAGES = createAction<TickerMessage[]>('tickerMessages/set');
export const ACTION_SET_HONOR_EOG_STATE = createAction<string>('honorEOG/set');
export const ACTION_SET_ACTIVE_CONTAINER = createAction<ContainerState>('activeContainer/set');

export const ACTION_SET_CURRENT_SUMMONER = createAction<CurrentSummonerState | Record<string, never>>('currentSummoner/set');

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

export const store = configureStore({
    reducer: {
        mapAssets: mapAssetsReducer,
        champions: championReducer,
        friends: friendsReducer,
        selfPresence: presenceReducer,
        patcherState: patcherReducer,
        lobbyState: lobbyStateReducer,
        lootState: lootStateReducer,
        invitations: invitationsReducer,
        tickerMessages: tickerMessagesReducer,
        internalState: internalStateReducer,
        gameflowState: gameflowStateReducer,
        activeContainer: activeContainerReducer,
        currentSummoner: currentSummonerReducer
    }
});