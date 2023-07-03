import React, {useState} from 'react';
import styles from '../styles/TaskConfiguration.module.css'
import * as Globals from '../globals';

export default function TaskConfiguration({task, setParametersFunction}) {
    const [inputValues, setInputValues] = useState({});


    const handleInputChange = (e, backendKey) => {
        console.log(backendKey + " was set to " + e.target.value)
        const num = parseInt(e.target.value);
        if (num === NaN) {
            const newValues = { ...inputValues, [backendKey]:num };
            setInputValues(newValues);
            setParametersFunction(newValues);
        } else {
            const newValues = { ...inputValues, [backendKey]: e.target.value };
            setInputValues(newValues);
            setParametersFunction(newValues);
        }
    };

    return(
        <div className={styles.task_configuration_container}>
            <div className={styles.task_configuration_name}>
                {task.name}
            </div>
            <div className={styles.task_configuration_parameter_container }>
                {Object.values(task.parameters).map((parameter, index) => (
                    <div className={styles.singleTaskConfig} key={task.name + "-"+index}>
                        <div id={"p-" +parameter.backendKey} >{parameter.name}</div>
                        <input className={styles.task_configuration_parameter} id={"input-"+parameter.backendKey} placeholder={parameter.description} onChange={(e) => handleInputChange(e, parameter.backendKey)}>
                        </input>
                        <br></br>
                    </div>
                ))}
            </div>
        </div>
    )
}