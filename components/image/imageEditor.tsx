import React, { useEffect, useRef, useState } from "react";
import { Button, Checkbox, Dropdown } from "@nextui-org/react";
import { Api } from "@services/api";
import { ImageSchema } from '@apiTypes/responseSchema';
import { ImageCopySchema, ImageCropSchema, PutImageTagsPushSchema } from "@apiTypes/requestSchema";
import { Garment, GarmentInformations } from "@apiTypes/garnment";
import CanvasWrapper, { CanvasWrapperFunctions, CanvasWrapperProps } from "./canvasWrapper";

interface ImageEditorProps {
    api: Api,
    image: ImageSchema,
    updateParent: () => void,
    interactWithCanvas: boolean,
}

export const ImageEditor = (props: ImageEditorProps): JSX.Element => {
    const canvasWrapperRef = useRef<CanvasWrapperFunctions>(null);
    const [canvasWrapperProps, setCanvasWrapperProps] = useState<CanvasWrapperProps>({
        backgroundUrl: '',
        activeRectangles: [{
            active: true,
            name: "",
            color: "rgb(0, 0, 200, 0.2)",
            dimensions: { tlx: 100, tly: 100, width: 200, height: 200 },
        }], // because showActiveRectangles is true at start
        passiveRectangles: [],
    });
    const [showActiveRectangles, setShowActiveRectangles] = useState<boolean>(true);
    const garment = Garment;

    useEffect(
        () => {
            const newCanvasWrapperProps = canvasWrapperProps;
            newCanvasWrapperProps.passiveRectangles = props.image.tags?.filter(tag => tag.origin.confidence).map(tag => {
                return {
                    active: false,
                    name: tag.name,
                    color: 'black',
                    dimensions: {
                        tlx: tag.origin.box.tlx,
                        tly: tag.origin.box.tly,
                        width: tag.origin.box.width,
                        height: tag.origin.box.height,
                    }
                }
            });
            newCanvasWrapperProps.backgroundUrl = `${props.api.hostName()}/image/file/${props.image.origin}/${props.image.name}/${props.image.extension}`;
            setCanvasWrapperProps(newCanvasWrapperProps);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [props.image]
    )

    /**
     *  onCrop generate the body for a cropping request
     * @returns schema for croping and image
     */
    const onCrop = (): ImageCropSchema => {

        const selectedRectangleDimensions = canvasWrapperRef.current?.getSelectedRectangleDimensions();
        if (!selectedRectangleDimensions) return;

        const bodyImageCrop: ImageCropSchema = {
            id: props.image._id,
            box: {
                tlx: Math.round(selectedRectangleDimensions.tlx),
                tly: Math.round(selectedRectangleDimensions.tly),
                width: Math.round(selectedRectangleDimensions.width),
                height: Math.round(selectedRectangleDimensions.height),
            },
        }
        return bodyImageCrop
    };

    /**
     *  requestCropCurrentImage update the size, tag boxes and file of the image in the backend
     */
    const requestCropCurrentImage = () => {
        const body = onCrop();
        if (!body) return;
        props.api.putImageCrop(body);  // update current image
        props.updateParent();
    }

    /**
     * requestCropNewImage creates a new image from this cropping in the backend
     */
    const requestCropNewImage = () => {
        const body = onCrop();
        if (!body) return;
        props.api.postImageCrop(body);  // create a new image
        props.updateParent();
    }

    /**
     *  requestCopyImage copy the image in the backend
     */
    const requestCopyImage = () => {
        const body: ImageCopySchema = {
            origin: props.image.origin,
            originID: props.image.originID,
            name: props.image.name,
            extension: props.image.extension,
        };
        props.api.copyImage(body);  // create a new image
        props.updateParent();
    }

    /**
     *  requestAddTags add a tag to an image in the backend
     * @param tagName the name of the new tag
     */
    const requestAddTags = async (tagName: string) => {
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
            tags: [{
                "name": tagName,
                // @ts-ignore
                "origin": {
                    "name": 'gui',
                    "imageSizeID": props.image.size[0]._id,
                    "box": {
                        "tlx": Math.round(selectedRectangleDimensions.tlx),
                        "tly": Math.round(selectedRectangleDimensions.tly),
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

    type RecursiveMapOf<T> = Map<string, RecursiveMapOf<T>>  // recursive map type
    type ValueOrMap<T> = T | RecursiveMapOf<T>; // type or recursive map type
    type GarmentOrMapOfGarment = ValueOrMap<GarmentInformations>;  // string or recursive map string
    type MapOfGarmentOrMapOfGarment = Map<string, GarmentOrMapOfGarment>; // map of GarmentOrMapOfGarment

    /**
     *  garmentObjectToMap iterate recursively and convert object to map
     * @param garmentObject object garment
     * @returns recursive map of garments
     */
    const garmentObjectToMap = (garmentObject: object): MapOfGarmentOrMapOfGarment => {
        const garmentMap = new Map();
        for (const parentValue of Object.entries(garmentObject)) {
            const key: string = parentValue[0];
            const value: object = parentValue[1];
            console.log(typeof value)

            // leaf element
            if (value.hasOwnProperty('name')) {
                garmentMap.set(key, value);
            }
            // branch element
            else {
                garmentMap.set(key, garmentObjectToMap(value));
            }
        }
        return garmentMap
    }

    /**
     *  newMapRoot create the root of a recursive map
     * @param key garment name
     * @param value recursive map of garments
     * @returns recursive map of garments
     */
    const newMapRoot = (key: string, value: MapOfGarmentOrMapOfGarment): MapOfGarmentOrMapOfGarment => {
        return new Map().set(key, value)
    }

    /**
     *  garmentMapTreeToHtml converts a recursive map of garments to a new html dropdown element
     * @param garmentMap recursive map of garments
     * @param closeOnSelect closes at the slightest interaction with the dropdown
     * @returns html dropdown element
     */
    const garmentMapTreeToHtml = (garmentMap: MapOfGarmentOrMapOfGarment, closeOnSelect: boolean): JSX.Element => {
        const level = 0;
        // only one tree element
        const iterator = garmentMap.entries().next().value
        const key: string = iterator[0];
        const value: GarmentOrMapOfGarment = iterator[1];
        return <Dropdown closeOnSelect={closeOnSelect} key={`tree${key}`}>
            <Dropdown.Button flat color="secondary" key={`treeButton${key}`}>
                {key}
            </Dropdown.Button>
            <Dropdown.Menu
                color="secondary"
                aria-label="Actions"
                css={{ $$dropdownMenuWidth: "280px" }}
                key={`treeMenu${key}`}
            >
                {garmentMapBranchToHtml(value as MapOfGarmentOrMapOfGarment, level + 1)}
            </Dropdown.Menu>
        </Dropdown>
    }

    /**
     *  garmentMapBranchToHtml converst a recursive map of garments to hmtl dropdown corresponding elements
     * @param branches recursive map of garments
     * @param level deepness of the garment tree
     * @returns array of html dropdown corresponding elements
     */
    const garmentMapBranchToHtml = (branches: MapOfGarmentOrMapOfGarment, level: number): JSX.Element[] => {
        return Array.from(branches).map(([key, value]) => {
            if (!value) return;

            console.log(value, value.hasOwnProperty('name'), level)
            if (value.hasOwnProperty('name')) {
                // leaf
                return garmentMapLeafToHtml(value as GarmentInformations);
            } else {
                // new tree because dropdown supports only two levels
                switch (level) {
                    case 1:
                        return < Dropdown.Section title={key} key={`branch${key}`}>{garmentMapBranchToHtml(value as MapOfGarmentOrMapOfGarment, level + 1)}</Dropdown.Section>
                    case 2:
                        return <Dropdown.Item key={`leaf${key}`} >{garmentMapTreeToHtml(newMapRoot(key, value as MapOfGarmentOrMapOfGarment), true)}</Dropdown.Item>
                    default:
                        return <>level not handled</>;
                }
            }
        })
    }

    /**
     *  garmentMapLeafToHtml converts a leaf to the correct dropdown html element 
     * @param leaf name of the leaf
     * @returns html dropdown item element
     */
    const garmentMapLeafToHtml = (leaf: GarmentInformations): JSX.Element => {
        return <Dropdown.Item key={`leaf${leaf.name}`}>
            <button
                onClick={() => { requestAddTags(leaf.name) }}
                style={{ width: '100%', height: '100%', background: 'transparent', border: 'none', cursor: 'pointer' }}
                key={`leafButton${leaf.name}`}
            >
                {leaf.name}
            </button>
        </Dropdown.Item>
    }

    /**
     *  onChangeShowActiveRectangles update the Canvas do show or hide the active rectangle
     * @param isSelected show or hide the active rectangle
     * @returns 
     */
    const onChangeShowActiveRectangles = (isSelected: boolean) => {
        if (isSelected) {
            const newCanvasWrapperProps = canvasWrapperProps;
            newCanvasWrapperProps.activeRectangles = [{
                active: true,
                name: "",
                color: "rgb(0, 0, 200, 0.2)",
                dimensions: { tlx: 100, tly: 100, width: 200, height: 200 },
            }];
            setCanvasWrapperProps(newCanvasWrapperProps);
        }
        setShowActiveRectangles(isSelected);
    }

    return (
        <>
            <div style={{ display: "grid", justifyContent: "center" }}>
                {/** // TODO: child not rerendering when canvasWrapperProps changes */}
                <CanvasWrapper
                    ref={canvasWrapperRef}
                    {...canvasWrapperProps}
                ></CanvasWrapper>

                <Checkbox defaultSelected={showActiveRectangles} onChange={onChangeShowActiveRectangles} >Show active boxes</Checkbox>
                <br />
                {showActiveRectangles && props.interactWithCanvas ?
                    garmentMapTreeToHtml(newMapRoot('garment', garmentObjectToMap(garment)), false) :
                    <></>}
                <br />
            </div>
            <Button auto onPress={requestCropCurrentImage} css={{ marginLeft: "auto", marginRight: "auto" }} color="warning">CROP CURRENT IMAGE</Button>
            <Button auto onPress={requestCropNewImage} css={{ marginLeft: "auto", marginRight: "auto" }} color="warning">CROP NEW IMAGE</Button>
            <Button auto onPress={requestCopyImage} css={{ marginLeft: "auto", marginRight: "auto" }} color="success">COPY IMAGE</Button>
        </>
    );
}