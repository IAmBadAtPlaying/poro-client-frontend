import React, {CSSProperties, useEffect, useState} from 'react';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
}

export interface PrettyImageProps {
    onContextMenu?: (event: React.MouseEvent<HTMLImageElement, MouseEvent>) => void;
    className?: string;
    imgProps: ImageProps;
}

const PrettyImage: React.FC<PrettyImageProps> = (props) => {
    const [loadedSrc, setLoadedSrc] = useState('');
    const [error, setError] = useState(false);

    useEffect(() => {
        setError(false);

        const img = new Image();

        img.onload = () => {
            setLoadedSrc(props.imgProps.src || '');
        };
        img.onerror = () => {
            setError(true);
        };
        img.src = props.imgProps.src || '';
    }, [props.imgProps.src]);

    const handleContextMenu = (event: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
        if (props.onContextMenu) {
            props.onContextMenu(event);
        } else {
            event.preventDefault();
        }
    };

    const style: CSSProperties = {
        display: error ? 'none' : 'block',
        outline: 'none',
        userSelect: 'none'
    };

    return (
        <img
            draggable={false}
            style={style}
            className={props.className}
            {...props.imgProps}
            src={loadedSrc}
            onContextMenu={handleContextMenu}
        />
    );
};

export default PrettyImage;