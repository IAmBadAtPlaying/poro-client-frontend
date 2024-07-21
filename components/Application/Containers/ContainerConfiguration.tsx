import BackgroundChanger from './ContainerConfiguration/BackgroundChanger';
import styles from '../../../styles/Application/Containers/ContainerConfiguration.module.css';
import LeagueUX from './ContainerConfiguration/LeagueUX';

export default function ContainerConfiguration() {
    return (
        <div style={{
            height: '100%',
            width: '100%',
            border: '2px solid black'
        }}>
            <div className={styles.headerSection}>

            </div>
            <div className={styles.bodySection}>
                <BackgroundChanger/>
                <LeagueUX/>
            </div>
        </div>
    );
}