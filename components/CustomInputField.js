
import styles from "../styles/CustomInputField.module.css";
import ChampionSelector from "./customComponents/ChampionSelector";


export const INPUT_FIELD_TYPE = {
    TEXT: "text",
    NUMBER: "number",
    SELECT: "select",
    CHAMPION_SELECT: "champion_select"
}

/**
 *
 * @param backendType The type of the input field. @see {INPUT_FIELD_TYPE}
 * @param placeholder Placeholder for the input field.
 * @param onChange The function that is called when the input field changes.
 * @param defaultValue The default value of the input field. (optional)
 * @param options The options for the input field.
 * @param wrapperClassName
 * @returns {JSX.Element}
 * @author IAmBadAtPlaying
 */
export default function CustomInputField({wrapperKey, backendType , placeholder, onChange, defaultValue, options, wrapperClassName}) {

    const backendTypeToType = (backendType) => {
        if (backendType === undefined) {
            console.error("Backend type is undefined");
            return INPUT_FIELD_TYPE.TEXT;
        }
        let type = backendType.toLowerCase();

        return type;
    }

    const createOption = (option, index, currentValue) => {
        if (option === undefined) return (<></>);
        if (option.name === undefined) return (<></>);
        if (option.value === undefined) return (<></>);
        return (<option value={option.value} key={"Option"+index} selected={option.value === currentValue}>{option.name}</option>);
    }

    const createInputField = (backendType) => {
        let inputField = null;
        switch (backendType.toLowerCase()) {
            case INPUT_FIELD_TYPE.SELECT:
                if (options === undefined) {
                    console.error("Options are undefined");
                    return (<></>);
                }
                let currentValue = (defaultValue === undefined) ? "" : defaultValue;
                inputField = <select className={styles.customInputField} onChange={onChange}>
                    <option value={""} key={"unselected"} selected={currentValue === ""} disabled={true}>Select an option</option>
                    {options.map((option, index) => {
                        return createOption(option, index, currentValue);
                    })}
                </select>
            break;
            case INPUT_FIELD_TYPE.CHAMPION_SELECT:
                inputField = <ChampionSelector onChange={onChange} currentValue={defaultValue} champions={options}/>
                break;
            default:
                inputField = <input className={styles.customInputField} type={backendTypeToType(backendType)} placeholder={placeholder} onChange={onChange} defaultValue={defaultValue}></input>
            break;
        }

        return inputField;
    }

    return (
        <div className={wrapperClassName} key={(wrapperKey === undefined) ? "default": wrapperKey}>
            {createInputField(backendType)}
        </div>
    )
}
