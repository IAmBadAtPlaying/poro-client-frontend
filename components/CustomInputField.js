/**
 *
 * @param backendType The type of the input field. @see {INPUT_FIELD_TYPE}
 * @param placeholder Placeholder for the input field.
 * @param onChange The function that is called when the input field changes.
 * @param defaultValue The default value of the input field. (optional)
 * @param options The options for the input field. (only
 * @param wrapperClassName
 * @returns {JSX.Element}
 * @author IAmBadAtPlaying
 */



export const INPUT_FIELD_TYPE = {
    TEXT: "text",
    NUMBER: "number",
    SELECT: "select",
}

export default function CustomInputField({wrapperKey, backendType , placeholder, onChange, defaultValue, options, wrapperClassName}) {

    const backendTypeToType = (backendType) => {
        if (backendType === undefined) {
            console.error("Backend type is undefined");
            return INPUT_FIELD_TYPE.TEXT;
        }
        let type = backendType.toLowerCase();

        return type;
    }

    const createOption = (option, index) => {
        if (option === undefined) return (<></>);
        if (option.name === undefined) return (<></>);
        if (option.value === undefined) return (<></>);
        return (<option value={option.value} key={"Option"+index}>{option.name}</option>);
    }

    const createInputField = (backendType) => {
        let inputField = null;
        switch (backendType.toLowerCase()) {
            case INPUT_FIELD_TYPE.SELECT:
                if (options === undefined) {
                    console.error("Options are undefined");
                    return (<></>);
                }
                inputField = <select className={"customInputField"} onChange={onChange}>
                    <option value={""} key={"unselected"}>-</option>
                    {options.map((option, index) => {
                        return createOption(option, index);
                    })}
                </select>
            break;
            default:
                inputField = <input className={"customInputField"} type={backendTypeToType(backendType)} placeholder={placeholder} onChange={onChange} defaultValue={defaultValue}></input>
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
