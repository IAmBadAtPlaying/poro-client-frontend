import styles from '../styles/card.module.css';

export default function BackgroundImage({ url, height, width }) {
    return (
        <div className={styles.bgimage+ " image"}>
            <style>{`
        div.image {
          background-image: url(${url});
          width: ${width}px;
          height: ${height}px;
          transition: transform 0.3s ease;
        }
      `}</style>
        </div>
    );
}