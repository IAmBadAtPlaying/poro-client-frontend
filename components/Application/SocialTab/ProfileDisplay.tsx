import styles from '../../../styles/Application/SocialTab/ProfileDisplay.module.css';
import * as Globals from '../../../Globals';
import ProgressBar from 'react-bootstrap/ProgressBar';
import {useSelector} from 'react-redux';
import {AppState} from '../../../store';
import {JSX, RefAttributes} from 'react';
import Tooltip, {TooltipProps} from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';

export default function ProfileDisplay() {

    const selfPresence = useSelector((state: AppState) => state.selfPresence);
    const currentSummoner = useSelector((state: AppState) => state.currentSummoner);

    const profileIcon = selfPresence?.icon;
    const activity = selfPresence?.availability;
    const gameName = selfPresence?.gameName;
    const detailedActivity = selfPresence?.lol?.gameStatus;

    const level = currentSummoner?.summonerLevel;
    const xpTowardsNextLevel = currentSummoner?.xpUntilNextLevel;
    const xpSinceLastLevel = currentSummoner?.xpSinceLastLevel;
    const xpPercentage = currentSummoner?.percentCompleteForNextLevel;

    const renderLevelProgressBarTooltip = (currentXp: number, xpTowardsNextLevel: number) => (
        <Tooltip id="button-tooltip">
            {currentXp} / {xpTowardsNextLevel} XP
        </Tooltip>
    );

    const renderLevel = () => {
        if (!level || !xpTowardsNextLevel || !xpSinceLastLevel || !xpPercentage) {
            return <></>;
        }

        return (
            <>
                <OverlayTrigger overlay={renderLevelProgressBarTooltip(
                    xpSinceLastLevel,
                    xpTowardsNextLevel
                )} placement={'bottom'} delay={{show: 250, hide: 400}}>
                    <ProgressBar now={xpPercentage} label={xpPercentage + '%'} style={{transform: 'translateY(25%)'}}/>
                </OverlayTrigger>
            </>
        );
    };

    const getActivityClassName = (availability: string): string => {
        switch (availability) {
            case 'online':
            case 'chat':
                return styles.chat;
            case 'dnd':
                return styles.dnd;
            case 'away':
                return styles.away;
            case 'mobile':
            case 'offline':
            default:
                return styles.offline;
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.shortFlex}>
                <div className={styles.profileIconContainer}>
                    {profileIcon ?
                        <img className={styles.profileIcon}
                             src={'http://localhost:35199/proxy/lol-game-data/assets/v1/profile-icons/' + profileIcon + '.jpg'}
                             alt="Profile Icon"/>
                        :
                        <></>}
                    <div className={Globals.applyMultipleStyles(
                        styles.activityDiv,
                        getActivityClassName(activity)
                    )}>

                    </div>
                </div>
            </div>
            <div className={styles.longFlex}>
                <div className={styles.gameNameContainer}>
                    {gameName}
                </div>
                <div className={styles.levelContainer}>
                    {
                        renderLevel()
                    }
                </div>
                <div className={styles.activityDescription}>
                    {
                        Globals.remoteActivityToActivity(detailedActivity)
                    }
                </div>
            </div>
        </div>
    );
}