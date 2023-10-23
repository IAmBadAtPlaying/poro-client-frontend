import * as Globals from "../globals";
import {useEffect, useState} from "react";
import styles from "../styles/LobbyContainerRoleSelection.module.css";

export default function LobbyContainerRoleSelection({ setPositionPreference, positionPreference}) {
    const [isOverlayOpen, setIsOverlayOpen] = useState(false);
    const [overlayPosition, setOverlayPosition] = useState({ top: 0, left: 0 })


    const handleOpenOverlay = (event) => {
        const overlayWidth = window.innerHeight * 0.25;
        const cursorX = event.clientX;
        const cursorY = event.clientY;

        const leftPosition = cursorX - overlayWidth / 2;
        const topPosition = cursorY + 10;

        setOverlayPosition({ top: topPosition, left: leftPosition });

        setIsOverlayOpen(true);
        setTimeout(() => {
            setIsOverlayOpen(true);
        }, 0);
    }

    const handleCloseOverlay = () => {
        setIsOverlayOpen(false);
    };

    const handleClick = (name) => {
        setPositionPreference(name);
        handleCloseOverlay();
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isOverlayOpen && !event.target.closest('.overlay-content')) {
                handleCloseOverlay();
            }
        };

        if (isOverlayOpen) {
            window.addEventListener('click', handleClickOutside);
        }

        return () => {
            window.removeEventListener('click', handleClickOutside);
        };
    }, [isOverlayOpen]);

    const doRender = (isOpen) => {
        if (isOpen) {
            return (
                <>
                    <div className={styles.background_darken}>
                        <div className={styles.overlay_content} style={{top: overlayPosition.top/1.15, left: overlayPosition.left/1.25}}>
                            <img alt={"top"} className={styles.position_image} src={Globals.STATIC_PREFIX +"/assets/svg/positions/top.svg"} onClick={() => handleClick("TOP")}></img>
                            <img alt={"jungle"} className={styles.position_image} src={Globals.STATIC_PREFIX +"/assets/svg/positions/jungle.svg"} onClick={() => handleClick("JUNGLE")}></img>
                            <img alt={"middle"} className={styles.position_image} src={Globals.STATIC_PREFIX +"/assets/svg/positions/middle.svg"} onClick={() => handleClick("MIDDLE")}></img>
                            <img alt={"bottom"} className={styles.position_image} src={Globals.STATIC_PREFIX +"/assets/svg/positions/bottom.svg"} onClick={() => handleClick("BOTTOM")}></img>
                            <img alt={"utility"} className={styles.position_image} src={Globals.STATIC_PREFIX +"/assets/svg/positions/utility.svg"} onClick={() => handleClick("UTILITY")}></img>
                            <div className={styles.separator} style={{border: `${Globals.GOLD4} solid 2px`}}/>
                            <img alt={"fill"} className={styles.position_image} src={Globals.STATIC_PREFIX +"/assets/svg/positions/fill.svg"} onClick={() => handleClick("FILL")}></img>
                        </div>
                    </div>
                </>
            )
        } else return (
            <>
            </>
        )
    }

    return (
        <>
            <button onClick={handleOpenOverlay} className={styles.overlay_button}>
                <img draggable={false} src={Globals.STATIC_PREFIX +"/assets/svg/positions/"+positionPreference.toLowerCase()+".svg"} alt={positionPreference.toLowerCase()} className={styles.position_image}></img>
            </button>
            {doRender(isOverlayOpen)}
        </>
    )
}