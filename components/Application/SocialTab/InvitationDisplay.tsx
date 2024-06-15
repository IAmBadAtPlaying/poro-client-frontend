import {useSelector} from 'react-redux';
import {AppState} from '../../../store';
import styles from '../../../styles/Application/SocialTab/InvitationDisplay.module.css';
import * as Globals from '../../../Globals';
import PrettyImage from '../../General/PrettyImage';

export default function InvitationDisplay() {

    const invitations = useSelector((state: AppState) => state.invitations);

    const mapAssets = useSelector((state: AppState) => state.mapAssets);

    if (invitations.length === 0) {
        return <></>;
    }

    const renderInvitation = () => {
        return invitations.map((invitation) => {

            if (invitation.state === 'Declined') {
                return <div key={invitation.invitationId}></div>;
            }

            return (
                <div key={invitation.invitationId} className={styles.singleInvitation}>
                    <div className={styles.inviteIconContainer}>
                        <PrettyImage imgProps={{
                            className: styles.headerIcon,
                            src: Globals.PROXY_STATIC_PREFIX + '/' + Globals.getSpecificMapAsset(
                                mapAssets,
                                invitation.gameConfig?.mapId,
                                invitation.gameConfig?.gameMode,
                                'game-select-icon-default'
                            )
                        }}/>
                    </div>
                    <div className={styles.textContainer}>
                        From: {invitation.fromSummonerName}<br/>
                        Acceptable: {invitation.canAcceptInvitation ? 'Yes' : 'No'}

                    </div>
                </div>
            );
        });
    };

    return (
        <div>
            <div className={styles.headerContainer}>
                <div className={styles.headerIconContainer}>
                    <svg className={styles.headerIcon} viewBox="0 0 24 24" fill="none"
                         xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M3 10V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V10M3 10L12 14L21 10M3 10L7 7M21 10L17 7M7 11.7778V5C7 4.44772 7.44772 4 8 4H16C16.5523 4 17 4.44772 17 5V11.7778"
                            stroke="#FAFAFA" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"></path>
                    </svg>
                </div>
                <div className={styles.headerTextContainer}>
                    Invitations ({invitations.length})
                </div>
            </div>
            <div className={Globals.applyMultipleStyles(styles.invitationContainer)}>
                {
                    renderInvitation()
                }
            </div>
        </div>
    );
}