import React, { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

interface CanvasWrapperProps {
    backgroundUrl: string,
    activeRectangles: RectangleInformations[],
    passiveRectangles: RectangleInformations[],
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

const CanvasWrapper = forwardRef((props: CanvasWrapperProps, reference: React.Ref<CanvasWrapperFunctions>) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    let canvasDimensions: RectangleDimensions = { tlx: 0, tly: 0, width: 500, height: 500 };
    let backgroundImage: HTMLImageElement = null;
    let selectedRectangleIndex: number = 0;
    let mouseX = [0, 0];    // index 0: current value, index 1: prev value
    let mouseY = [0, 0];    // index 0: current value, index 1: prev value
    let closeEnough = 10;
    let dragTL = false;
    let dragBL = false;
    let dragTR = false;
    let dragBR = false;
    let ctrlPressed = false;

    useEffect(
        () => {
            canvasRef.current?.addEventListener('mousedown', mouseDown, false);
            canvasRef.current?.addEventListener('mouseup', mouseUp, false);
            canvasRef.current?.addEventListener('mousemove', mouseMove, false);
            window.addEventListener('keydown', keyDown);
            window.addEventListener('keyup', keyUp);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    )

    useEffect(
        () => {
            setBackground();
            draw();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [props]
    )

    useImperativeHandle(reference, () => ({
        getSelectedRectangleDimensions,
    }));

    const mouseDown = (e: MouseEvent) => {
        updateMouse(e);
        for (const [index, rectangle] of props.activeRectangles.entries()) {
            // top left
            if (checkCloseEnough(mouseX[0], rectangle.dimensions.tlx) &&
                checkCloseEnough(mouseY[0], rectangle.dimensions.tly)) {
                dragTL = true; selectedRectangleIndex = index; props.activeRectangles[index] = rectangle;
            }
            // top right
            else if (checkCloseEnough(mouseX[0], rectangle.dimensions.tlx + rectangle.dimensions.width) &&
                checkCloseEnough(mouseY[0], rectangle.dimensions.tly)) {
                dragTR = true; selectedRectangleIndex = index; props.activeRectangles[index] = rectangle;
            }
            // bottom left
            else if (checkCloseEnough(mouseX[0], rectangle.dimensions.tlx) &&
                checkCloseEnough(mouseY[0], rectangle.dimensions.tly + rectangle.dimensions.height)) {
                dragBL = true; selectedRectangleIndex = index; props.activeRectangles[index] = rectangle;
            }
            // bottom right
            else if (checkCloseEnough(mouseX[0], rectangle.dimensions.tlx + rectangle.dimensions.width) &&
                checkCloseEnough(mouseY[0], rectangle.dimensions.tly + rectangle.dimensions.height)) {
                dragBR = true; selectedRectangleIndex = index; props.activeRectangles[index] = rectangle;
            }
            // center
            else if (mouseX[0] > rectangle.dimensions.tlx &&
                mouseX[0] < rectangle.dimensions.tlx + rectangle.dimensions.width &&
                mouseY[0] > rectangle.dimensions.tly &&
                mouseY[0] < rectangle.dimensions.tly + rectangle.dimensions.height) {
                dragTL = dragTR = dragBL = dragBR = true; selectedRectangleIndex = index; props.activeRectangles[index] = rectangle;
            }
        }
    }

    const mouseUp = () => {
        dragTL = dragTR = dragBL = dragBR = false;
    }

    const mouseMove = (e: MouseEvent) => {
        if (!(dragTL || dragTR || dragBL || dragBR) || !props.activeRectangles[selectedRectangleIndex]) return;

        updateMouse(e);
        const diffX = mouseX[0] - mouseX[1];
        const diffY = mouseY[0] - mouseY[1];

        /**
         *      y axis
         *      ^
         *      |
         *      |
         *      |
         *      ------------->
         *               x axis
         */

        // center
        if (dragTL && dragTR && dragBL && dragBR) {
            props.activeRectangles[selectedRectangleIndex].dimensions.tlx += diffX;
            props.activeRectangles[selectedRectangleIndex].dimensions.tly += diffY;
        }
        // top left 
        else if (dragTL) {
            props.activeRectangles[selectedRectangleIndex].dimensions.tlx += diffX;
            props.activeRectangles[selectedRectangleIndex].dimensions.tly += diffY;
            if (ctrlPressed) {
                const scale = (diffX + diffY) / 2;
                props.activeRectangles[selectedRectangleIndex].dimensions.width -= scale;
                props.activeRectangles[selectedRectangleIndex].dimensions.height -= scale;
            } else {
                props.activeRectangles[selectedRectangleIndex].dimensions.width -= diffX
                props.activeRectangles[selectedRectangleIndex].dimensions.height -= diffY
            }
        }
        // top right
        else if (dragTR) {
            props.activeRectangles[selectedRectangleIndex].dimensions.tly += diffY;
            if (ctrlPressed) {
                const scale = (diffX + diffY) / 2;
                props.activeRectangles[selectedRectangleIndex].dimensions.width += scale;
                props.activeRectangles[selectedRectangleIndex].dimensions.height -= scale;
            } else {
                props.activeRectangles[selectedRectangleIndex].dimensions.width += diffX
                props.activeRectangles[selectedRectangleIndex].dimensions.height -= diffY
            }
        }
        // bottom left
        else if (dragBL) {
            props.activeRectangles[selectedRectangleIndex].dimensions.tlx += diffX;
            if (ctrlPressed) {
                const scale = (diffX + diffY) / 2;
                props.activeRectangles[selectedRectangleIndex].dimensions.width -= scale;
                props.activeRectangles[selectedRectangleIndex].dimensions.height += scale;
            } else {
                props.activeRectangles[selectedRectangleIndex].dimensions.width -= diffX
                props.activeRectangles[selectedRectangleIndex].dimensions.height += diffY
            }
        }
        // bottom right
        else if (dragBR) {
            if (ctrlPressed) {
                const scale = (diffX + diffY) / 2;
                props.activeRectangles[selectedRectangleIndex].dimensions.width += scale;
                props.activeRectangles[selectedRectangleIndex].dimensions.height += scale;
            } else {
                props.activeRectangles[selectedRectangleIndex].dimensions.width += diffX
                props.activeRectangles[selectedRectangleIndex].dimensions.height += diffY
            }
        }
        props.activeRectangles[selectedRectangleIndex].dimensions = adaptRectangleDimensionsToCanvas(props.activeRectangles[selectedRectangleIndex].dimensions);
        draw();
    }

    const keyDown = (e: KeyboardEvent) => {
        ctrlPressed = e.ctrlKey;
        if (e.ctrlKey) {
            if (!props.activeRectangles[selectedRectangleIndex]) return;
            if (props.activeRectangles[selectedRectangleIndex].dimensions.width < props.activeRectangles[selectedRectangleIndex].dimensions.height) {
                props.activeRectangles[selectedRectangleIndex].dimensions.height = props.activeRectangles[selectedRectangleIndex].dimensions.width;
            } else {
                props.activeRectangles[selectedRectangleIndex].dimensions.width = props.activeRectangles[selectedRectangleIndex].dimensions.height;
            }
            draw();
        }
    }

    const keyUp = (e: KeyboardEvent) => {
        ctrlPressed = e.ctrlKey;
    }

    const checkCloseEnough = (p1: number, p2: number) => {
        return Math.abs(p1 - p2) < closeEnough;
    }

    const updateMouse = (e: MouseEvent) => {
        mouseX[1] = mouseX[0];
        mouseY[1] = mouseY[0];
        mouseX[0] = e.pageX - canvasRef.current?.offsetLeft;
        mouseY[0] = e.pageY - canvasRef.current?.offsetTop;
    }

    const draw = () => {
        const context = canvasRef.current?.getContext("2d");
        if (context) {
            //clear the canvas
            context?.clearRect(canvasDimensions.tlx, canvasDimensions.tly, canvasDimensions.width, canvasDimensions.height);

            drawBackground(context);

            props.passiveRectangles?.forEach((rectangle) => {
                drawRectangleBoundary(context, rectangle);
            })

            props.activeRectangles?.forEach((rectangle) => {
                drawRectangleFill(context, rectangle);
                drawHandle(context, rectangle);
            })
        }
    }

    const drawRectangleFill = (context: CanvasRenderingContext2D, rectangle: RectangleInformations) => {
        context.fillStyle = rectangle.color;
        context.fillRect(rectangle.dimensions.tlx, rectangle.dimensions.tly, rectangle.dimensions.width, rectangle.dimensions.height);
    }

    const drawRectangleBoundary = (context: CanvasRenderingContext2D, rectangle: RectangleInformations) => {
        context.strokeStyle = rectangle.color;
        context.rect(rectangle.dimensions.tlx, rectangle.dimensions.tly, rectangle.dimensions.width, rectangle.dimensions.height);
        context.stroke();
        // context.fillRect(rectangle.dimensions.tlx, rectangle.dimensions.tly, rectangle.dimensions.width, rectangle.dimensions.height)
    }

    const drawHandle = (context: CanvasRenderingContext2D, rectangle: RectangleInformations) => {
        context.fillStyle = rectangle.color;
        drawCircle(context, rectangle.dimensions.tlx, rectangle.dimensions.tly, closeEnough);
        drawCircle(context, rectangle.dimensions.tlx + rectangle.dimensions.width, rectangle.dimensions.tly, closeEnough);
        drawCircle(context, rectangle.dimensions.tlx + rectangle.dimensions.width, rectangle.dimensions.tly + rectangle.dimensions.height, closeEnough);
        drawCircle(context, rectangle.dimensions.tlx, rectangle.dimensions.tly + rectangle.dimensions.height, closeEnough);
    }

    const drawCircle = (context: CanvasRenderingContext2D, x: number, y: number, radius: number) => {
        context.beginPath();
        context.arc(x, y, radius, 0, 2 * Math.PI);
        context.fill();
        context.closePath();
    }

    const drawBackground = (context: CanvasRenderingContext2D) => {
        // if (backgroundImage) context.drawImage(backgroundImage, canvasDimensions.tlx, canvasDimensions.tly);
        context.fillStyle = "rgb(200, 0, 0, 0.5)";
        context.fillRect(canvasDimensions.tlx, canvasDimensions.tly, canvasDimensions.width, canvasDimensions.height);
    }

    const getSelectedRectangleDimensions = (): RectangleDimensions => {
        if (!props.activeRectangles[selectedRectangleIndex]) return null;
        const adaptedSelectedRectangleDimensions = adaptRectangleDimensionsToCanvas(props.activeRectangles[selectedRectangleIndex].dimensions);

        // min size required
        const minSizeForSelectedRectangle = 50;
        if (adaptedSelectedRectangleDimensions.width < minSizeForSelectedRectangle ||
            adaptedSelectedRectangleDimensions.height < minSizeForSelectedRectangle) return null;
        return adaptedSelectedRectangleDimensions;
    }

    const adjustCanvasDimensions = () => {
        const maxCanvasSize = 500;
        if (canvasDimensions.height > maxCanvasSize) {
            canvasDimensions.width = canvasDimensions.width * maxCanvasSize / canvasDimensions.height;
            canvasDimensions.height = maxCanvasSize;
        }
        if (canvasDimensions.width > maxCanvasSize) {
            canvasDimensions.height = canvasDimensions.height * maxCanvasSize / canvasDimensions.width;
            canvasDimensions.width = maxCanvasSize;
        }
    }

    const setBackground = () => {
        const background = new Image();
        background.src = props.backgroundUrl;
        background.onload = function () {
            backgroundImage = background;
            canvasDimensions = { tlx: canvasDimensions.tlx, tly: canvasDimensions.tly, width: background.width, height: background.height };
            adjustCanvasDimensions();
        }
    }

    const adaptRectangleDimensionsToCanvas = (rectangleDimensions: RectangleDimensions): RectangleDimensions => {
        if (rectangleDimensions.tlx < 0) rectangleDimensions.tlx = 0;
        if (rectangleDimensions.tly < 0) rectangleDimensions.tly = 0;
        if (rectangleDimensions.tlx > canvasDimensions.width) rectangleDimensions.tlx = canvasDimensions.width;
        if (rectangleDimensions.tly > canvasDimensions.height) rectangleDimensions.tly = canvasDimensions.height;
        if (rectangleDimensions.tlx + rectangleDimensions.width > canvasDimensions.width) rectangleDimensions.width = canvasDimensions.width - rectangleDimensions.tlx;
        if (rectangleDimensions.tly + rectangleDimensions.height > canvasDimensions.height) rectangleDimensions.height = canvasDimensions.height - rectangleDimensions.tly;
        return rectangleDimensions;
    }

    return (
        <canvas ref={canvasRef} height={canvasDimensions.height} width={canvasDimensions.width} onKeyDown={(e) => keyDown(e.key)} onKeyUp={(e) => keyUp(e.key)} />
    )
});

CanvasWrapper.displayName = 'CanvasWrapper';
export default CanvasWrapper