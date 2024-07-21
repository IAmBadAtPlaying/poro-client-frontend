import {Task, TaskArgument, TaskType} from '../ContainerTasks';
import {useEffect, useState} from 'react';
import CustomInput from './TaskDisplay/CustomInput';
import * as Globals from '../../../../Globals';
import axios from 'axios';


export interface TaskDisplayArgs {
    taskName: string;
}

interface TaskArgumentMap {
    [key: string]: any | undefined;
}

const buildTaskArgumentMap = (task: Task | undefined): TaskArgumentMap | undefined => {
    if (task === undefined) {
        return undefined;
    }
    const argumentMap: TaskArgumentMap = {};
    task.arguments.forEach((argument) => {
        switch (argument.type) {
            case TaskType.NUMBER:
                argumentMap[argument.backendKey] = 0;
                break;
            case TaskType.CHECKBOX:
                argumentMap[argument.backendKey] = false;
                break;
            case TaskType.TEXT:
                argumentMap[argument.backendKey] = '';
                break;
            default:
                argumentMap[argument.backendKey] = undefined;
                break;
        }
    });
    return argumentMap;
};

export default function TaskDisplay({taskName}: TaskDisplayArgs) {
    //Task Data is fetched once when the parent component is mounted
    //When this component is mounted, the task data provided by the parent may be stale
    const [currentTaskData, setCurrentTaskData] = useState<Task | undefined>(undefined);

    const [taskArguments, setTaskArguments] = useState<TaskArgumentMap | undefined>(buildTaskArgumentMap(currentTaskData));

    useEffect(
        () => {
            console.log('[Fetch] Task ' + taskName);
            setCurrentTaskData(undefined);
            axios.get(Globals.REST_V1_PREFIX + '/tasks/' + taskName)
                .then((response) => {
                    console.log('[Fetch] Task ' + taskName + ' - Done');
                    setCurrentTaskData(response.data as Task);
                    console.log(response.data);
                })
                .catch((error) => {
                    console.error(error);
                });
        },
        [taskName]
    );

    useEffect(
        () => {
            setTaskArguments(buildTaskArgumentMap(currentTaskData));
        },
        [currentTaskData]
    );

    const isValidTaskArgumentData = (taskArguments: TaskArgumentMap | undefined): boolean => {
        if (taskArguments === undefined) {
            return false;
        }
        for (const key in taskArguments) {
            if (taskArguments[key] === undefined) {
                return false;
            }
        }
        return true;
    };

    const submitTask = () => {
        if (!isValidTaskArgumentData(taskArguments)) {
            console.error('Invalid task argument data');
            return;
        }

        if (currentTaskData?.running) {
            console.log('[Update]: Task ' + taskName);
            axios.put(
                Globals.REST_V1_PREFIX + '/tasks/' + taskName,
                taskArguments
            )
                .then((response) => {
                    console.log('[Update]: Task ' + taskName + ' - Done');
                })
                .catch((error) => {
                    console.error(error);
                });
            return;
        }

        console.log('[Start]: Task ' + taskName);
        axios.post(
            Globals.REST_V1_PREFIX + '/tasks/' + taskName,
            taskArguments
        )
            .then((response) => {
                const newTaskData = {...currentTaskData} as Task;
                newTaskData.running = true;
                setCurrentTaskData(newTaskData);
                console.log('[Start]: Task ' + taskName + ' - Done');
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const stopTask = () => {
        console.log('[Stop]: Task ' + taskName);
        axios.delete(Globals.REST_V1_PREFIX + '/tasks/' + taskName)
            .then((response) => {
                console.log('[Stop]: Task ' + taskName + ' - Done');
                const newTaskData = {...currentTaskData} as Task;
                newTaskData.running = false;
                setCurrentTaskData(newTaskData);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const setValueData = (key: string, value: any) => {
        console.log('Setting value for ' + key + ' to ' + value);
        setTaskArguments((prev) => {
            if (prev === undefined) {
                return undefined;
            }
            const newArguments = {...prev};
            newArguments[key] = value;
            console.log(newArguments);
            return newArguments;
        });
    };

    if (currentTaskData === undefined) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h2>{currentTaskData?.name}</h2>
            <p>{currentTaskData.description}</p>
            <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'auto',
                overflowX: 'hidden',
                alignItems: 'center',
                justifyContent: 'flex-start'
            }}>
                {
                    currentTaskData === undefined ? <p>Loading...</p> :
                        Object.values(currentTaskData.arguments).map((argument) => {
                            return (
                                <div key={argument.backendKey} style={{
                                    width: '50%',
                                    display: 'flex',
                                    flexDirection: 'row'
                                }}>
                                    <div style={{
                                        flex: 1,
                                        width: '100%',
                                        height: '100%'
                                    }}>
                                        {argument.displayName}
                                    </div>
                                    <div style={{
                                        flex: 1,
                                        width: '100%',
                                        height: '100%'
                                    }}>
                                        <CustomInput
                                            argument={argument}
                                            setValueData={setValueData}
                                        />
                                    </div>
                                </div>

                            );
                        })
                }
            </div>
            <button onClick={() => {
                submitTask();
            }}>
                Submit
            </button>
            <button onClick={() => {
                stopTask();
            }}>
                Stop Task
            </button>
        </div>
    );
}