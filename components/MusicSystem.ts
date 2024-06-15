import {useSelector} from 'react-redux';
import {AppState} from '../store';
import {Howl} from 'howler';
import * as Globals from '../Globals';
import {useEffect, useState} from 'react';

export default function MusicSystem() {
    const DEFAULT_FADEOUT_DURATION_MS = 1000;
    const DEFAULT_FADEIN_DURATION_MS = 1000;
    const DEFAULT_VOLUME = 0.5;

    const DEFAULT_CLEANUP_DELAY_MS = DEFAULT_FADEOUT_DURATION_MS * 1.5;

    const gameflow = useSelector((state: AppState) => state.gameflowState);
    const matchmakingSearchState = useSelector((state: AppState) => state.matchmakingSearchState);

    function log(...args: unknown[]): void {
        console.log(
            '[MusicSystem]',
            ...args
        );
    }

    enum SoundReplacementPolicy {
        REPLACE_ALWAYS,
        REPLACE_IF_NULL,
        REPLACE_IF_DIFFERENT
    }

    interface SoundElement extends Record<string, unknown> {
        src: string;
        sound: Howl;
        policy: SoundReplacementPolicy;
    }

    const createSoundElement = (src: string, loop: boolean, replacementPolicy: SoundReplacementPolicy): SoundElement => {
        return {
            src: src,
            sound: new Howl({
                src: [src],
                volume: DEFAULT_VOLUME,
                loop: loop
            }),
            policy: replacementPolicy
        };
    };

    const GF_NONE_SOUND = createSoundElement(
        Globals.PROXY_PREFIX + '/lol-game-data/assets/content/src/LeagueClient/GameModeAssets/Cherry/sound/music-inqueue-loop-cherry.ogg',
        true,
        SoundReplacementPolicy.REPLACE_IF_DIFFERENT
    );

    const GF_LOBBY_SOUND = createSoundElement(
        Globals.PROXY_PREFIX + '/lol-game-data/assets/content/src/LeagueClient/GameModeAssets/ARAM/sound/music-inqueue-loop-howlingabyss.ogg',
        true,
        SoundReplacementPolicy.REPLACE_IF_DIFFERENT
    );


    //Load sounds, so they can be played instantly
    useEffect(
        () => {
            GF_NONE_SOUND.sound.load();
            GF_LOBBY_SOUND.sound.load();
        },
        []
    );

    enum SoundScopes {
        GAMEFLOW = 'gameflow',

        READY_CHECK = 'ready_check',
        // ======= CHAMP SELECT =======
        CHAMP_SELECT_AMBIENT = 'champ_select_ambient',
    }

    type SoundMap = {
        [key in SoundScopes]: SoundElement | null;
    };


    const [currentSound, setCurrentSound] = useState<SoundMap>({} as SoundMap);


    const playSoundEffect = (sfxElement: Howl): void => {
        sfxElement.load();
        sfxElement.play();
    };
    const replaceSound = (scope: SoundScopes, newSound: SoundElement | null): void => {
        const prevSound = currentSound[scope];
        log(
            'Applying replacement policy for scope:',
            scope
        );
        switch (prevSound?.policy) {
            case SoundReplacementPolicy.REPLACE_ALWAYS:
                log(
                    'Replacing, as policy is REPLACE_ALWAYS'
                );
                break;
            case SoundReplacementPolicy.REPLACE_IF_NULL:
                if (prevSound?.sound === null) {
                    log(
                        'Replacing, as policy is REPLACE_IF_NULL'
                    );
                    break;
                }
                return;
            case SoundReplacementPolicy.REPLACE_IF_DIFFERENT:
                if (prevSound?.src === newSound?.src) {
                    return;
                }
                log(
                    'Replacing, as policy is REPLACE_IF_DIFFERENT'
                );
                break;
            default:
                break;
        }
        prevSound?.sound.fade(DEFAULT_VOLUME, 0, DEFAULT_FADEOUT_DURATION_MS);
        setTimeout(
            () => {
                log(
                    'SCOPE CLEANUP:',
                    scope
                );
                prevSound?.sound.mute(true);
                prevSound?.sound.stop();
                prevSound?.sound.unload();
            },
            DEFAULT_CLEANUP_DELAY_MS
        );
        newSound?.sound.play();
        newSound?.sound.volume(0);
        newSound?.sound.fade(
            0,
            DEFAULT_VOLUME,
            DEFAULT_FADEIN_DURATION_MS
        );
        currentSound[scope] = newSound;
        setCurrentSound(currentSound);
    };

    const stopScope = (scope: SoundScopes): void => {
        currentSound[scope]?.sound.fade(
            DEFAULT_VOLUME,
            0,
            DEFAULT_FADEOUT_DURATION_MS
        );
        delete currentSound[scope];
        setCurrentSound(currentSound);
    };

    useEffect(
        () => {
            switch (gameflow.phase) {
                case Globals.GAMEFLOW_LOBBY:
                case Globals.GAMEFLOW_NONE:
                    stopScope(SoundScopes.GAMEFLOW);
                    break;
                case Globals.GAMEFLOW_MATCHMAKING:
                case Globals.GAMEFLOW_READY_CHECK:
                    replaceSound(
                        SoundScopes.GAMEFLOW,
                        GF_NONE_SOUND
                    );
                    break;
                default:
                    stopScope(SoundScopes.GAMEFLOW);

            }
        },
        [gameflow]
    );

    return;
}