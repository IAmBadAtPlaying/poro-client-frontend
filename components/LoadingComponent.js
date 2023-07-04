import React from 'react';
import style from '../styles/LoadingComponent.module.css';
import * as Globals from '../globals';


export default function LoadingComponent({reason}) {
    return (
        <div className={style.loadingContainer}>
            <div className={style.loadingBackground}></div>
            <div className={style.loadingOverlay}></div>
            <div className={style.loadingContent}>
                <img src={Globals.STATIC_PREFIX+"/assets/gifs/Poro.gif"} alt="Loading GIF" className={style.loadingGif} />
                <h1>{reason}</h1>
            </div>
        </div>
    );
}
