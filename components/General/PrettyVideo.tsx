import React, { useEffect, useState } from 'react';

interface VideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {}

export interface PrettyVideoProps {
    onContextMenu?: (event: React.MouseEvent<HTMLVideoElement, MouseEvent>) => void;
    className?: string;
    videoProps: VideoProps;
}

const PrettyVideo: React.FC<PrettyVideoProps> = (props) => {
    const [loadedSrc, setLoadedSrc] = useState('');

    useEffect(() => {
        const video = document.createElement('video');
        video.load();
        video.onloadeddata = () => {
            setLoadedSrc(props.videoProps.src || '');
        };
        video.src = props.videoProps.src || '';
    }, [props.videoProps.src]);

    const handleContextMenu = (event: React.MouseEvent<HTMLVideoElement, MouseEvent>) => {
        if (props.onContextMenu) {
            props.onContextMenu(event);
        } else {
            event.preventDefault();
        }
    };

    return (
        <video draggable={false} className={props.className} style={{userSelect: 'none'}} {...props.videoProps} src={loadedSrc} onContextMenu={handleContextMenu}/>
    );
};

export default PrettyVideo;