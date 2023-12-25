import * as Globals from '../../globals.js';

export default function baseActivityDisplay({gameflow, setContainer}) {

    const changeToPlayContainer = () => {
        if (setContainer === undefined) return;
        setContainer(Globals.CONTAINER_PLAY);
    }

    return (
        <></>
    )
}