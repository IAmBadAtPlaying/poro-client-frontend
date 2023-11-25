import {useState} from "react";

export default function CustomChangingImage({containerClassName, containerStyle, imageClassName, defaultImageSrc, hoverImageSrc, imageStyle}) {
    const [image, setImage] = useState(defaultImageSrc);

    const renderImageOnly = () => {
        if (!imageStyle) imageStyle = {};

        return (
            <img src={image} alt={"Image not found"}
                 style={imageStyle}
                 className={imageClassName}
                 draggable={"false"}
                 onMouseEnter={() => setImage(hoverImageSrc)}
                 onMouseLeave={() => setImage(defaultImageSrc)}/>
        )
    }

    const renderImageWithContainer = () => {
        if (!containerStyle) containerStyle = {};

        return (
            <div className={containerClassName} style={containerStyle}>
                <img src={image} alt={"Image not found"}
                     style={imageStyle}
                     className={imageClassName}
                     draggable={"false"}
                     onMouseEnter={() => setImage(hoverImageSrc)}
                     onMouseLeave={() => setImage(defaultImageSrc)}/>
            </div>

        )
    }

    if (defaultImageSrc && hoverImageSrc) {
        if (containerClassName || containerStyle) return renderImageWithContainer();
        if (imageClassName || imageStyle) return renderImageOnly();
    }

    return (<></>);
}