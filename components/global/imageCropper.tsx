import React, { useEffect, useRef, useState } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { Button } from "@nextui-org/react";
import { Api } from "@services/api";
import { ImageSchema } from '@apiTypes/responseSchema';
import { PutImageFileSchema } from "@apiTypes/requestSchema";
import { Image } from "@nextui-org/react"

interface ImageCropper {
    api: Api,
    image: ImageSchema
}

export const ImageCropper = (props: ImageCropper): JSX.Element => {
    const cropperRef = useRef<HTMLImageElement>(null);
    const [crop, setCrop] = useState<boolean>(false);

    useEffect(() => {
        setCrop(false)
    }, [props.image])


    /**
     * onCrop extracts the canvas image and send it to the backend
     */
    const onCrop = () => {
        const imageElement: any = cropperRef?.current;
        const cropper: any = imageElement?.cropper;
        const bodyPutImageFileSchema: PutImageFileSchema = {
            origin: props.image.origin,
            name: props.image.name,
            file: cropper.getCroppedCanvas().toDataURL().split(',')[1], // remove the first part "data:image/png;base64"
        }
        props.api.putImageFile(bodyPutImageFileSchema)
        setCrop(false)
    };

    return (
        <>
            {crop ?
                <>
                    <Cropper
                        src={`${props.api.hostName()}/image/file/${props.image.origin}/${props.image.name}`}
                        style={{ marginLeft: "auto", marginRight: "auto", height: props.image.size[0].box.height, width: props.image.size[0].box.width }}
                        aspectRatio={1}
                        autoCropArea={1}
                        viewMode={1}
                        background={false}
                        ref={cropperRef}
                        guides={false}
                    />
                    <Button auto onPress={onCrop} css={{ marginLeft: "auto", marginRight: "auto" }} color="warning">CROP</Button>
                </>
                :
                <>
                    <Image
                        src={`${props.api.hostName()}/image/file/${props.image.origin}/${props.image.name}`}
                        width={props.image.size[0].box.width}
                        height={props.image.size[0].box.height}
                        alt='image'
                    />
                    <Button auto onPress={() => { setCrop(true) }} color="warning">START CROPING</Button>
                </>
            }
        </>
    );
}