import {useSelector} from 'react-redux';
import {AppState} from '../../../store';
import * as Globals from '../../../Globals';
import GameflowLobby from './ContainerPlay/GameflowLobby';
import GameflowPreEndOfGame from './ContainerPlay/GameflowPreEndOfGame';
import GameflowChampSelect from './ContainerPlay/GameflowChampSelect';

export default function ContainerPlay() {

    const gameflow = useSelector((state: AppState) => state.gameflowState);

    const renderContent = () => {
        switch (gameflow.phase) {
            case Globals.GAMEFLOW_LOBBY:
                return (
                    <GameflowLobby inQueue={false}/>
                );
            case Globals.GAMEFLOW_MATCHMAKING:
            case Globals.GAMEFLOW_READY_CHECK:
                return (
                    <GameflowLobby inQueue={true}/>
                );
            case Globals.GAMEFLOW_PRE_END_OF_GAME:
                return (
                    <GameflowPreEndOfGame/>
                );
            case Globals.GAMEFLOW_CHAMP_SELECT:
                return (
                    <GameflowChampSelect/>
                );
            default:
                return (
                    <></>
                );
        }
    };

    return (
        renderContent()
    );
}