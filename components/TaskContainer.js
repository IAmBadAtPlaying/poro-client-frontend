import React, {useEffect, useState} from 'react';
import * as Globals from '../globals';
import TaskConfiguration from "./TaskConfiguration";
import styles from  '../styles/tasks/TaskContainer.module.css';
import axios from "axios";

export default function TaskContainer({champions}) {
    //TODO: Communicate Task Updates, right now its a static request

    const callbackArray = [];

    const [taskList, setTaskList] = useState([]);

    const invokeCallback = () => {
        callbackArray.forEach((callback) => {
            callback();
        });
    }

    const fetch = () => {
            axios.get(Globals.REST_PREFIX + "/tasks").then((response) => {
                const data = response.data;
                if (data.httpStatus == 200 && data.tasks != null) {
                    setTaskList(data.tasks);
                }
            }).catch((error) => {
                console.log(error);
            });
    }

    useEffect(() => {
        console.log("Fetching tasks");
        fetch();
    }, []);

    return(
        <div className={styles.task_container}>
            <div className={styles.tasks_container}>
                {
                    taskList.map((task, index) => {
                        return (
                                <TaskConfiguration task={task} key={index} functionArray={callbackArray} index={index} champions={champions}></TaskConfiguration>
                        )
                    })
                }
            </div>
            <div className={styles.submitContainer}>
                <button className={styles.submitButton} onClick={() => {invokeCallback()}}>Submit</button>
            </div>
        </div>
    )
}