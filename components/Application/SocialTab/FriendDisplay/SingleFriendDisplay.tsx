import {Friend} from '../../../../types/Store';
import styles from '../../../../styles/Application/SocialTab/FriendDisplay/SingleFriend.module.css';
import * as Globals from '../../../../Globals';
import PrettyImage from '../../../General/PrettyImage';


interface SingleFriendDisplayProps {
    friend: Friend;
}

export default function SingleFriendDisplay({friend}: SingleFriendDisplayProps) {

    if (friend.gameName == friend.puuid) {
        return (
            <></>
        );
    }

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

    const getActivityString = () => {
        const availability = friend?.availability;
        const gameStatus = friend?.lol?.gameStatus;

        return Globals.getActivityFromCombinedActivity(availability, gameStatus, friend.productName);
    };

    return (
        <div className={styles.container}>
            <div className={styles.shortFlex}>
                <div className={styles.profileIconContainer}>
                    {friend.iconId ?
                        <PrettyImage imgProps={{
                            src: Globals.PROXY_STATIC_PREFIX + '/lol-game-data/assets/v1/profile-icons/' + friend.iconId + '.jpg',
                            alt: 'Profile Icon',
                            className: styles.profileIcon
                        }}
                        />
                        :
                        <></>}
                    <div className={Globals.applyMultipleStyles(
                        styles.activityDiv,
                        getActivityClassName(friend?.availability)
                    )}>

                    </div>
                </div>
            </div>
            <div className={styles.longFlex}>
                <div className={styles.gameNameContainer}>
                    {friend.gameName}
                </div>
                <div className={styles.activityDescription}>
                    {
                        getActivityString()
                    }
                </div>
                <div className={styles.spacer}/>
            </div>
        </div>
    );
}