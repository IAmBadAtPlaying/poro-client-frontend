import React, {useEffect, useState} from 'react';
import styles from '../styles/tasks/TaskConfiguration.module.css'
import * as Globals from '../globals';
import axios from "axios";
import {act} from "react-dom/test-utils";
import CustomInputField from "./CustomInputField";

export default function TaskConfiguration({task, functionArray, index}) {


    const [isTaskActive, setIsTaskActive] = useState(task.running);
    const [taskParameters, setTaskParameters] = useState({});

    useEffect(() => {
        console.log("Called useEffect object assign");
        const parameterObject = {};
        Object.values(task.args).forEach((arg) => {
            if (arg.currentValue !== undefined) {
                parameterObject[arg.backendKey] = arg.currentValue;
                console.log("Added " + arg.backendKey + " with value " + arg.currentValue)
            }
        setTaskParameters(parameterObject);
        })}, [task]);

    useEffect(() => {
        console.log("Called useEffect sendTaskConfiguration");
        functionArray[index] = sendTaskConfiguration;
    }, [isTaskActive, taskParameters]);

    const handleCheckboxChange = (event) => {
        console.log(event.target.checked);
        setIsTaskActive(event.target.checked);
    }

    const handleParameterChange = (backendKey, type, value) => {
        console.log("Parameter change for " + backendKey + " with value " + value)
        let actualValue = value;
        switch (type) {
            case "integer":
                actualValue = parseInt(value);
            break;
            default:
                break;
        }

        setTaskParameters((prevParams) => ({
            ...prevParams,
            [backendKey]: actualValue,
        }));
    }

    const sendTaskConfiguration = () => {
        if (isTaskActive) {
            console.log("Sending task configuration for " + task.name);
            const jsonObject = JSON.stringify(taskParameters);

            axios.post(Globals.REST_PREFIX + "/tasks/" + task.name, jsonObject).then((response) => {
                // Handle success if needed
            })
                .catch((error) => {
                });
        } else {
            axios.delete(Globals.REST_PREFIX + "/tasks/" + task.name)
                .then((response) => {
                    // Handle success if needed
                })
                .catch((error) => {
                    // Handle error if needed
                });
        }
    }

    const typeToInputType = (type) => {
        switch (type) {
            case "Integer":
                return "number";
            case "String":
                return "text";
            default:
                return "text";
        }
    }

    return (
        <div className={styles.task_configuration_container}>
            <div className={styles.task_configuration_name}>
                <input className={styles.task_configuration_checkbox} type={"checkbox"} defaultChecked={task.running}
                       onChange={handleCheckboxChange}></input>{task.name}
            </div>
            <div>

            </div>
            <div className={styles.task_configuration_parameter_container}>
                {Object.values(task.args).map((parameter, index) => (
                    <CustomInputField key={task.name + "-" + index} wrapperKey={"Child-"+task.name + "-" + index} placeholder={parameter.displayName} wrapperClassName={styles.singleTaskConfig} backendType={parameter.type} options={parameter.options} defaultValue={parameter.currentValue} onChange={(e) => handleParameterChange(parameter.backendKey, parameter.type, e.target.value)}/>

                ))}
            </div>
        </div>
    )
}