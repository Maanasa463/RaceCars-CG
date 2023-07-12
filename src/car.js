import * as three from "three";

const colours = [0x33FF9F, 0x3383FF, 0xAC33FF]

function getCarFrontTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 32;
    const context = canvas.getContext("2d");

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, 64, 32);

    context.fillStyle = "#666666";
    context.fillRect(8, 8, 48, 24);
    // context.fillRect(58, 8, 60, 24);

    return new three.CanvasTexture(canvas);
}

function getCarSideTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 32;
    const context = canvas.getContext("2d");

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, 128, 32);

    context.fillStyle = "#666666";
    context.fillRect(10, 8, 38, 24);
    context.fillRect(58, 8, 60, 24);

    return new three.CanvasTexture(canvas);
}

export function Car() {
    const car = new three.Group();

    const backWheel = Wheel();
    // backWheel.position.z = 6;
    backWheel.position.x = -10;
    // backWheel.position.y = 30;
    car.add(backWheel);

    const frontWheel = Wheel();
    frontWheel.position.x = 10;

    car.add(frontWheel);

    const main = new three.Mesh(
        new three.BoxGeometry(30,15,7.5),
        new three.MeshLambertMaterial({ color: 0xa52523 })
    );
    main.position.z = 12;
    main.position.x = 0;
    car.add(main);

    const CarFrontTexture = getCarFrontTexture();
    CarFrontTexture.center = new three.Vector2(0.5, 0.5);
    CarFrontTexture.rotation = Math.PI / 2;
    
    const CarBackTexture = getCarFrontTexture();
    CarBackTexture.center = new three.Vector2(0.5, 0.5);
    CarBackTexture.rotation = -Math.PI / 2;
    
    const CarLeftTexture = getCarSideTexture();
    // CarLeftTexture.flipY = false;
    
    const CarRightTexture = getCarSideTexture();

    const cabin = new three.Mesh(
        new three.BoxGeometry(16.5,12,6),
        [
            new three.MeshLambertMaterial({map : CarFrontTexture}),
            new three.MeshLambertMaterial({map : CarBackTexture}),
            new three.MeshLambertMaterial({map : CarLeftTexture}),
            new three.MeshLambertMaterial({map : CarRightTexture}),

            new three.MeshLambertMaterial({ color: 0xffffff }),
            new three.MeshLambertMaterial({ color: 0xffffff })
        ]
    );

    cabin.position.z = 25.5;
    cabin.position.x = -5;
    car.add(cabin);
    
    console.log(car.position);
    
    return car;
}

function Wheel() {
    const wheel = new three.Mesh(
        new three.BoxGeometry(12,33,12),
        new three.MeshLambertMaterial({ color: 0x333333 })
    );

    wheel.position.z = 6;
    return wheel;
}

export function other_cars(index) {

    const car = new three.Group();

    const backWheel = Wheel();
    // backWheel.position.z = 6;
    backWheel.position.x = -10;
    // backWheel.position.y = 30;
    car.add(backWheel);

    const frontWheel = Wheel();
    frontWheel.position.x = 10;
    car.add(frontWheel);

    const main = new three.Mesh(
        new three.BoxGeometry(30,15,7.5),
        new three.MeshLambertMaterial({ color: colours[index] })
    );
    main.position.z = 12;
    main.position.x = 0;
    car.add(main);

    const CarFrontTexture = getCarFrontTexture();
    CarFrontTexture.center = new three.Vector2(0.5, 0.5);
    CarFrontTexture.rotation = Math.PI / 2;
    
    const CarBackTexture = getCarFrontTexture();
    CarBackTexture.center = new three.Vector2(0.5, 0.5);
    CarBackTexture.rotation = -Math.PI / 2;
    
    const CarLeftTexture = getCarSideTexture();
    // CarLeftTexture.flipY = false;
    
    const CarRightTexture = getCarSideTexture();

    const cabin = new three.Mesh(
        new three.BoxGeometry(16.5,12,6),
        [
            new three.MeshLambertMaterial({map : CarFrontTexture}),
            new three.MeshLambertMaterial({map : CarBackTexture}),
            new three.MeshLambertMaterial({map : CarLeftTexture}),
            new three.MeshLambertMaterial({map : CarRightTexture}),

            new three.MeshLambertMaterial({ color: 0xffffff }),
            new three.MeshLambertMaterial({ color: 0xffffff })
        ]
    );

    cabin.position.z = 25.5;
    cabin.position.x = -5;
    car.add(cabin);
    
    console.log(car.position);
    
    return car;

}


