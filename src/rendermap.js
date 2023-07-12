import * as three from "three";

export const arcCenterX = 200;
export const trackRadius = 225;
export const trackWidth = 80;

export const innerTrackRadius = trackRadius - trackWidth;
export const outerTrackRadius = trackRadius + trackWidth;

const StadiumRadius = 400

export function getLineMarkings(mapWidth, mapHeight) {
    const canvas = document.createElement("canvas");
    canvas.width = mapWidth;
    canvas.height = mapHeight;
    const context = canvas.getContext("2d");

    context.fillStyle = "#546E90";
    context.fillRect(0, 0, mapWidth, mapHeight);

    context.lineWidth = 2;
    context.strokeStyle = "#E0FFFF";
    context.setLineDash([10, 14]);

    context.beginPath();
    context.arc(
        mapWidth / 2 - arcCenterX,
        mapHeight / 2,
        trackRadius,
        Math.PI * (1 / 2),
        (3 / 2) * Math.PI
    );

    context.stroke();

    context.beginPath();
    context.arc(
        mapWidth / 2 + arcCenterX,
        mapHeight / 2,
        trackRadius,
        (3 / 2) * Math.PI,
        Math.PI * (1 / 2)
    );

    context.stroke();

    context.moveTo(mapWidth / 2 - arcCenterX, mapHeight / 2 + trackRadius);
    context.lineTo(mapWidth / 2 + arcCenterX, mapHeight / 2 + trackRadius);
    context.stroke();

    context.moveTo(mapWidth / 2 - arcCenterX, mapHeight / 2 - trackRadius);
    context.lineTo(mapWidth / 2 + arcCenterX, mapHeight / 2 - trackRadius);
    context.stroke();

    return new three.CanvasTexture(canvas);
}

export function getInnerField(mapWidth, mapHeight) {
    const innerField = new three.Shape();

    innerField.absarc(
        -arcCenterX,
        0,
        innerTrackRadius,
        Math.PI * (1 / 2),
        Math.PI * (3 / 2),
        false
    );

    innerField.absarc(
        arcCenterX,
        0,
        innerTrackRadius,
        Math.PI * (3 / 2),
        Math.PI * (1 / 2),
        false
    );

    return innerField;
}

export function getOuterField(mapWidth, mapHeight) {
    const field = new three.Shape();

    field.moveTo(-mapWidth / 2, -mapHeight / 2);
    field.lineTo(-arcCenterX, -mapHeight / 2);

    field.absarc(
        -arcCenterX,
        0,
        outerTrackRadius,
        Math.PI * (3 / 2),
        Math.PI * (1 / 2),
        true
    );

    field.lineTo(arcCenterX, outerTrackRadius);

    field.absarc(
        arcCenterX,
        0,
        outerTrackRadius,
        Math.PI * (1 / 2),
        Math.PI * (3 / 2),
        true
    );

    field.lineTo(-arcCenterX, -outerTrackRadius)

    field.lineTo(-arcCenterX, -mapHeight / 2);
    field.lineTo(mapWidth / 2, -mapHeight / 2);
    field.lineTo(mapWidth / 2, mapHeight / 2);
    field.lineTo(-mapWidth / 2, mapHeight / 2);

    return field;
}

export function getStadium(mapWidth, mapHeight) {

    const field = new three.Shape();

    field.moveTo(-mapWidth / 2, -mapHeight / 2);
    field.lineTo(-arcCenterX, -mapHeight / 2);

    field.absarc(
        -arcCenterX,
        0,
        StadiumRadius,
        Math.PI * (3 / 2),
        Math.PI * (1 / 2),
        true
    );

    field.lineTo(arcCenterX, StadiumRadius);

    field.absarc(
        arcCenterX,
        0,
        StadiumRadius,
        Math.PI * (1 / 2),
        Math.PI * (3 / 2),
        true
    );

    field.lineTo(-arcCenterX, -StadiumRadius)

    field.lineTo(-arcCenterX, -mapHeight / 2);
    field.lineTo(mapWidth / 2, -mapHeight / 2);
    field.lineTo(mapWidth / 2, mapHeight / 2);
    field.lineTo(-mapWidth / 2, mapHeight / 2);

    return field;

}

export function getFinishLine() {
    const finishLine = new three.Shape();

    finishLine.moveTo(40, outerTrackRadius + 20);
    finishLine.lineTo(40, innerTrackRadius);
    finishLine.lineTo(-40, innerTrackRadius);
    // finishLine.moveTo(-8, outerTrackRadius);
    finishLine.lineTo(-40, outerTrackRadius + 20);

    return finishLine;
}
