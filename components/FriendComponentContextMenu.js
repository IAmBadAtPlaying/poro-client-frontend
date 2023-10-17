import {axiosSend, send} from "../pages";

export default function FriendComponentContextMenu({x,y, onClose,friend}) {
    const style = {
        position: 'fixed',
        top: `${y}px`,
        left: `${x}px`,
        min_height: '100px',
        min_width: '100px',
        border: '1px solid #d3d3d3',
        backgroundColor: '#0A1428',
        padding: '5px',
        zIndex: 1500
    };

    const inviteIntoLobby = (summonerId, summonerName) => {
        let bodyWrapper = [];
        let body = {};
        body["toSummonerId"] = summonerId;
        body["toSummonerName"] = summonerName;
        bodyWrapper.push(body);
        axiosSend("POST", "/lol-lobby/v2/lobby/invitations", JSON.stringify(bodyWrapper));
        onClose();
    }

    return (
        <div style={style} >
            <div>{friend.name}</div>
            <hr></hr>
            <div onClick={()  => {inviteIntoLobby(friend.summonerId, friend.displayName)}}> Invite Into Game</div>
        </div>
    )
}