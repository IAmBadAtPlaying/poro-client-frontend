import RuneSelector from '../../General/RuneSelector';
import {useEffect, useState} from 'react';
import styles from '../../../styles/Application/Containers/ContainerTasks.module.css';
import axios from 'axios';
import {REST_V1_PREFIX} from '../../../Globals';
import ChampionSelector from './ContainerTasks/TaskDisplay/CustomInput/ChampionSelector';
import OwnedChampionSelector from './ContainerTasks/TaskDisplay/CustomInput/OwnedChampionSelector';
import TaskDisplay from './ContainerTasks/TaskDisplay';


export enum TaskType {
    TEXT = 'TEXT',
    COLOR = 'COLOR',
    CHECKBOX = 'CHECKBOX',
    NUMBER = 'NUMBER',
    CHAMPION_SELECT = 'CHAMPION_SELECT',
    OWNED_CHAMPION_SELECT = 'OWNED_CHAMPION_SELECT',
    SELECT = 'SELECT',
}

export interface TaskArgument {
    displayName: string;
    backendKey: string;
    type: TaskType;
    required: boolean;
    description: string;
    currentValue?: any;
    additionalData?: any;
}

export interface Task {
    name: string;
    running: boolean;
    arguments: TaskArgument[];
    description: string;
}

export default function ContainerTasks() {

    const [taskNames, setTaskNames] = useState<string[]| undefined>(undefined);
    const [activeTaskIndex, setActiveTaskIndex] = useState<number | undefined>(0);

    useEffect(
        () => {
            axios.get(REST_V1_PREFIX + '/tasks')
                .then((response) => {
                    setTaskNames(response.data as string[]);
                    console.log(response.data);
                })
                .catch((error) => {
                    console.error(error);
                });
        },
        []
    );

    useEffect(
        () => {
            if (taskNames === undefined) {
                return;
            }
            setActiveTaskIndex(0);
        },
        [taskNames]
    );

    return (
        <div className={styles.container}>
            <li/>
            <li/>
            <li/>
            <li/>
            {
                (taskNames === undefined) ? <p>Loading...</p> :
                    taskNames.length === 0 ? <p>No tasks available</p> :
                        <>
                            <div>
                                {
                                    taskNames.map((taskName, index) => {
                                        return (
                                            <button key={index} onClick={() => setActiveTaskIndex(index)}>{taskName}</button>
                                        );
                                    })
                                }
                            </div>
                            <div>
                                <TaskDisplay taskName={taskNames[activeTaskIndex]}/>
                            </div>
                        </>
            }
        </div>
    );
}