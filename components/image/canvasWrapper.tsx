import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

export interface CanvasWrapperProps {
    backgroundUrl: string,
    activeRectangles: RectangleInformations[],
    passiveRectangles: RectangleInformations[],
}

interface CanvasWrapperState {
    canvasDimensions: RectangleDimensions,
    backgroundUrl: string,
    backgroundImage: HTMLImageElement,
    selectedRectangleIndex: number,
    activeRectangles: RectangleInformations[],
    passiveRectangles: RectangleInformations[],
    scaling: number,
}

export interface RectangleDimensions {
    tlx: number;
    tly: number;
    width: number;
    height: number;
}

export interface RectangleInformations {
    active: boolean;
    name: string;
    color: string;
    dimensions: RectangleDimensions;
}

export interface CanvasWrapperFunctions {
    getSelectedRectangleDimensions: () => RectangleDimensions;
}

/**
 *      -------------  x axis
 * 
 *      |   
 *       
 *      |
 * 
 *      |
 * 
 *         y axis
 */

const CanvasWrapper = forwardRef((props: CanvasWrapperProps, reference: React.Ref<CanvasWrapperFunctions>) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const maxCanvasSize = 500;
    const selectCircleRadius = 10;
    const [state, setState] = useState<CanvasWrapperState>({
        canvasDimensions: { tlx: 0, tly: 0, width: 500, height: 500 },
        backgroundUrl: '',
        backgroundImage: null,
        selectedRectangleIndex: 0,
        activeRectangles: [],
        passiveRectangles: [],
        scaling: 1,
    })

    let mouseX = [0, 0];    // index 0: current value, index 1: prev value
    let mouseY = [0, 0];    // index 0: current value, index 1: prev value
    let dragTL = false;
    let dragBL = false;
    let dragTR = false;
    let dragBR = false;
    let ctrlPressed = false;

    // component did mount
    useEffect(
        () => {
            window.addEventListener('keydown', keyDown);
            window.addEventListener('keyup', keyUp);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    )

    useEffect(
        () => {
            (
                async () => {
                    if (props.backgroundUrl && props.backgroundUrl.trim() !== state.backgroundUrl.trim()) await setImage();
                }
            )()
        }
        ,
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [props]
    )

    // handler of forwardRef
    useImperativeHandle(
        reference,
        () => ({
            getSelectedRectangleDimensions,
        })
    );

    /**
    *  mouseDown overrides the mouseDown event and activates the desired parts of the active rectangle
    * @param e mouse event of the canvas
    */
    const mouseDown = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        updateMouse(e);
        for (const [index, rectangle] of state.activeRectangles.entries()) {
            // top left
            if (checkCloseEnough(mouseX[0], rectangle.dimensions.tlx) &&
                checkCloseEnough(mouseY[0], rectangle.dimensions.tly)) {
                dragTL = true; state.selectedRectangleIndex = index; state.activeRectangles[index] = rectangle;
            }
            // top right
            else if (checkCloseEnough(mouseX[0], rectangle.dimensions.tlx + rectangle.dimensions.width) &&
                checkCloseEnough(mouseY[0], rectangle.dimensions.tly)) {
                dragTR = true; state.selectedRectangleIndex = index; state.activeRectangles[index] = rectangle;
            }
            // bottom left
            else if (checkCloseEnough(mouseX[0], rectangle.dimensions.tlx) &&
                checkCloseEnough(mouseY[0], rectangle.dimensions.tly + rectangle.dimensions.height)) {
                dragBL = true; state.selectedRectangleIndex = index; state.activeRectangles[index] = rectangle;
            }
            // bottom right
            else if (checkCloseEnough(mouseX[0], rectangle.dimensions.tlx + rectangle.dimensions.width) &&
                checkCloseEnough(mouseY[0], rectangle.dimensions.tly + rectangle.dimensions.height)) {
                dragBR = true; state.selectedRectangleIndex = index; state.activeRectangles[index] = rectangle;
            }
            // center
            else if (mouseX[0] > rectangle.dimensions.tlx &&
                mouseX[0] < rectangle.dimensions.tlx + rectangle.dimensions.width &&
                mouseY[0] > rectangle.dimensions.tly &&
                mouseY[0] < rectangle.dimensions.tly + rectangle.dimensions.height) {
                dragTL = dragTR = dragBL = dragBR = true; state.selectedRectangleIndex = index; state.activeRectangles[index] = rectangle;
            }
        }
    }

    /**
    *  mouseUp overrides the mouseUp event and stop moving the active rectangle
    */
    const mouseUp = () => {
        dragTL = dragTR = dragBL = dragBR = false;
    }

    /**
    *  mouseMove overrides the mouseMove event and move the desired parts of the rectangle
    * @param e mouse event of the canvas
    */
    const mouseMove = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        if (!(dragTL || dragTR || dragBL || dragBR) || !state.activeRectangles[state.selectedRectangleIndex]) return;

        updateMouse(e);
        const diffX = mouseX[0] - mouseX[1];
        const diffY = mouseY[0] - mouseY[1];

        // center
        if (dragTL && dragTR && dragBL && dragBR) {
            state.activeRectangles[state.selectedRectangleIndex].dimensions.tlx += diffX;
            state.activeRectangles[state.selectedRectangleIndex].dimensions.tly += diffY;
        }
        // top left 
        else if (dragTL) {
            state.activeRectangles[state.selectedRectangleIndex].dimensions.tlx += diffX;
            state.activeRectangles[state.selectedRectangleIndex].dimensions.tly += diffY;
            if (ctrlPressed) {
                const scale = (diffX + diffY) / 2;
                state.activeRectangles[state.selectedRectangleIndex].dimensions.width -= scale;
                state.activeRectangles[state.selectedRectangleIndex].dimensions.height -= scale;
            } else {
                state.activeRectangles[state.selectedRectangleIndex].dimensions.width -= diffX
                state.activeRectangles[state.selectedRectangleIndex].dimensions.height -= diffY
            }
        }
        // top right
        else if (dragTR) {
            state.activeRectangles[state.selectedRectangleIndex].dimensions.tly += diffY;
            if (ctrlPressed) {
                const scale = (diffX + diffY) / 2;
                state.activeRectangles[state.selectedRectangleIndex].dimensions.width += scale;
                state.activeRectangles[state.selectedRectangleIndex].dimensions.height -= scale;
            } else {
                state.activeRectangles[state.selectedRectangleIndex].dimensions.width += diffX
                state.activeRectangles[state.selectedRectangleIndex].dimensions.height -= diffY
            }
        }
        // bottom left
        else if (dragBL) {
            state.activeRectangles[state.selectedRectangleIndex].dimensions.tlx += diffX;
            if (ctrlPressed) {
                const scale = (diffX + diffY) / 2;
                state.activeRectangles[state.selectedRectangleIndex].dimensions.width -= scale;
                state.activeRectangles[state.selectedRectangleIndex].dimensions.height += scale;
            } else {
                state.activeRectangles[state.selectedRectangleIndex].dimensions.width -= diffX
                state.activeRectangles[state.selectedRectangleIndex].dimensions.height += diffY
            }
        }
        // bottom right
        else if (dragBR) {
            if (ctrlPressed) {
                const scale = (diffX + diffY) / 2;
                state.activeRectangles[state.selectedRectangleIndex].dimensions.width += scale;
                state.activeRectangles[state.selectedRectangleIndex].dimensions.height += scale;
            } else {
                state.activeRectangles[state.selectedRectangleIndex].dimensions.width += diffX
                state.activeRectangles[state.selectedRectangleIndex].dimensions.height += diffY
            }
        }
        state.activeRectangles[state.selectedRectangleIndex].dimensions = adaptRectangleDimensionsToCanvas(state.activeRectangles[state.selectedRectangleIndex].dimensions);
        draw();
    }

    /**
    *  keyDown overrides the keyDown event and activate the uniform scaling for the active rectangle
    * @param e mouse event of the canvas
    */
    const keyDown = (e: KeyboardEvent) => {
        ctrlPressed = e.ctrlKey;
        if (e.ctrlKey) {
            if (!state.activeRectangles[state.selectedRectangleIndex]) return;
            if (state.activeRectangles[state.selectedRectangleIndex].dimensions.width < state.activeRectangles[state.selectedRectangleIndex].dimensions.height) {
                state.activeRectangles[state.selectedRectangleIndex].dimensions.height = state.activeRectangles[state.selectedRectangleIndex].dimensions.width;
            } else {
                state.activeRectangles[state.selectedRectangleIndex].dimensions.width = state.activeRectangles[state.selectedRectangleIndex].dimensions.height;
            }
            draw();
        }
    }

    /**
    *  keyUp overrides the keyUp event and deactivate the uniform scaling for the active rectangle
    * @param e mouse event of the canvas
    */
    const keyUp = (e: KeyboardEvent) => {
        ctrlPressed = e.ctrlKey;
    }

    /**
    *  checkCloseEnough checks if two points are within a certain distance
    * @param p1 coordinate on one axis
    * @param p2 coordinate on same axis as p1
    * @returns are the poits close enough
    */
    const checkCloseEnough = (p1: number, p2: number) => {
        return Math.abs(p1 - p2) < selectCircleRadius;
    }

    /**
    *  updateMouse record the events of the mouse and the past ones
    * @param e mouse events of canvas
    */
    const updateMouse = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        mouseX[1] = mouseX[0];
        mouseY[1] = mouseY[0];
        mouseX[0] = e.pageX - canvasRef.current?.offsetLeft;
        mouseY[0] = e.pageY - canvasRef.current?.offsetTop;
    }

    /**
    *  draw erase the previous drawing and redraws on the canvas
    */
    const draw = () => {
        const context = canvasRef.current?.getContext("2d");
        if (context) {
            //clear the canvas
            context?.clearRect(state.canvasDimensions.tlx, state.canvasDimensions.tly, state.canvasDimensions.width, state.canvasDimensions.height);

            drawBackground(context);

            state.passiveRectangles?.forEach((rectangle) => {
                drawRectangleBoundary(context, rectangle);
                const informationRectangle: RectangleInformations = {
                    name: rectangle.name,
                    active: false,
                    color: rectangle.color,
                    dimensions: {
                        tlx: rectangle.dimensions.tlx,
                        tly: rectangle.dimensions.tly,
                        width: rectangle.dimensions.width,
                        height: 20,
                    }
                };
                drawRectangleFill(context, informationRectangle);

                informationRectangle.dimensions.tly += 15;
                informationRectangle.dimensions.tlx += 5;
                drawRectangleText(context, informationRectangle);
            })

            state.activeRectangles?.forEach((rectangle) => {
                drawRectangleFill(context, rectangle);
                drawHandle(context, rectangle);
            });
        }
    }

    /**
    * drawRectangleText draw a text of a passive rectangle on the canvas
    * @param context canvas context for drawing
    * @param rectangle passive text rectangle
    */
    const drawRectangleText = (context: CanvasRenderingContext2D, rectangle: RectangleInformations) => {
        context.fillStyle = 'white';
        context.font = "14px Arial";
        context.fillText(rectangle.name, rectangle.dimensions.tlx, rectangle.dimensions.tly, rectangle.dimensions.width);
    }

    /**
    * drawRectangleFill draw a filled rectangle on the canvas
    * @param context canvas context for drawing
    * @param rectangle passive filled rectangle
    */
    const drawRectangleFill = (context: CanvasRenderingContext2D, rectangle: RectangleInformations) => {
        context.fillStyle = rectangle.color;
        context.fillRect(rectangle.dimensions.tlx, rectangle.dimensions.tly, rectangle.dimensions.width, rectangle.dimensions.height);
    }

    /**
    * drawRectangleBoundary draw the boundary of the passive rectangle on the canvas
    * @param context canvas context for drawing
    * @param rectangle passive boundary rectangle
    */
    const drawRectangleBoundary = (context: CanvasRenderingContext2D, rectangle: RectangleInformations) => {
        context.strokeStyle = rectangle.color;
        context.rect(rectangle.dimensions.tlx, rectangle.dimensions.tly, rectangle.dimensions.width, rectangle.dimensions.height);
        context.stroke();
    }

    /**
    * drawHandle draw the handles of the active rectangle on the canvas
    * @param context canvas context for drawing
    * @param rectangle active rectangle to draw the handles on
    */
    const drawHandle = (context: CanvasRenderingContext2D, rectangle: RectangleInformations) => {
        context.fillStyle = rectangle.color;
        drawCircle(context, rectangle.dimensions.tlx, rectangle.dimensions.tly, selectCircleRadius);
        drawCircle(context, rectangle.dimensions.tlx + rectangle.dimensions.width, rectangle.dimensions.tly, selectCircleRadius);
        drawCircle(context, rectangle.dimensions.tlx + rectangle.dimensions.width, rectangle.dimensions.tly + rectangle.dimensions.height, selectCircleRadius);
        drawCircle(context, rectangle.dimensions.tlx, rectangle.dimensions.tly + rectangle.dimensions.height, selectCircleRadius);
    }

    /**
    * drawCircle draw the circle on the canvas
    * @param context canvas context for drawing
    * @param x
    * @param y
    * @param radius
    */
    const drawCircle = (context: CanvasRenderingContext2D, x: number, y: number, radius: number) => {
        context.beginPath();
        context.arc(x, y, radius, 0, 2 * Math.PI);
        context.fill();
        context.closePath();
    }

    /**
    * drawBackground draw the background of the canvas
    * @param context canvas context for drawing
    */
    const drawBackground = (context: CanvasRenderingContext2D) => {
        if (state.backgroundImage) {
            context.drawImage(
                state.backgroundImage,
                state.canvasDimensions.tlx,
                state.canvasDimensions.tly,
                state.canvasDimensions.width,
                state.canvasDimensions.height);
        }
    }

    /**
    * getSelectedRectangleDimensions get the dimensions of the active rectangle
    * @returns dimensions of the acrive rectangle
    */
    const getSelectedRectangleDimensions = (): RectangleDimensions => {
        if (!state.activeRectangles[state.selectedRectangleIndex]) return null;
        const adaptedSelectedRectangleDimensions = adaptRectangleDimensionsToCanvas(state.activeRectangles[state.selectedRectangleIndex].dimensions);

        // min size required
        const minSizeForSelectedRectangle = 50;
        if (adaptedSelectedRectangleDimensions.width < minSizeForSelectedRectangle ||
            adaptedSelectedRectangleDimensions.height < minSizeForSelectedRectangle) return null;

        // scale to original sizes
        adaptedSelectedRectangleDimensions.tlx /= state.scaling;
        adaptedSelectedRectangleDimensions.tly /= state.scaling;
        adaptedSelectedRectangleDimensions.width /= state.scaling;
        adaptedSelectedRectangleDimensions.height /= state.scaling;
        return adaptedSelectedRectangleDimensions;
    }

    /**
    * loadBackground fetch the image
    * @param src URL of the image
    * @returns Promise of HTML image element
    */
    const loadBackground = (src: string): Promise<HTMLImageElement> => {
        return new Promise<HTMLImageElement>((resolve, reject) => {
            let img = new Image()
            img.src = src
            img.onload = () => {
                if (img) resolve(img);
                reject;
            }
            img.onerror = reject;
        })
    }

    /**
    * updateState updates the state when a new image is loaded
    * @param backgroundImage HTML image element
    */
    const updateState = (backgroundImage: HTMLImageElement) => {
        const newState = state;
        newState.backgroundImage = backgroundImage;
        newState.backgroundUrl = props.backgroundUrl;
        newState.activeRectangles = props.activeRectangles;
        newState.passiveRectangles = props.passiveRectangles;

        newState.scaling = 1;
        newState.scaling *= maxCanvasSize / backgroundImage.height;
        newState.canvasDimensions = {
            tlx: newState.canvasDimensions.tlx,
            tly: newState.canvasDimensions.tly,
            width: backgroundImage.width * newState.scaling,
            height: backgroundImage.height * newState.scaling,
        };
        canvasRef.current.width = newState.canvasDimensions.width;
        canvasRef.current.height = newState.canvasDimensions.height;

        newState.passiveRectangles?.forEach((rectangle) => {
            rectangle.dimensions.tlx *= newState.scaling;
            rectangle.dimensions.tly *= newState.scaling;
            rectangle.dimensions.width *= newState.scaling;
            rectangle.dimensions.height *= newState.scaling;
        });
        setState(newState);
        draw();
    }

    /**
    * setImage load the background image and update the state
    */
    const setImage = async () => {
        try {
            const backgroundImage = await loadBackground(props.backgroundUrl)
            updateState(backgroundImage);
        } catch (error) {
            console.error(`setImage error: ${props.backgroundUrl}`, error)
        }
    }

    /**
     * adaptRectangleDimensionsToCanvas adjust the dimensions of a rectangle to the canvas dimensions
     * @param rectangleDimensions rectangle original dimensions
     * @returns adjusted rectangle dimensions
     */
    const adaptRectangleDimensionsToCanvas = (rectangleDimensions: RectangleDimensions): RectangleDimensions => {
        if (rectangleDimensions.tlx < 0) rectangleDimensions.tlx = 0;   // over left
        if (rectangleDimensions.tly < 0) rectangleDimensions.tly = 0;   // over top 
        if (rectangleDimensions.tlx + rectangleDimensions.width > state.canvasDimensions.width) rectangleDimensions.width = state.canvasDimensions.width - rectangleDimensions.tlx;   // over right
        if (rectangleDimensions.tly + rectangleDimensions.height > state.canvasDimensions.height) rectangleDimensions.height = state.canvasDimensions.height - rectangleDimensions.tly; // over bottom

        if (rectangleDimensions.width < 0) rectangleDimensions.width = 0;
        if (rectangleDimensions.height < 0) rectangleDimensions.height = 0;
        return rectangleDimensions;
    }

    return (
        <canvas
            ref={canvasRef}
            width={state.canvasDimensions.width}
            height={state.canvasDimensions.height}
            onMouseDown={mouseDown}
            onMouseUp={mouseUp}
            onMouseMove={mouseMove}
        />
    )
});

CanvasWrapper.displayName = 'CanvasWrapper';
export default CanvasWrapper