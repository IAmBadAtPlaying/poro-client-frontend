import RuneSelector from '../../General/RuneSelector';
import {useState} from 'react';

export default function ContainerTasks() {

    const [runeSelectorVisible, setRuneSelectorVisible] = useState(true);


    return (
        <>
            {runeSelectorVisible && <RuneSelector setVisible={setRuneSelectorVisible}/>}
        </>
    );
}