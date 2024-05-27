import {LobbyMember} from '../../../../../types/Store';
import styles
    from '../../../../../styles/Application/Containers/ContainerPlay/GameflowLobby/LobbyMemberCard.module.css';
import * as Globals from '../../../../../Globals';
import ClickableText from '../../../../General/ClickableText';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip, {TooltipProps} from 'react-bootstrap/Tooltip';
import {JSX, RefAttributes} from 'react';

export interface LobbyMemberCardProps {
    member: LobbyMember | Record<string, never>;
}

export default function LobbyMemberCard(props: LobbyMemberCardProps) {

    const member = props.member;

    const getPositionIconUrl = (position: string) => {
        return Globals.STATIC_PREFIX + '/assets/svg/positions/' + position.toLowerCase() + '.svg';
    };

    const getWingsUrl = (tier: string) => {
        return Globals.STATIC_PREFIX + '/assets/webm/regalia/emblem-wings-magic-' + tier.toLowerCase() + '.webm';
    };
    const getPlateUrl = (tier: string) => {
        return Globals.STATIC_PREFIX + '/assets/png/regalia/plate/wings_' + tier.toLowerCase() + '_plate.png';
    };

    const getPrestigeRegaliaUrl = (selectedCrest: number) => {
        return Globals.STATIC_PREFIX + '/assets/png/regalia/prestige/regalia-prestige-' + selectedCrest + '.png';
    };

    const renderPositionIcons = () => {
        const firstPosition = member?.firstPositionPreference;
        const secondPosition = member?.secondPositionPreference;
        if (firstPosition === undefined || firstPosition === '') {
            return (<></>);
        }

        if (firstPosition === Globals.LOBBY_POSITIONS.FILL || firstPosition === Globals.LOBBY_POSITIONS.UNSELECTED) {
            return (
                <div className={styles.singlePositionContainer}>
                    <div className={styles.position}>
                        <img alt={''} draggable={false} className={`${styles.positionImage} ${styles.noDrag}`}
                            src={getPositionIconUrl(firstPosition)}></img>
                    </div>
                </div>
            );
        } else {
            return (
                <div className={styles.dualPositionsContainer}>
                    <div className={styles.position}>
                        <img alt={''} draggable={false} className={styles.positionImage}
                            src={getPositionIconUrl(firstPosition)}/>
                    </div>
                    <div className={styles.position}>
                        <img alt={''} draggable={false} className={styles.positionImage}
                            src={getPositionIconUrl(secondPosition)}/>
                    </div>
                </div>
            );
        }
    };

    const renderRankedRegalia = () => {
        return (
            <div className={styles.rankedAnimatedContainer}>
                <video draggable={false} className={`${styles.rankedVideo} ${styles.noDrag}`}
                    src={getWingsUrl(member.regalia?.highestRankedEntry.tier)} autoPlay={true} controls={false}
                    muted={true} loop={true}/>
                <img draggable={false} className={`${styles.rankedImage} ${styles.noDrag}`}
                    src={getPlateUrl(member.regalia.highestRankedEntry.tier)} alt={''}/>
            </div>
        );
    };

    const renderNormalRegalia = () => {
        return (
            <>
                <img className={styles.prestigeImage} draggable={false}
                    src={getPrestigeRegaliaUrl(member.regalia.selectedPrestigeCrest)} alt={''}/>
            </>
        );
    };

    const renderRegaliaTooltip = (props: JSX.IntrinsicAttributes & TooltipProps & RefAttributes<HTMLDivElement>) => {
        return (
            <Tooltip id={'regaliaTooltip'} {...props} className={styles.regaliaTooltip}>
                <div className={styles.full}>

                </div>
            </Tooltip>
        );
    };

    const renderRegalia = () => {
        const renderedRegalia = member?.regalia?.crestType === 'ranked' ? renderRankedRegalia() : renderNormalRegalia();
        return (
            <div className={styles.profileContainer}>
                <img draggable={false} className={`${styles.profileImage} ${styles.noDrag}`}
                    src={Globals.PROXY_STATIC_PREFIX + '/lol-game-data/assets/v1/profile-icons/' + member.regalia.profileIconId + '.jpg'}
                    alt={''}/>
                {renderedRegalia}
            </div>
        );

    };

    const renderMember = () => {
        const member = props.member;
        return (
            <div>
                {/*Banner*/}
                {/*Regalia*/}
                {renderRegalia()}
                {/*Name*/}
                <ClickableText text={member?.gameName + '#' + member?.gameTag}>
                    <div className={styles.displayName}>
                        {member?.gameName}
                    </div>
                </ClickableText>
                {renderPositionIcons()}
            </div>
        );
    };

    const renderCard = () => {
        const optRegalia = member?.regalia;

        //Assume no member is present, return empty card
        if (optRegalia === null || optRegalia === undefined) {
            return (
                <div>
                </div>
            );
        }

        return renderMember();
    };

    return (
        <div className={styles.lobbyMemberCard}>
            {
                renderCard()
            }
        </div>
    );
}