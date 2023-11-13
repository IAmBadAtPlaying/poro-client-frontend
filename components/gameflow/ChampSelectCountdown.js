import {useEffect, useState} from "react";


export default function ChampSelectCountdown({accepted, declined}) {
    let initialProgressPercent = 25;
    let endProgressPercent = 100;
    let duration = 8;
    const pixels = 628.32;
    const pixelPerPercent = (-pixels / 100.0);
    const refreshRateInMs = 25;
    const UpdatesPerSecond = 1000 / refreshRateInMs;
    const totalUpdates = duration * UpdatesPerSecond;

    const colorAccept = "#76e5b1";

    const effectivePercents = endProgressPercent - initialProgressPercent;

    const pixelsPerUpdate = -pixels /totalUpdates * effectivePercents/ 100;

    const [dashOffset, setDashOffset] = useState(pixelPerPercent * initialProgressPercent);
    const [color, setColor] = useState(colorAccept);

    useEffect(() => {
        const currentDashOffset = dashOffset;
        if (accepted || declined) {
            if (declined) setColor("#e57676");
            setDashOffset(pixelPerPercent * initialProgressPercent);
            return;
        }
        if (currentDashOffset <= endProgressPercent * pixelPerPercent) {
            setDashOffset(-628.32);
            return;
        }
        const timer = currentDashOffset > endProgressPercent * pixelPerPercent && setInterval(() => {
            setDashOffset(currentDashOffset + pixelsPerUpdate);
            clearInterval(timer);
        }, refreshRateInMs)
    }, [dashOffset]);



    return (
        <>
            <svg viewBox="-125 -125 250 250" xmlns="http://www.w3.org/2000/svg" style={{transform: `rotate(45deg)`}} fill="transparent">
                <circle r="100" cx="0" cy="0" fill={"#181a1b"} stroke={color} strokeWidth="16px" strokeDasharray={"628.32px"} strokeDashoffset={dashOffset}></circle>
            </svg>
        </>
    )
}