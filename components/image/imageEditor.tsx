import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { Button, Checkbox, Dropdown, Input } from "@nextui-org/react";
import { Api } from "@services/api";
import { ImageSchema } from '@apiTypes/responseSchema';
import { ImageCopySchema, ImageCropSchema, PutImageTagsPushSchema } from "@apiTypes/requestSchema";
import { fabric } from 'fabric';
import { Garment } from "@apiTypes/garnment";
import CanvasWrapper, { CanvasWrapperFunctions, RectangleInformations } from "./canvasWrapper";

interface ImageEditorProps {
    api: Api,
    image: ImageSchema,
    updateParent: () => void,
    interactWithCanvas: boolean,
}

export const ImageEditor = (props: ImageEditorProps): JSX.Element => {
    const canvasWrapperRef = useRef<CanvasWrapperFunctions>(null);
    const [rectangles, setRectangles] = useState<RectangleInformations[]>([]);
    const [showActiveRectangles, setShowActiveRectangles] = useState<boolean>(true);
    const garment = Garment;

    let tagsRectangles: RectangleInformations[] = [
        {
            active: false,
            name: "t-shirt: 0.8",
            color: 'black',
            dimensions: { tlx: 10, tly: 10, width: 50, height: 50 }
        }
    ];
    let activeRectangles: RectangleInformations[] = [
        {
            active: true,
            name: "",
            color: "rgb(0, 0, 200, 0.2)",
            dimensions: { tlx: 100, tly: 100, width: 200, height: 200 }
        }
    ]; // only one or none used so far

    // fires after the render is committed to the screen
    useEffect(
        () => {
            if (showActiveRectangles) {
                const concatRectangles = tagsRectangles.concat(activeRectangles);
                setRectangles(concatRectangles);
            } else {
                setRectangles(tagsRectangles);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [props.image, showActiveRectangles]
    )

    /**
     * onCrop generate the body for a cropping request
     */
    const onCrop = (): ImageCropSchema => {

        const selectedRectangleDimensions = canvasWrapperRef.current?.getSelectedRectangleDimensions();
        if (!selectedRectangleDimensions) return null;

        const bodyImageCrop: ImageCropSchema = {
            id: props.image._id,
            box: {
                x: Math.round(selectedRectangleDimensions.tlx),
                y: Math.round(selectedRectangleDimensions.tly),
                width: Math.round(selectedRectangleDimensions.width),
                height: Math.round(selectedRectangleDimensions.height),
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
    }

    /**
     * cropNewImage creates a new image from this cropping
     */
    const cropNewImage = () => {
        const body = onCrop();
        props.api.postImageCrop(body);  // create a new image
        props.updateParent();
    }

    const copyImage = () => {
        const body: ImageCopySchema = {
            origin: props.image.origin,
            originID: props.image.originID,
            name: props.image.name,
            extension: props.image.extension,
        };
        props.api.copyImage(body);  // create a new image
    }

    const onBox = async (tagName: string) => {
        if (tagName === "") {
            alert('there is no tag name'); return;
        }
        const selectedRectangleDimensions = canvasWrapperRef.current?.getSelectedRectangleDimensions();
        if (!selectedRectangleDimensions) {
            alert('no active rectange'); return;
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
                        "x": Math.round(selectedRectangleDimensions.tlx),
                        "y": Math.round(selectedRectangleDimensions.tly),
                        "width": Math.round(selectedRectangleDimensions.width),
                        "height": Math.round(selectedRectangleDimensions.height),
                    },
                    "confidence": 1.0,
                },
            }],
        }
        await props.api.putImageTagsPush(body);
        alert(`tag '${tagName}' added`);
        props.updateParent();
    }

    const selectGarment = async (tagName: string) => {
        await onBox(tagName);
    }

    const WrapperLoopGarment = (garmentObject: object, title: string, closeOnSelect: boolean) => {
        return <>
            <Dropdown closeOnSelect={closeOnSelect}>
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
            </Dropdown></>
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

    const onChangeShowActiveRectangles = (isSelected: boolean) => {
        setShowActiveRectangles(isSelected);
    }

    return (
        <>
            <div style={{ display: "grid", justifyContent: "center" }}>
                <CanvasWrapper ref={canvasWrapperRef} rectangles={rectangles} backgroundUrl={'test'} />
                <Checkbox defaultSelected={showActiveRectangles} onChange={onChangeShowActiveRectangles} >Show active boxes</Checkbox>
                <br />
                {showActiveRectangles && props.interactWithCanvas ? WrapperLoopGarment(garment, 'Garment', false) : <></>}
                <br />
            </div>
            <Button auto onPress={cropCurrentImage} css={{ marginLeft: "auto", marginRight: "auto" }} color="warning">CROP CURRENT IMAGE</Button>
            <Button auto onPress={cropNewImage} css={{ marginLeft: "auto", marginRight: "auto" }} color="warning">CROP NEW IMAGE</Button>
            <Button auto onPress={copyImage} css={{ marginLeft: "auto", marginRight: "auto" }} color="success">COPY IMAGE</Button>

        </>
    );
}