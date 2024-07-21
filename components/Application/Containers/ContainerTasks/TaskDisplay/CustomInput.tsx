import {TaskArgument, TaskType} from '../../ContainerTasks';
import ChampionSelector from './CustomInput/ChampionSelector';
import OwnedChampionSelector from './CustomInput/OwnedChampionSelector';
import {Checkbox, FormControl, InputLabel, Select} from '@mui/material';


export interface CustomInputProps {
    setValueData: (key: string, value: any) => void;
    argument: TaskArgument;
}

export default function CustomInput(data: CustomInputProps) {
    switch (data.argument.type) {
        case TaskType.CHECKBOX:
            return (
                <Checkbox style={{
                    width: '100%',
                    height: '100%'
                }}
                    defaultChecked={data.argument.currentValue}
                    onChange={(event) => data.setValueData(
                        data.argument.backendKey,
                        event.target.checked
                    )}
                />
            );
        case TaskType.NUMBER:
            return (
                <input
                    style={{
                        width: '100%',
                        height: '100%'
                    }}
                    type={'number'}
                    defaultValue={data.argument.currentValue? parseInt(data.argument.currentValue) : 0}
                    onChange={(event) => data.setValueData(
                        data.argument.backendKey,
                        parseInt(event.target.value)
                    )}
                />
            );
        case TaskType.TEXT:
            return (
                <input
                    style={{
                        width: '100%',
                        height: '100%'
                    }}
                    type={'text'}
                    defaultValue={data.argument.currentValue ?? ''}
                    onChange={(event) => data.setValueData(
                        data.argument.backendKey,
                        event.target.value
                    )}
                />
            );
        case TaskType.CHAMPION_SELECT:
            return (
                <ChampionSelector selectedChampionId={data.argument.currentValue} onSelect={(championId) => data.setValueData(
                    data.argument.backendKey,
                    championId
                )}/>
            );
        case TaskType.OWNED_CHAMPION_SELECT:
            return (
                <OwnedChampionSelector selectedChampionId={data.argument.currentValue} onSelect={(championId) => data.setValueData(
                    data.argument.backendKey,
                    championId
                )}/>
            );
        default:
            return (
                <div>
                    {`Unsupported type: ${data.argument.type}`}
                </div>
            );
    }
}