import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

interface CanvasWrapperProps {
    // api: Api,
    // image: ImageSchema,
    // updateParent: () => void,
    // modeSelactable: boolean, // images can be edited or not
}

interface RectangleDimensions {
    tlx: number;
    tly: number;
    width: number;
    height: number;
}

interface RectangleInformations {
    active: boolean;
    name: string;
    color: string;
    dimensions: RectangleDimensions;
}

export interface CanvasWrapperFunctions {
    getDimensions: () => RectangleDimensions;
    draw: () => void;
    setCanvas: (url: string, tags: RectangleInformations[]) => void;
    setBackground: (url: string) => void;
}

const CanvasWrapper = forwardRef((props: CanvasWrapperProps, reference: React.Ref<CanvasWrapperFunctions>) => {
    const canvasDimensions = { tlx: 0, tly: 0, width: 500, height: 500 };
    const canvasRef = useRef<HTMLCanvasElement>(null);
    let backgroundImage: HTMLImageElement = null;
    let activeRectangle: RectangleInformations = {
        active: true,
        name: '',
        color: '',
        dimensions: { tlx: 100, tly: 200, width: 300, height: 200 },
    };
    let rectangles: RectangleInformations[] = [activeRectangle];


    let mouseX = [0, 0];
    let mouseY = [0, 0];
    let closeEnough = 10;
    let dragTL = false;
    let dragBL = false;
    let dragTR = false;
    let dragBR = false;

    useEffect(
        () => {
            console.log("new canvas")
            canvasRef.current?.addEventListener('mousedown', mouseDown, false);
            canvasRef.current?.addEventListener('mouseup', mouseUp, false);
            canvasRef.current?.addEventListener('mousemove', mouseMove, false);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    )

    useImperativeHandle(reference, () => ({
        getDimensions,
        draw,
        setBackground,
        setCanvas,
    })
    );

    const updateMouse = (e) => {
        mouseX[1] = mouseX[0];
        mouseY[1] = mouseY[0];
        mouseX[0] = e.pageX - canvasRef.current?.offsetLeft;
        mouseY[0] = e.pageY - canvasRef.current?.offsetTop;
    }

    const mouseDown = (e) => {
        updateMouse(e);

        if (checkCloseEnough(mouseX[0], activeRectangle.dimensions.tlx) && checkCloseEnough(mouseY[0], activeRectangle.dimensions.tly)) {
            dragTL = true;
        }
        // 2. top right
        else if (checkCloseEnough(mouseX[0], activeRectangle.dimensions.tlx + activeRectangle.dimensions.width) && checkCloseEnough(mouseY[0], activeRectangle.dimensions.tly)) {
            dragTR = true;

        }
        // 3. bottom left
        else if (checkCloseEnough(mouseX[0], activeRectangle.dimensions.tlx) && checkCloseEnough(mouseY[0], activeRectangle.dimensions.tly + activeRectangle.dimensions.height)) {
            dragBL = true;

        }
        // 4. bottom right
        else if (checkCloseEnough(mouseX[0], activeRectangle.dimensions.tlx + activeRectangle.dimensions.width) && checkCloseEnough(mouseY[0], activeRectangle.dimensions.tly + activeRectangle.dimensions.height)) {
            dragBR = true;

        }
        // 5. rectangle
        else if (mouseX[0] > activeRectangle.dimensions.tlx && mouseX[0] < activeRectangle.dimensions.tlx + activeRectangle.dimensions.width && mouseY[0] > activeRectangle.dimensions.tly && mouseY[0] < activeRectangle.dimensions.tly + activeRectangle.dimensions.height) {
            dragTL = dragTR = dragBL = dragBR = true;
        }
    }

    const checkCloseEnough = (p1, p2) => {
        return Math.abs(p1 - p2) < closeEnough;
    }

    const mouseUp = () => {
        dragTL = dragTR = dragBL = dragBR = false;
    }

    const mouseMove = (e) => {
        if (!(dragTL || dragTR || dragBL || dragBR)) return;
        updateMouse(e)
        if (dragTL && dragTR && dragBL && dragBR) {
            activeRectangle.dimensions.tlx += mouseX[0] - mouseX[1];
            activeRectangle.dimensions.tly += mouseY[0] - mouseY[1];
        } else if (dragTL) {
            activeRectangle.dimensions.width += activeRectangle.dimensions.tlx - mouseX[0];
            activeRectangle.dimensions.height += activeRectangle.dimensions.tly - mouseY[0];
            activeRectangle.dimensions.tlx = mouseX[0];
            activeRectangle.dimensions.tly = mouseY[0];
        } else if (dragTR) {
            activeRectangle.dimensions.width = Math.abs(activeRectangle.dimensions.tlx - mouseX[0]);
            activeRectangle.dimensions.height += activeRectangle.dimensions.tly - mouseY[0];
            activeRectangle.dimensions.tly = mouseY[0];
        } else if (dragBL) {
            activeRectangle.dimensions.width += activeRectangle.dimensions.tlx - mouseX[0];
            activeRectangle.dimensions.height = Math.abs(activeRectangle.dimensions.tly - mouseY[0]);
            activeRectangle.dimensions.tlx = mouseX[0];
        } else if (dragBR) {
            activeRectangle.dimensions.width = Math.abs(activeRectangle.dimensions.tlx - mouseX[0]);
            activeRectangle.dimensions.height = Math.abs(activeRectangle.dimensions.tly - mouseY[0]);
        }
        draw();
    }

    const draw = () => {
        const context = canvasRef.current?.getContext("2d");
        // console.log(backgroundImage)
        if (context) {
            context?.clearRect(canvasDimensions.tlx, canvasDimensions.tly, canvasDimensions.width, canvasDimensions.height);
            drawBackground(context);
            rectangles.forEach(rectangle => drawRectangle(context, rectangle))
        }
    }

    const drawRectangle = (context: CanvasRenderingContext2D, rectangle: RectangleInformations) => {
        if (rectangle.active) {
            context.fillStyle = "rgb(0, 0, 250, 0.1)";
            context.fillRect(rectangle.dimensions.tlx, rectangle.dimensions.tly, rectangle.dimensions.width, rectangle.dimensions.height);
            drawHandle(context, rectangle.dimensions);
        } else {
            context.strokeStyle = rectangle.color;
            context.fillStyle = "rgb(0, 0, 250, 0.1)";
            context.fillRect(rectangle.dimensions.tlx, rectangle.dimensions.tly, rectangle.dimensions.width, rectangle.dimensions.height)
        }
    }

    const drawHandle = (context: CanvasRenderingContext2D, rectangleDimensions: RectangleDimensions) => {
        drawCircle(context, rectangleDimensions.tlx, rectangleDimensions.tly, closeEnough);
        drawCircle(context, rectangleDimensions.tlx + rectangleDimensions.width, rectangleDimensions.tly, closeEnough);
        drawCircle(context, rectangleDimensions.tlx + rectangleDimensions.width, rectangleDimensions.tly + rectangleDimensions.height, closeEnough);
        drawCircle(context, rectangleDimensions.tlx, rectangleDimensions.tly + rectangleDimensions.height, closeEnough);
    }

    const drawCircle = (context: CanvasRenderingContext2D, x: number, y: number, radius: number) => {
        context.fillStyle = "rgb(200, 0, 0, 0.5)";
        context.beginPath();
        context.arc(x, y, radius, 0, 2 * Math.PI);
        context.fill();
    }

    const drawBackground = (context: CanvasRenderingContext2D) => {
        // context.drawImage(backgroundImage, canvasDimensions.tlx, canvasDimensions.tly);
        context.fillStyle = "rgb(200, 0, 0, 0.5)";
        context.fillRect(canvasDimensions.tlx, canvasDimensions.tly, canvasDimensions.width, canvasDimensions.height);
    }

    const getDimensions = (): RectangleDimensions => {
        const activeRectangles = rectangles.filter(rectangle => rectangle.active);
        return adaptDimensions(activeRectangles[0].dimensions);
    }

    const setBackground = (url: string) => {
        // const background = new Image();
        // background.src = url;
        // background.onload = function () {
        //     setBackgroundImage(background);
        //     canvasRef.current.width = background.width;
        //     canvasRef.current.height = background.height;
        //     draw();
        // }
    }

    const setCanvas = (url: string, tags: RectangleInformations[]) => {
        rectangles = tags;
        const activeRectangle: RectangleInformations = {
            active: true,
            name: '',
            color: '',
            dimensions: { tlx: 100, tly: 200, width: 300, height: 200 },
        }
        rectangles.push(activeRectangle);
        updateActiveRectangle();
    }

    const updateActiveRectangle = () => {
        const activeRectangles = rectangles.filter(rectangle => rectangle.active);
        if (activeRectangles.length > 1) throw new Error("too many active rectangles, only one possible");
        activeRectangle = activeRectangles[0];
    }

    const adaptDimensions = (rectangleDimensions: RectangleDimensions): RectangleDimensions => {
        if (rectangleDimensions.tlx < 0) rectangleDimensions.tlx = 0;
        if (rectangleDimensions.tly < 0) rectangleDimensions.tly = 0;
        if (rectangleDimensions.tlx > canvasDimensions.width) rectangleDimensions.tlx = canvasDimensions.width;
        if (rectangleDimensions.tly > canvasDimensions.height) rectangleDimensions.tly = canvasDimensions.height;
        if (rectangleDimensions.tlx + rectangleDimensions.width > canvasDimensions.width) rectangleDimensions.width = canvasDimensions.width - rectangleDimensions.tlx;
        if (rectangleDimensions.tly + rectangleDimensions.height > canvasDimensions.height) rectangleDimensions.height = canvasDimensions.height - rectangleDimensions.tly;
        return rectangleDimensions;
    }

    return (
        <canvas ref={canvasRef} height={canvasDimensions.height} width={canvasDimensions.width} />
    )
});

CanvasWrapper.displayName = 'CanvasWrapper';
export default CanvasWrapper