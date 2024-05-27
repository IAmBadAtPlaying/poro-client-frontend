import {useSelector} from 'react-redux';
import {AppState} from '../../../../../store';

export default function GammodeSelector() {
    const queues = useSelector((state: AppState) => state.queues);


}