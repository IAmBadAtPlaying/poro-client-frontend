import React, { useState, useEffect } from 'react';
import * as Globals from "../globals.js";
import styles from "../styles/OverlayComponentTest.module.css";

const OverlayComponent = () => {
    const [isOverlayOpen, setIsOverlayOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const handleOpenOverlay = () => {
        setTimeout(() => {
            setIsOverlayOpen(true);
        }, 0);
    };

    const handleCloseOverlay = () => {
        setSelectedImage(null);
        setIsOverlayOpen(false);
    };

    const handleClick = (id) => {
        setSelectedImage(id);
        console.log(id);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isOverlayOpen && !event.target.closest('.overlay-content')) {
                    handleCloseOverlay();

            }
        };

        window.addEventListener('click', handleClickOutside);

        return () => {
            window.removeEventListener('click', handleClickOutside);
        };
    }, [isOverlayOpen]);

    return (
        <div>
            {/* Your existing content */}
            <button onClick={handleOpenOverlay}>Open Overlay</button>
            <div className={`${styles.overlay} ${isOverlayOpen ? "" : styles.hidden}`}>
                <div className="overlay-content">
                    <img draggable={false} src={Globals.PROXY_STATIC_PREFIX + "/lol-game-data/assets/v1/profile-icons/4025.jpg"} onClick={() => handleClick(1)} />
                    <img draggable={false} src={Globals.PROXY_STATIC_PREFIX + "/lol-game-data/assets/v1/profile-icons/4025.jpg"} onClick={() => handleClick(2)} />
                    <img draggable={false} src={Globals.PROXY_STATIC_PREFIX + "/lol-game-data/assets/v1/profile-icons/4025.jpg"} onClick={() => handleClick(3)} />
                    <img draggable={false} src={Globals.PROXY_STATIC_PREFIX + "/lol-game-data/assets/v1/profile-icons/4025.jpg"} onClick={() => handleClick(4)} />
                    <img draggable={false} src={Globals.PROXY_STATIC_PREFIX + "/lol-game-data/assets/v1/profile-icons/4025.jpg"} onClick={() => handleClick(5)} />
                    <img draggable={false} src={Globals.PROXY_STATIC_PREFIX + "/lol-game-data/assets/v1/profile-icons/4025.jpg"} onClick={() => handleClick(6)} />
                </div>
            </div>
            {/* Rest of your content */}
        </div>
    );
};

export default OverlayComponent;