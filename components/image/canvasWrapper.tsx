import React, { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from "react";

interface CanvasWrapperProps {
    backgroundUrl: string | undefined,
    rectangles: RectangleInformations[] | undefined,
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
}

const CanvasWrapper = forwardRef((props: CanvasWrapperProps, reference: React.Ref<CanvasWrapperFunctions>) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    let canvasDimensions: RectangleDimensions = { tlx: 0, tly: 0, width: 500, height: 500 };
    let backgroundImage: HTMLImageElement = null;
    let activeRectangles: RectangleInformations[] = [];
    let latestDragRectangle: RectangleInformations = null;
    let mouseX = [0, 0];
    let mouseY = [0, 0];
    let closeEnough = 10;
    let dragTL = false;
    let dragBL = false;
    let dragTR = false;
    let dragBR = false;

    useEffect(
        () => {
            canvasRef.current?.addEventListener('mousedown', mouseDown, false);
            canvasRef.current?.addEventListener('mouseup', mouseUp, false);
            canvasRef.current?.addEventListener('mousemove', mouseMove, false);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    )

    useEffect(
        () => {
            updateActiveRectangles();
            setBackground();
            draw();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [props]
    )

    useImperativeHandle(reference, () => ({
        getDimensions,
        draw,
    })
    );

    const updateMouse = (e: MouseEvent) => {
        mouseX[1] = mouseX[0];
        mouseY[1] = mouseY[0];
        mouseX[0] = e.pageX - canvasRef.current?.offsetLeft;
        mouseY[0] = e.pageY - canvasRef.current?.offsetTop;
    }

    const mouseDown = (e: MouseEvent) => {
        updateMouse(e);
        for (const activeRectangle of activeRectangles) {
            if (checkCloseEnough(mouseX[0], activeRectangle.dimensions.tlx) && checkCloseEnough(mouseY[0], activeRectangle.dimensions.tly)) {
                dragTL = true; latestDragRectangle = activeRectangle; return;
            }
            // 2. top right
            else if (checkCloseEnough(mouseX[0], activeRectangle.dimensions.tlx + activeRectangle.dimensions.width) && checkCloseEnough(mouseY[0], activeRectangle.dimensions.tly)) {
                dragTR = true; latestDragRectangle = activeRectangle; return;
            }
            // 3. bottom left
            else if (checkCloseEnough(mouseX[0], activeRectangle.dimensions.tlx) && checkCloseEnough(mouseY[0], activeRectangle.dimensions.tly + activeRectangle.dimensions.height)) {
                dragBL = true; latestDragRectangle = activeRectangle; return;
            }
            // 4. bottom right
            else if (checkCloseEnough(mouseX[0], activeRectangle.dimensions.tlx + activeRectangle.dimensions.width) && checkCloseEnough(mouseY[0], activeRectangle.dimensions.tly + activeRectangle.dimensions.height)) {
                dragBR = true; latestDragRectangle = activeRectangle; return;
            }
            // 5. rectangle
            else if (mouseX[0] > activeRectangle.dimensions.tlx && mouseX[0] < activeRectangle.dimensions.tlx + activeRectangle.dimensions.width && mouseY[0] > activeRectangle.dimensions.tly && mouseY[0] < activeRectangle.dimensions.tly + activeRectangle.dimensions.height) {
                dragTL = dragTR = dragBL = dragBR = true; latestDragRectangle = activeRectangle; return;
            }
        }
    }

    const checkCloseEnough = (p1: number, p2: number) => {
        return Math.abs(p1 - p2) < closeEnough;
    }

    const mouseUp = () => {
        dragTL = dragTR = dragBL = dragBR = false;
    }

    const mouseMove = (e: MouseEvent) => {
        if (!(dragTL || dragTR || dragBL || dragBR) || !latestDragRectangle) return;
        updateMouse(e)
        if (dragTL && dragTR && dragBL && dragBR) {
            latestDragRectangle.dimensions.tlx += mouseX[0] - mouseX[1];
            latestDragRectangle.dimensions.tly += mouseY[0] - mouseY[1];
        } else if (dragTL) {
            latestDragRectangle.dimensions.width += latestDragRectangle.dimensions.tlx - mouseX[0];
            latestDragRectangle.dimensions.height += latestDragRectangle.dimensions.tly - mouseY[0];
            latestDragRectangle.dimensions.tlx = mouseX[0];
            latestDragRectangle.dimensions.tly = mouseY[0];
        } else if (dragTR) {
            latestDragRectangle.dimensions.width = Math.abs(latestDragRectangle.dimensions.tlx - mouseX[0]);
            latestDragRectangle.dimensions.height += latestDragRectangle.dimensions.tly - mouseY[0];
            latestDragRectangle.dimensions.tly = mouseY[0];
        } else if (dragBL) {
            latestDragRectangle.dimensions.width += latestDragRectangle.dimensions.tlx - mouseX[0];
            latestDragRectangle.dimensions.height = Math.abs(latestDragRectangle.dimensions.tly - mouseY[0]);
            latestDragRectangle.dimensions.tlx = mouseX[0];
        } else if (dragBR) {
            latestDragRectangle.dimensions.width = Math.abs(latestDragRectangle.dimensions.tlx - mouseX[0]);
            latestDragRectangle.dimensions.height = Math.abs(latestDragRectangle.dimensions.tly - mouseY[0]);
        }
        draw();
    }

    const draw = () => {
        const context = canvasRef.current?.getContext("2d");
        if (context) {
            //clear the canvas
            context?.clearRect(canvasDimensions.tlx, canvasDimensions.tly, canvasDimensions.width, canvasDimensions.height);

            //draw background image
            drawBackground(context);

            // draw tags
            props.rectangles?.forEach(rectangle => {
                if (!rectangle.active) {
                    // draw tag rectangle
                    drawRectangleBoundary(context, rectangle);
                } else {
                    // draw active rectangle
                    drawRectangleFill(context, rectangle);
                    drawHandle(context, rectangle);
                }
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

    const getDimensions = (): RectangleDimensions => {
        if (!latestDragRectangle) return null;
        return adaptDimensions(latestDragRectangle.dimensions);
    }

    const setBackground = () => {
        const background = new Image();
        background.src = props.backgroundUrl;
        background.onload = function () {
            backgroundImage = background;
            canvasDimensions = { tlx: canvasDimensions.tlx, tly: canvasDimensions.tly, width: canvasDimensions.width, height: canvasDimensions.height };
            canvasRef.current.width = backgroundImage.width;
            canvasRef.current.height = backgroundImage.height;
        }
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

    const updateActiveRectangles = () => {
        activeRectangles = props.rectangles.filter(rectangle => rectangle.active);
        if (activeRectangles.length) latestDragRectangle = activeRectangles[0];
    }

    return (
        <canvas ref={canvasRef} height={canvasDimensions.height} width={canvasDimensions.width} />
    )
});

CanvasWrapper.displayName = 'CanvasWrapper';
export default CanvasWrapper