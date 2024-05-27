import React, { useEffect, useState } from 'react';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {}

export interface PrettyImageProps {
    onContextMenu?: (event: React.MouseEvent<HTMLImageElement, MouseEvent>) => void;
    imgProps: ImageProps;
}

const PrettyImage: React.FC<PrettyImageProps> = (props) => {
    const [loadedSrc, setLoadedSrc] = useState('');

    useEffect(() => {
        const img = new Image();
        img.onload = () => {
            setLoadedSrc(props.imgProps.src || '');
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

    return (
        <img draggable={false} style={{userSelect: 'none'}} {...props.imgProps} src={loadedSrc} onContextMenu={handleContextMenu}/>
    );
};

export default PrettyImage;