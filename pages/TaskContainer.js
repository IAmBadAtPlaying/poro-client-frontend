import React, {useState} from 'react';
import * as Globals from '../globals';
import TaskConfiguration from "./TaskConfiguration";
import styles from  '../styles/TaskContainer.module.css';

export default function TaskContainer() {

    const [params_TASK_AUTO_ACCEPT_QUEUE, setParams_TASK_AUTO_ACCEPT_QUEUE] = useState({});
    const [params_TASK_AUTO_PICK_CHAMP, setParams_TASK_AUTO_PICK_CHAMP] = useState({});



    return(
        <div className={styles.task_container}>
            <div className={styles.header}>
                <h1>TASKS</h1>
                {console.log(params_TASK_AUTO_ACCEPT_QUEUE)}
                {console.log(params_TASK_AUTO_PICK_CHAMP)}
            </div>
            <div className={styles.tasks_container}>
                <TaskConfiguration task={Globals.TASK_AUTO_ACCEPT_QUEUE} setParametersFunction={setParams_TASK_AUTO_ACCEPT_QUEUE}></TaskConfiguration>
                <TaskConfiguration task={Globals.TASK_AUTO_PICK_CHAMP} setParametersFunction={setParams_TASK_AUTO_PICK_CHAMP}></TaskConfiguration>

            </div>
        </div>
    )
}