import React, { useRef } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { Button } from "@nextui-org/react";
import { Api } from "@services/api";
import { ImageSchema } from '@apiTypes/responseSchema';
import { PutImageFileSchema } from "@apiTypes/requestSchema";

interface ImageCropper {
    api: Api,
    image: ImageSchema
}

export const ImageCropper = (props: ImageCropper): JSX.Element => {
    const cropperRef = useRef<HTMLImageElement>(null);
    const onCrop = () => {
        const imageElement: any = cropperRef?.current;
        const cropper: any = imageElement?.cropper;
        const bodyPutImageFileSchema: PutImageFileSchema = {
            origin: props.image.origin,
            name: props.image.name,
            file: cropper.getCroppedCanvas().toDataURL().split(',')[1], // remove the first part "data:image/png;base64"
        }
        props.api.putImageFile(bodyPutImageFileSchema)
    };


    return (
        <>
            <Cropper
                src={`${props.api.hostName()}/image/file/${props.image.origin}/${props.image.name}`}
                style={{ marginLeft: "auto", marginRight: "auto", height: props.image.height, width: props.image.width }}
                aspectRatio={1}
                autoCropArea={1}
                viewMode={1}
                background={false}
                ref={cropperRef}
                guides={false}
            />
            <Button auto onPress={onCrop} css={{marginLeft: "auto", marginRight: "auto"}} color="warning">CROP</Button>
        </>
    );
}