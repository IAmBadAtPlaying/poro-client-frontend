import {useEffect, useState} from "react";
import axios from "axios";
import * as Globals from "../../globals.js";
import styles from "../../styles/social/FriendList.module.css";
import Image from "next/image";

export default function FriendList({friends, self}) {

    const [groups, setGroups] = useState({});
    const [friendsByGroup, setFriendsByGroup] = useState({});
    const [collapsed, setCollapsed] = useState(true);

    const DEFAULT_GROUP_NAME = "**Default";

    useEffect(() => {
        axios.get(Globals.PROXY_PREFIX + "/lol-chat/v1/friend-groups").then(
            (response) => {
                let intermediateGroups = {};
                for (let group of response.data) {
                    if (group.id === undefined) continue;
                    intermediateGroups[group.id] = group;
                }
                setGroups(intermediateGroups);
                updateFriendGroups();
            }
        ).catch(
            (error) => {
                console.log(error);
            }
        )
    }, []);

    useEffect(() => {
        updateFriendGroups();
    }, [friends]);

    const updateFriendGroups = () => {
        let intermediateFriendsByGroup = {};
        if (Globals.isJsonObjectEmpty(friends)) return;
        for (let friendId in friends) {
            let friend = friends[friendId];

            if (friend.groupId === undefined) continue;

            if (intermediateFriendsByGroup[friend.groupId] === undefined) {
                intermediateFriendsByGroup[friend.groupId] = [];
            }

            intermediateFriendsByGroup[friend.groupId].push(friend);
        }

        setFriendsByGroup(intermediateFriendsByGroup);
    }

    const collapseGroup = (groupId) => {
        setGroups({...groups, [groupId]: {...groups[groupId], collapsed: true}})
    }

    const expandGroup = (groupId) => {
        setGroups({...groups, [groupId]: {...groups[groupId], collapsed: false}})
    }

    const renderGroup = (groupId, groupIndex) => {
        if (groups[groupId] === undefined) return <></>;

        let group = groups[groupId];
        let isCollapsed = group.collapsed;

        if (Globals.isJsonObjectEmpty(group)) return <></>;

        if (group.name === DEFAULT_GROUP_NAME) group.name = "General";



        if (isCollapsed) {
            return (
                <div className={styles.groupContainer} key={"Group-"+groupIndex}>
                    <div className={styles.groupCountContainer}>
                        {friendsByGroup[groupId].length}
                    </div>
                    <div className={styles.groupNameContainer}>
                        {group.name}
                    </div>
                    <div className={styles.groupExpanderContainer} onClick={() => {expandGroup(groupId)}}>
                        +
                    </div>
                </div>
            )
        } else return (
            <div key={"Group-"+groupIndex}>
                <div className={styles.groupContainer}>
                    <div className={styles.groupCountContainer}>
                        {friendsByGroup[groupId].length}
                    </div>
                    <div className={styles.groupNameContainer}>
                        {group.name}
                    </div>
                    <div className={styles.groupExpanderContainer} onClick={() => {collapseGroup(groupId)}}>
                        -
                    </div>
                </div>
                {
                    Object.values(friendsByGroup[groupId]).map((friend, index) => {
                        return renderFriend(friend, index);
                    })

                }
            </div>
        )
    }

    const renderFriend = (friend, index) => {
        return (
            <div className={styles.singleFriendContainer} key={"Friend-"+index}>
                <div className={styles.friendIconContainer}>
                    <div className={styles.iconContainer}>
                        <Image
                            src={`${Globals.PROXY_STATIC_PREFIX}/lol-game-data/assets/v1/profile-icons/${friend.iconId}.jpg`}
                            alt="Icon"
                            fill={true}
                            className={styles.friendIcon}
                            draggable={false}
                            loading="lazy"
                        />
                    </div>
                </div>
                <div className={styles.friendInfoContainer}>
                    {friend.name}
                    {

                    }
                </div>
            </div>
        )
    }

    const getContainerStyle = () => {
        let style = styles.container;
        if (collapsed) style += " " + styles.collapsed;
        return style;
    }

    const handleMouseEnter = () => {
        console.log("Mouse enter");
        setCollapsed(false)
    }

    const handleMouseLeave = () => {
        console.log("Mouse leave");
        setCollapsed(true);
    }

    return (
        <div className={getContainerStyle()} onMouseEnter={() => {handleMouseEnter()}} onMouseLeave={() => handleMouseLeave()}>
            <div className={styles.singleFriendContainer}>
                <div className={styles.friendIconContainer}>
                    <div className={styles.iconContainer}>
                        {
                            self.icon === undefined ? <></> :
                                <Image
                                    src={`${Globals.PROXY_STATIC_PREFIX}/lol-game-data/assets/v1/profile-icons/${self.icon}.jpg`}
                                    alt="Icon"
                                    fill={true}
                                    className={styles.friendIcon}
                                    draggable={false}
                                    loading="lazy"
                                />
                        }

                    </div>
                </div>
                <div className={styles.friendInfoContainer}>
                    {self.gameName}
                </div>
            </div>
            {
                (Globals.isJsonObjectEmpty(friendsByGroup)) ? <></> :
                Object.keys(friendsByGroup).map((groupId, groupIndex) => {
                    return renderGroup(groupId, groupIndex);
                })
            }
        </div>
    )
}