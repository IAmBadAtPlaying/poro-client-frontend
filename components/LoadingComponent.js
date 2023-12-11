import { useState, useEffect } from 'react';
import style from '../styles/LoadingComponent.module.css';
import * as Globals from '../globals';


export default function LoadingComponent({ reason }) {
    const [showMessage, setShowMessage] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowMessage(true);
        }, 5000);

        return () => {
            clearTimeout(timer);
        };
    }, []);

    const showAdditionalInfo = (doRender) => {
        if (doRender) {
            return(<h3>
                    The League Client is already running ? Click <a href={Globals.GITHUB_ISSUES_LINK} target={"_blank"}  rel={"noreferrer"}>here</a> for troubleshooting
                </h3>)
        } else return (<></>)
    }

    return (
        <div className={style.loadingContainer}>
            <div className={style.loadingBackground}></div>
            <div className={style.loadingOverlay}></div>
            <div className={style.clientLogo}>
                <div className={style.clientLogoImageWrapper}>
                    <img src={Globals.STATIC_PREFIX + '/assets/svg/icon.svg'}/>
                </div>
                <div className={style.clientLogoText}>
                    Poro-Client
                </div>
            </div>
            <div className={style.loadingContent}>
                <img
                    src={Globals.STATIC_PREFIX + '/assets/gifs/Poro.gif'}
                    alt="The Poro-Gif isnt loading, maybe the Application stopped."
                    className={style.loadingGif}
                />
                <h1>{reason}</h1>
                {
                    showAdditionalInfo(showMessage)
                }
            </div>
        </div>
    );
}
