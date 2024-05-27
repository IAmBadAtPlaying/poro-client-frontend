import styles from '../../../styles/Application/SocialTab/ProfileDisplay.module.css';
import * as Globals from '../../../Globals';
import ProgressBar from 'react-bootstrap/ProgressBar';
import {useSelector} from 'react-redux';
import {AppState} from '../../../store';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import PrettyImage from '../../General/PrettyImage';

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

    const renderLevelProgressBarTooltip = (percentage: number, currentXp: number, xpTowardsNextLevel: number) => (
        <Tooltip>
            {currentXp} / {xpTowardsNextLevel} XP ({percentage}%)
        </Tooltip>
    );

    const renderLevel = () => {
        if (!level || !xpTowardsNextLevel || !xpSinceLastLevel || !xpPercentage) {
            return <></>;
        }

        return (
            <>
                <OverlayTrigger overlay={renderLevelProgressBarTooltip(
                    xpPercentage,
                    xpSinceLastLevel,
                    xpTowardsNextLevel
                )} placement={'bottom'} delay={{show: 250, hide: 400}}>
                    <ProgressBar now={xpPercentage} style={{height: '0.7dvw', transform: 'translateY(-10%)'}}/>
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
                        <PrettyImage imgProps={{
                            src: Globals.PROXY_STATIC_PREFIX + '/lol-game-data/assets/v1/profile-icons/' + profileIcon + '.jpg',
                            alt: 'Profile Icon',
                            className: styles.profileIcon
                        }}
                        />
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
                    <div className={styles.levelText}>
                        {
                            level ? 'Level ' + level : ''
                        }
                    </div>
                    <div className={styles.renderLevelContainer}>
                        {
                            renderLevel()
                        }
                    </div>
                </div>
                <div className={styles.activityDescription}>
                    {
                        Globals.getActivityFromRemoteActivity(detailedActivity, '')
                    }
                </div>
            </div>
        </div>
    );
}