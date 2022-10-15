import React, { createContext, useEffect, useState } from "react";
import { Button, Dropdown } from "@nextui-org/react";
import { Api } from "@services/api";
import { ImageSchema } from 'schemas/responseSchema';
import { ImageCopySchema, ImageCropSchema, PutImageTagsPushSchema } from "schemas/requestSchema";
import { Garment, GarmentInformations } from "schemas/garnment";
import { CanvasWrapper, RectangleDimensions, RectangleInformations } from "./canvasWrapper";

interface ImageEditorProps {
    api: Api,
    image: ImageSchema,
    updateParent: () => void,
    interactWithCanvas: boolean,
}

export interface CanvasWrapperState {
    canvasDimensions: RectangleDimensions,
    backgroundUrl: string,
    selectedRectangleIndex: number,
    showActiveRectangles: boolean,
    activeRectangles: RectangleInformations[],
    passiveRectangles: RectangleInformations[],
    scaling: number,
}
export const CanvasWrapperContext = createContext<[CanvasWrapperState, (state: CanvasWrapperState) => void]>(null);

export const ImageEditor = (props: ImageEditorProps): JSX.Element => {
    const garment = Garment;
    const [canvasWrapperState, setCanvasWrapperState] = useState<CanvasWrapperState>({
        canvasDimensions: { tlx: 0, tly: 0, width: 500, height: 500 },
        backgroundUrl: '',
        selectedRectangleIndex: 0,
        showActiveRectangles: true,
        activeRectangles: [],
        passiveRectangles: [],
        scaling: 1,
    });

    useEffect(
        () => {
            const newState = { ...canvasWrapperState }  // to avoid implicit pointers
            newState.passiveRectangles = props.image.tags?.filter(tag => tag.origin.confidence).map(tag => {
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
            newState.backgroundUrl = `${props.api.hostName()}/image/file/${props.image.origin}/${props.image.name}/${props.image.extension}`;
            newState.activeRectangles = [{
                active: true,
                name: "",
                color: "rgb(0, 0, 200, 0.2)",
                dimensions: { tlx: 100, tly: 100, width: 200, height: 200 },
            }];
            newState.showActiveRectangles = true;
            setCanvasWrapperState(newState);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [props.image]
    )

    /**
     *  onCrop generate the body for a cropping request
     * @returns schema for croping and image
     */
    const onCrop = (): ImageCropSchema | undefined => {
        const selectedRectangleDimensions = getSelectedRectangleDimensions();

        if (selectedRectangleDimensions.width !== selectedRectangleDimensions.height) {
            alert('active box is not square'); return;
        }

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
    const requestCropCurrentImage = async (): Promise<void> => {
        const body = onCrop();
        if (!body) return;
        await props.api.putImageCrop(body);  // update current image
        props.updateParent();
    }

    /**
     * requestCropNewImage creates a new image from this cropping in the backend
     */
    const requestCropNewImage = async (): Promise<void> => {
        const body = onCrop();
        if (!body) return;
        await props.api.postImageCrop(body);  // create a new image
        props.updateParent();
    }

    /**
     *  requestCopyImage copy the image in the backend
     */
    const requestCopyImage = async (): Promise<void> => {
        const body: ImageCopySchema = {
            origin: props.image.origin,
            originID: props.image.originID,
            name: props.image.name,
            extension: props.image.extension,
        };
        await props.api.copyImage(body);  // create a new image
        props.updateParent();
    }

    /**
    * getSelectedRectangleDimensions get the dimensions of the active rectangle
    * @returns dimensions of the acrive rectangle
    */
    const getSelectedRectangleDimensions = (): RectangleDimensions => {
        if (!canvasWrapperState.activeRectangles[canvasWrapperState.selectedRectangleIndex]) return null;
        const selectedRectangleDimensions = canvasWrapperState.activeRectangles[canvasWrapperState.selectedRectangleIndex].dimensions;

        // min size required
        const minSizeForSelectedRectangle = 50;
        if (selectedRectangleDimensions.width < minSizeForSelectedRectangle ||
            selectedRectangleDimensions.height < minSizeForSelectedRectangle) return null;

        // scale to original sizes
        selectedRectangleDimensions.tlx /= canvasWrapperState.scaling;
        selectedRectangleDimensions.tly /= canvasWrapperState.scaling;
        selectedRectangleDimensions.width /= canvasWrapperState.scaling;
        selectedRectangleDimensions.height /= canvasWrapperState.scaling;
        return selectedRectangleDimensions;
    }

    /**
     *  requestAddTags add a tag to an image in the backend
     * @param tagName the name of the new tag
     */
    const requestAddTags = async (tagName: string): Promise<void> => {
        if (tagName === "") {
            alert('there is no tag name'); return;
        }

        const selectedRectangleDimensions = getSelectedRectangleDimensions();
        if (!selectedRectangleDimensions) {
            alert('no active rectange'); return;
        }

        // const newCanvasWrapperState = canvasWrapperState;
        // newCanvasWrapperState.passiveRectangles?.push({
        //     active: false,
        //     name: tagName,
        //     color: 'black',
        //     dimensions: {
        //         tlx: selectedRectangleDimensions.tlx * canvasWrapperState.scaling,
        //         tly: selectedRectangleDimensions.tly * canvasWrapperState.scaling,
        //         width: selectedRectangleDimensions.width * canvasWrapperState.scaling,
        //         height: selectedRectangleDimensions.height * canvasWrapperState.scaling,
        //     }
        // });
        // setCanvasWrapperState(newCanvasWrapperState);

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
                onClick={async () => { await requestAddTags(leaf.name) }}
                style={{ width: '100%', height: '100%', background: 'transparent', border: 'none', cursor: 'pointer' }}
                key={`leafButton${leaf.name}`}
            >
                {leaf.name}
            </button>
        </Dropdown.Item>
    }

    return (
        <>
            <div style={{ display: "grid", justifyContent: "center" }}>

                <CanvasWrapperContext.Provider value={[canvasWrapperState, setCanvasWrapperState]}>
                    <CanvasWrapper />
                </CanvasWrapperContext.Provider>
                <br />
                {canvasWrapperState.showActiveRectangles && props.interactWithCanvas ?
                    garmentMapTreeToHtml(newMapRoot('garment', garmentObjectToMap(garment)), false) :
                    <></>}
                <br />
            </div>
            <Button auto onPress={async ()=>{await requestCropCurrentImage()}} css={{ marginLeft: "auto", marginRight: "auto" }} color="warning">CROP CURRENT IMAGE</Button>
            <Button auto onPress={async ()=>{await requestCropNewImage()}} css={{ marginLeft: "auto", marginRight: "auto" }} color="warning">CROP NEW IMAGE</Button>
            <Button auto onPress={async ()=>{await requestCopyImage()}} css={{ marginLeft: "auto", marginRight: "auto" }} color="success">COPY IMAGE</Button>
        </>
    );
}