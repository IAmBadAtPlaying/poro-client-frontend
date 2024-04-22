import styles from '../../styles/Application/SocialTab.module.css';
import ProfileDisplay from './SocialTab/ProfileDisplay';
import LobbyDisplay from './SocialTab/LobbyDisplay';
import InvitationDisplay from './SocialTab/InvitationDisplay';
import FriendDisplay from './SocialTab/FriendDisplay';


export default function SocialTab() {
    return (
        <div className={styles.container}>
            <ProfileDisplay/>
            <LobbyDisplay/>
            <InvitationDisplay/>
            <FriendDisplay/>
        </div>
    );
}