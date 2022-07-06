import React, { useEffect, useRef, useState } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { Button } from "@nextui-org/react";
import { Api } from "@services/api";
import { ImageSchema } from '@apiTypes/responseSchema';
import { PutImageFileSchema } from "@apiTypes/requestSchema";
import { Image as ImageNextui } from "@nextui-org/react"
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import { fabric } from 'fabric';

interface ImageEditorProps {
    api: Api,
    image: ImageSchema
}

export const ImageEditor = (props: ImageEditorProps): JSX.Element => {
    const cropperRef = useRef<HTMLImageElement>(null);
    const [crop, setCrop] = useState<boolean>(false);
    const [draw, setDraw] = useState<boolean>(false);
    const { selectedObjects, editor, onReady } = useFabricJSEditor();
    useEffect(() => {
        editor?.canvas.setWidth(props.image.size[0].box.width)
        editor?.canvas.setHeight(props.image.size[0].box.height)
        fabric.Image.fromURL(`${props.api.hostName()}/image/file/${props.image.origin}/${props.image.name}`, function (img) {
            // add background image
            editor?.canvas.setBackgroundImage(img, editor?.canvas.renderAll.bind(editor?.canvas), {
                scaleX: editor?.canvas.width / img.width,
                scaleY: editor?.canvas.height / img.height
            });
        });

        const deleteImage = new Image();
        var deleteIcon = "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E";
        deleteImage.src = deleteIcon;

        fabric.Object.prototype.controls.deleteControl = new fabric.Control({
            x: 0.5,
            y: -0.5,
            offsetY: 16,
            cursorStyle: 'pointer',
            mouseUpHandler: (eventData, transformData, x, y): boolean => {
                var target = transformData.target;
                var canvas = target.canvas;
                canvas.remove(target);
                canvas.requestRenderAll();
                return true
            },
            render: (ctx, left, top, styleOverride, fabricObject) => {
                var size = 24;
                ctx.save();
                ctx.translate(left, top);
                ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
                ctx.drawImage(deleteImage, -size / 2, -size / 2, size, size);
                ctx.restore();
            },
        });

    }, [props.api, props.image, fabric, editor])



    const onAddRectangle = () => {
        editor?.addRectangle()
        
    }

    useEffect(() => {
        setCrop(false)
        setDraw(false)
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
            file: cropper.getCroppedCanvas().toDataURL().split(',')[1], // [1] remove the first part "data:image/png;base64"
        }
        props.api.putImageFile(bodyPutImageFileSchema)
        setCrop(false)
    };

    return (
        <>
            {crop ?
                <>
                    {/* cropping mode */}
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
                draw ?
                    <>
                        {/* drawing mode */}
                        <FabricJSCanvas className="sample-canvas" onReady={onReady} />
                        <button onClick={onAddRectangle}>Add Rectangle</button>
                        <br/>
                    </>
                    :
                    <>
                        {/* no mode */}
                        <ImageNextui
                            src={`${props.api.hostName()}/image/file/${props.image.origin}/${props.image.name}`}
                            width={props.image.size[0].box.width}
                            height={props.image.size[0].box.height}
                            alt='image'
                        />
                    </>
            }
            <Button.Group color="warning">
                <Button auto onPress={() => { setDraw(false); setCrop(true) }} css={{ color: "black" }}>START CROPING</Button>
                <Button auto onPress={() => { setDraw(true); setCrop(false) }} css={{ color: "black" }}>START DRAWING</Button>
                <Button auto onPress={() => { setDraw(false); setCrop(false) }} css={{ color: "black" }}>DEFAULT</Button>
            </Button.Group>
        </>
    );
}