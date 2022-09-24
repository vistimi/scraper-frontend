import React, { useEffect, useRef, useState } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { Button, Dropdown, Input } from "@nextui-org/react";
import { Api } from "@services/api";
import { ImageSchema } from '@apiTypes/responseSchema';
import { ImageCopySchema, ImageCropSchema, PutImageTagsPushSchema } from "@apiTypes/requestSchema";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import { fabric } from 'fabric';
import { Garment } from "@apiTypes/garnment";

interface ImageEditorProps {
    api: Api,
    image: ImageSchema,
    updateParent: () => void,
    modeSelactable: boolean,
}

export const ImageEditor = (props: ImageEditorProps): JSX.Element => {
    const cropperRef = useRef<HTMLImageElement>(null);
    const [crop, setCrop] = useState<boolean>(false);
    const [draw, setDraw] = useState<boolean>(false);
    const [tagName, setTagName] = useState<string>("");
    const { selectedObjects, editor, onReady } = useFabricJSEditor();
    const date = new Date().toISOString();
    const garment = Garment;
    const [size, setSize] = useState<{ width: number, height: number }>({ width: 0, height: 0 })

    useEffect(() => {
        const max = 500;
        let width = props.image.size[0].box.width;
        let height = props.image.size[0].box.height;
        if (height > max) {
            width = width * max / height;
            height = max;
        }
        if (width > max) {
            height = height * max / width;
            width = max;
        }
        setSize({ width: width, height: height })

        // default and drawing mode
        if (!crop) {
            editor?.canvas?.remove(...editor?.canvas?._objects)
        }
    },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [props.image, props.api])

    useEffect(() => {
        loadRectangles();
    },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [editor])

    const loadRectangles = () => {
        // if canvas has a context
        if (editor?.canvas.getContext() && props.image) {
            editor?.canvas.setWidth(size.width);
            editor?.canvas.setHeight(size.height);
            const url = `${props.api.hostName()}/image/file/${props.image.name}?${new Date().toISOString()}`  // add date at the end to avoid static image in browser cache
            // editor?.canvas?.remove(...editor?.canvas?._objects)
            fabric.Image.fromURL(url,
                function (img) {
                    // add background image
                    const options = {
                        crossOrigin: "*",
                        scaleX: editor?.canvas.width / img.width,
                        scaleY: editor?.canvas.height / img.height,
                    }
                    editor?.canvas.setBackgroundImage(img, editor?.canvas.renderAll.bind(editor?.canvas), options);
                }
            );

            const tagsWithBoxes = props.image?.tags?.filter(tag => tag.name && tag.origin.box && Object.keys(tag.origin.box).length !== 0 && Object.getPrototypeOf(tag.origin.box) === Object.prototype);
            tagsWithBoxes?.forEach(tag => {
                const color = 'green';
                const rectangle = new fabric.Rect({
                    top: tag.origin.box.y,
                    left: tag.origin.box.x,
                    width: tag.origin.box.width,
                    height: tag.origin.box.height,
                    fill: '',
                    stroke: color,
                    strokeWidth: 2,
                    angle: 0,
                    strokeUniform: true,
                    selectable: false,
                });
                editor?.canvas.add(rectangle);

                const textSpacing = 20;
                const fontSize = 14;
                const block = new fabric.Rect({
                    top: tag.origin.box.y - textSpacing,
                    left: tag.origin.box.x,
                    width: fontSize / 2 * (tag.name.length + 5),
                    height: textSpacing,
                    fill: color,
                    stroke: color,
                    strokeWidth: 2,
                    angle: 0,
                    selectable: false,
                });
                editor?.canvas.add(block);
                var text = new fabric.Text(`${tag.name}: ${(Math.round(tag.origin.confidence * 100) / 100).toFixed(2)}`, {
                    fontFamily: 'Calibri',
                    fontSize: fontSize,
                    top: tag.origin.box.y - textSpacing + 2,
                    left: tag.origin.box.x + 2,
                    height: textSpacing,
                    fill: 'white',
                    selectable: false,
                });
                editor?.canvas.add(text);
            });

            // drawing mode only
            if (draw) {
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
                onAddRectangle();
            }
        }
    }

    const onAddRectangle = () => {
        if (editor?.canvas?._objects?.filter(object => object.selectable).length == 0) {
            const rectangle = new fabric.Rect({
                width: 100,
                height: 100,
                fill: '',
                stroke: 'green',
                strokeWidth: 3,
                angle: 0,
                strokeUniform: true,
            });
            // remove the rotation point
            rectangle.controls = {
                ...fabric.Rect.prototype.controls,
                mtr: new fabric.Control({ visible: false })
            }
            editor?.canvas.add(rectangle);
            editor?.canvas.centerObject(rectangle);
            editor?.canvas.setActiveObject(editor?.canvas._objects[editor?.canvas._objects.length - 1])
        }
    }

    /**
     * onCrop generate the body for a cropping request
     */
    const onCrop = (): ImageCropSchema => {
        if (!['jpg', 'jpeg', 'png'].includes(props.image.extension)) throw new Error(`when croping, file extension ${props.image.extension} is not appropriate`)
        const imageElement: any = cropperRef?.current;
        const cropper: any = imageElement?.cropper;
        const tlx = cropper.cropBoxData.left;
        const tly = cropper.cropBoxData.top;
        const width = cropper.cropBoxData.width;
        const height = cropper.cropBoxData.height;

        const bodyImageCrop: ImageCropSchema = {
            id: props.image._id,
            box: {
                x: Math.round(tlx),
                y: Math.round(tly),
                width: Math.round(width),
                height: Math.round(height),
            },
        }
        return bodyImageCrop
    };

    /**
     * cropCurrentImage update the size, tag boxes and file of the image
     */
    const cropCurrentImage = () => {
        const body = onCrop();
        props.api.putImageCrop(body);  // update current image
        props.updateParent();
        setDraw(true);
    }

    /**
     * cropNewImage creates a new image from this cropping
     */
    const cropNewImage = () => {
        const body = onCrop();
        props.api.postImageCrop(body);  // create a new image
    }

    const copyImage = () => {
        const body: ImageCopySchema = {
            origin: props.image.origin,
            originID: props.image.originID,
            extension: props.image.extension,
        };
        props.api.copyImage(body);  // create a new image
    }

    const onBox = async (tagName: string) => {
        if (editor?.canvas?._objects?.filter(object => object.selectable).length !== 1) {
            alert('There is no bounding box!'); return;
        }
        if (tagName === "") {
            alert('There is no tag name!'); return;
        }
        const selectedObject = editor?.canvas._objects.find(object => object.selectable);
        let tlx = selectedObject.oCoords.tl.x;
        let tly = selectedObject.oCoords.tl.y;
        let brx = selectedObject.oCoords.br.x;
        let bry = selectedObject.oCoords.br.y;
        if (tlx < 0) { tlx = 0 }    // box left outside on the image left
        if (tly < 0) { tly = 0 }    // box top outside on image top
        if (brx < 0) { brx = 0 }    // box right outside on the image left
        if (bry < 0) { bry = 0 }    // box bottom outside on the image top
        if (tlx > props.image.size[0].box.width) { tlx = props.image.size[0].box.width }    // box left outside on the image right
        if (tly > props.image.size[0].box.height) { tly = props.image.size[0].box.height }  // box top outside on the image right
        if (brx > props.image.size[0].box.width) { brx = props.image.size[0].box.width }    // box right outside on the image right
        if (bry > props.image.size[0].box.height) { bry = props.image.size[0].box.height }  // box bottom outside on the image right

        let width = brx - tlx;
        let height = bry - tly;
        if (width < 50 || height < 50) {
            alert(`Width or Height is too small inside the image, below 50 px. width: ${width}, height: ${height}`); return;
        }

        const body: PutImageTagsPushSchema = {
            origin: props.image.origin,
            id: props.image._id,
            // @ts-ignore
            tags: [{
                "name": tagName,
                // @ts-ignore
                "origin": {
                    "name": 'gui',
                    "imageSizeID": props.image.size[0]._id,
                    "box": {
                        "x": Math.round(tlx),
                        "y": Math.round(tly),
                        "width": Math.round(width),
                        "height": Math.round(height),
                    },
                    "confidence": 1.0,
                },
            }],
        }
        await props.api.putImageTagsPush(body);
        alert(`tag '${tagName}' added`);
        props.updateParent();
        editor?.canvas?.forEachObject((object) => { object.selectable = false });
    }

    const selectGarment = async (tagName: string) => {
        await onBox(tagName);
    }

    const WrapperLoopGarment = (garmentObject: object, title: string, closeOnSelect: boolean) => {
        return <Dropdown closeOnSelect={closeOnSelect}>
            <Dropdown.Button flat color="secondary">
                {title}
            </Dropdown.Button>
            <Dropdown.Menu
                color="secondary"
                aria-label="Actions"
                css={{ $$dropdownMenuWidth: "280px" }}
            >
                {loopGarment(garmentObject, 0)}
            </Dropdown.Menu>
        </Dropdown>
    }

    const loopGarment = (garmentObject: object, loop: number) => {
        return Object.entries(garmentObject).map((parentValue, index, _) => {
            const childKey = parentValue[0];
            const childValue = parentValue[1];
            if (typeof childValue === 'string') {
                return <Dropdown.Item key={`string${index}`}>
                    <button
                        onClick={() => { selectGarment(childValue) }}
                        style={{ width: '100%', height: '100%', background: 'transparent', border: 'none', cursor: 'pointer' }}
                    >
                        {childValue}
                    </button>
                </Dropdown.Item>
            } else {
                if (loop === 0) {
                    return < Dropdown.Section title={childKey} key={`object${index}`}>{loopGarment(childValue, loop + 1)}</Dropdown.Section>
                } else {
                    return <Dropdown.Item key={`string${index}`}>{WrapperLoopGarment(childValue, childKey, true)}</Dropdown.Item>
                }
            }
        })
    }

    return (
        <>
            {crop && props.modeSelactable ?
                <>
                    {/* cropping mode */}
                    <Cropper
                        src={`${props.api.hostName()}/image/file/${props.image.name}?${date}`}
                        style={{ marginLeft: "auto", marginRight: "auto", height: size.height, width: size.width }}
                        aspectRatio={1}
                        autoCropArea={1}
                        viewMode={1}
                        background={false}
                        ref={cropperRef}
                        guides={false}
                    />
                    <Button auto onPress={cropCurrentImage} css={{ marginLeft: "auto", marginRight: "auto" }} color="warning">CROP CURRENT IMAGE</Button>
                    <Button auto onPress={cropNewImage} css={{ marginLeft: "auto", marginRight: "auto" }} color="warning">CROP NEW IMAGE</Button>
                    <Button auto onPress={copyImage} css={{ marginLeft: "auto", marginRight: "auto" }} color="success">COPY IMAGE</Button>
                </>
                :
                draw && props.modeSelactable ?
                    <div style={{ display: "grid", justifyContent: "center" }}>
                        {/* drawing mode */}
                        <FabricJSCanvas className="sample-canvas" onReady={onReady} />
                        <br />
                        {WrapperLoopGarment(garment, 'Garment', false)}
                        <br />
                    </div>
                    :
                    <>
                        {/* no mode */}
                        <div style={{ display: "grid", justifyContent: "center" }}>
                            <FabricJSCanvas className="sample-canvas" onReady={onReady} />
                        </div>
                    </>
            }
            <Button.Group color="warning">
                <Button auto onPress={() => { setDraw(false); setCrop(true) }} css={{ color: "black" }}>START CROPING</Button>
                <Button auto onPress={() => { setDraw(true); setCrop(false); loadRectangles(); }} css={{ color: "black" }}>START DRAWING</Button>
                <Button auto onPress={() => { setDraw(false); setCrop(false) }} css={{ color: "black" }}>DEFAULT</Button>
            </Button.Group>
        </>
    );
}