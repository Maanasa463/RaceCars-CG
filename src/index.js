import * as three from "three";
// import { CanvasTexture, TetrahedronGeometry, Vector3 } from "three";

import { arcCenterX, getLineMarkings, innerTrackRadius, outerTrackRadius } from "./rendermap.js";
import { getOuterField } from "./rendermap.js";
import { getInnerField } from "./rendermap.js";
import { trackRadius } from "./rendermap.js";
import { getStadium } from "./rendermap.js";
import { getFinishLine } from "./rendermap.js";
import { other_cars } from "./car.js";
import { Car } from "./car.js";
import { Can } from "./can.js";
// import { gen_cans } from "./can.js";
import { get_can } from "./can.js";

const cans = Can();
// gen_cans(cans);

// const can =

// let curr_time = 0;
let next_time;
let delta_time;

let ready = false;
let score = 0;
let health = 100;
let fuel = 100;
let time = 0;
let mileage = 7;

const scoreElement = document.getElementById("score");
const HealthElement = document.getElementById("health");
const FuelElement = document.getElementById("fuel");
const TimeElement = document.getElementById("time");
const MileageElement = document.getElementById("mileage");

const scene = new three.Scene();
const controlled_car = Car();
scene.add(controlled_car);

const opponent1 = other_cars(0);
scene.add(opponent1);

const opponent2 = other_cars(1);
scene.add(opponent2);

const opponent3 = other_cars(2);
scene.add(opponent3);

let list = [];
list[0] = opponent1;
list[1] = opponent2;
list[2] = opponent3;

const light = new three.AmbientLight(0xffffff, 0.5);
scene.add(light);

const dirLight = new three.DirectionalLight(0xffffff, 0.5);
dirLight.position.set(100, -300, 400);
scene.add(dirLight);


// Creating the scene
function renderMap(mapWidth, mapHeight) {
    const lineMarkingsTexture = getLineMarkings(mapWidth, mapHeight);

    const planeGeometry = new three.PlaneGeometry(mapWidth, mapHeight);
    const planeMaterial = new three.MeshLambertMaterial({
        map: lineMarkingsTexture,
    });

    const plane = new three.Mesh(planeGeometry, planeMaterial);
    scene.add(plane);

    // Creating the track
    const outerField = getOuterField(mapWidth, mapHeight);
    const innerField = getInnerField(mapWidth, mapHeight)

    const fieldGeometry = new three.ExtrudeGeometry(
        [innerField, outerField],
        { depth: 6, bevelEnabled: false }
    );

    const fieldMesh = new three.Mesh(fieldGeometry, [
        new three.MeshLambertMaterial({ color: 0x67c240 }),
        new three.MeshLambertMaterial({ color: 0x23311c }),
    ]);
    scene.add(fieldMesh);

    // Creating the stadium
    const Stadium = getStadium(mapWidth, mapHeight);
    const stadiumGeometry = new three.ExtrudeGeometry(
        [Stadium],
        { depth: 100, bevelEnabled: false }
    );

    const people = new three.TextureLoader().load('assets/crowd3.jpeg');
    people.generateMipmaps = false;
    people.minFilter = three.LinearFilter;
    people.needsUpdate = true;
    people.wrapS = three.RepeatWrapping;
    people.wrapT = three.RepeatWrapping;
    people.repeat.set(0.005, 0.005);
    people.flipY = false;


    const top = new three.TextureLoader().load('assets/stadium_top.png');
    top.generateMipmaps = false;
    top.minFilter = three.LinearFilter;
    top.needsUpdate = true;
    top.wrapS = three.RepeatWrapping;
    top.wrapT = three.RepeatWrapping;
    top.repeat.set(0.5, 0.5);
    top.flipY = false;

    const stadiumMesh = new three.Mesh(
        stadiumGeometry,
        [
            new three.MeshLambertMaterial({ map: top }),
            new three.MeshLambertMaterial({ map: people }),

        ]
    );
    scene.add(stadiumMesh);

    // Making the finish line
    const FinishLine = getFinishLine(mapWidth, mapHeight);
    const FinishLineGeometry = new three.ExtrudeGeometry(
        [FinishLine],
        { depth: 0, bevelEnabled: false }
    );

    const finish = new three.TextureLoader().load('assets/checkerboard.jpg');

    finish.wrapS = three.RepeatWrapping;
    finish.wrapT = three.RepeatWrapping;
    finish.offset.set(0, 0);
    finish.repeat.set(0.02, 0.02);

    const FinishLineMesh = new three.Mesh(
        FinishLineGeometry,
        [
            new three.MeshLambertMaterial({ map: finish }),
        ]
    )

    scene.add(FinishLineMesh);

}

const aspectRatio = window.innerWidth / window.innerHeight;
const cameraWidth = 1200;
const cameraHeight = cameraWidth / aspectRatio;

const camera = new three.OrthographicCamera(
    cameraWidth / -2,
    cameraWidth / 2,
    cameraHeight / 2,
    cameraHeight / -2,
    0,
    1000
);

camera.position.set(0, -300, 400)
camera.lookAt(0, 0, 0);

renderMap(cameraWidth, cameraHeight * 2);

const playerX = -100;
const playerY = trackRadius + 15;

controlled_car.position.x = playerX;
controlled_car.position.y = playerY;
controlled_car.rotation.z = 0;

opponent1.position.x = -100;
opponent2.position.x = -100;
opponent3.position.x = -100;

opponent1.position.y = trackRadius + 50;
opponent2.position.y = trackRadius - 20;
opponent3.position.y = trackRadius - 55;

// setting up the third perspective camera
const camera2 = new three.PerspectiveCamera(45, aspectRatio, 0.1, 10000);
camera2.position.set(controlled_car.position.x - 150, controlled_car.position.y, controlled_car.position.z + 150);

camera2.lookAt(controlled_car.position.x, controlled_car.position.y, controlled_car.position.z)
camera2.up.set(0, 0, 1);
camera2.rotation.z = -Math.PI / 2;

camera2.updateProjectionMatrix();

let acc = false;
let dec = false;
let up = false;
let down = false;


window.addEventListener('keydown', event => {
    if (event.key === 'ArrowUp') {
        acc = true;
        return;
    }

    if (event.key === 'ArrowDown') {
        dec = true;
        return;
    }

    if (event.key == 'ArrowRight') {
        down = true;
        return;

    }

    if (event.key == 'ArrowLeft') {
        up = true;
        return;

    }

    if ((event.key == 's') && ready == false) {
        const start = document.getElementById("start");
        start.remove();

        const in_up = document.getElementById("instructions_up");
        in_up.remove();

        const in_down = document.getElementById("instructions_down");
        in_down.remove();

        const in_left = document.getElementById("instructions_left");
        in_left.remove();

        const in_right = document.getElementById("instructions_right");
        in_right.remove();

        renderer.setAnimationLoop(animate);
        ready = true;

        return;
    }
});

window.addEventListener('keyup', event => {
    if (event.key === 'ArrowUp') {

        acc = false;
        return;

    }

    if (event.key === 'ArrowDown') {
        dec = false;
        return;
    }

    if (event.key == 'ArrowRight') {
        down = false;
        return;

    }

    if (event.key == 'ArrowLeft') {
        up = false;
        return;

    }

});


const renderer = new three.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const renderer2 = new three.WebGLRenderer({ antialias: true });
renderer2.setSize(300, 300 / aspectRatio);
renderer2.domElement.style.position = 'absolute';
renderer2.domElement.style.top = 0;
renderer2.domElement.style.zIndex = '1';
document.body.appendChild(renderer2.domElement);

let speed = 0.005;

function control() {

    const player_speed = getSpeed();

    if (down) {
        controlled_car.rotation.z -= player_speed * 0.005;
    }

    if (up) {
        controlled_car.rotation.z += player_speed * 0.005;
    }

    // console.log("bla" + (arcCenterX + outerTrackRadius));

    if (controlled_car.position.x >= -(arcCenterX + 20) && controlled_car.position.x <= (arcCenterX + 20)) {
        console.log("1");
        controlled_car.position.x += (Math.cos(controlled_car.rotation.z) * player_speed);

        if (controlled_car.position.y <= outerTrackRadius && controlled_car.position.y >= innerTrackRadius)
            controlled_car.position.y += (Math.sin(controlled_car.rotation.z) * player_speed);

        else if (controlled_car.position.y >= -outerTrackRadius && controlled_car.position.y <= -innerTrackRadius)
            controlled_car.position.y += (Math.sin(controlled_car.rotation.z) * player_speed);

        else
            controlled_car.position.y = controlled_car.position.y;

    }

    else if (Math.abs(controlled_car.position.x) >= arcCenterX && Math.abs(controlled_car.position.x) <= (arcCenterX + outerTrackRadius)) {
        console.log("hello");


        if (Math.pow(Math.abs(controlled_car.position.x) - arcCenterX, 2) + Math.pow(Math.abs(controlled_car.position.y), 2) >= Math.pow(innerTrackRadius, 2)
            && Math.pow(Math.abs(controlled_car.position.x) - arcCenterX, 2) + Math.pow(Math.abs(controlled_car.position.y), 2) <= Math.pow(outerTrackRadius, 2)) {
            controlled_car.position.x += (Math.cos(controlled_car.rotation.z) * player_speed);
            controlled_car.position.y += (Math.sin(controlled_car.rotation.z) * player_speed);
        }
        else {
            controlled_car.position.x = controlled_car.position.x;
            controlled_car.position.y = controlled_car.position.y;
        }
    }

    // controlled_car.position.y += (Math.sin(controlled_car.rotation.z) * player_speed);

    camera2.position.set(controlled_car.position.x + (-200 * Math.cos(controlled_car.rotation.z)), controlled_car.position.y + (-200 * Math.sin(controlled_car.rotation.z)), controlled_car.position.z + 150);

    camera2.lookAt(controlled_car.position.x, controlled_car.position.y, controlled_car.position.z);
    camera2.rotation.z = (-Math.PI / 2) + controlled_car.rotation.z;

    camera2.updateProjectionMatrix();
}


function getSpeed() {
    if (acc) {
        if (speed <= 4)
            speed *= 1.35;
        else
            speed = speed;
    }
    if (dec) {
        if (speed >= 0.005)
            speed *= 0.9;
        else
            speed = speed;
    }
    else {
        if (speed > 0)
            speed *= 0.99;
        else
            speed = speed;
    }
    return speed;
}


let gen_time = 0;
let index = 0;
scene.add(cans);

function spawn_cans() {

    if (gen_time % 500 == 0) {
        get_can(cans);
    }

    if (gen_time % 20 == 0)
        fuel--;

    gen_time++;
    time++;
}

function car_fuel() {
    // console.log("---");
    // console.log( cans.position);
    // console.log( controlled_car.position);


    let car_bounds = new three.Box3().setFromObject(controlled_car);
    // console.log(car_bounds);
    // for (let i = 0; i < 10000; i++)
    // {   (controlled_car.position.x -8) < cans[index].position.x<(controlled_car.position.x +8)
    if (car_bounds.containsPoint(cans.position)) {
        console.log("check");
        fuel += 15;
        get_can(cans);
        // index++;
    }
    // }
}

let opponent1_speed = 2.0;

function opponent1_move() {

    console.log(opponent1.position.x);

    if (opponent1.position.x > arcCenterX)
        opponent1.rotation.z -= 0.004 * opponent1_speed;
    else if (opponent1.position.x < -arcCenterX)
        opponent1.rotation.z -= 0.004 * opponent1_speed;

    if (opponent1.position.x >= -(arcCenterX + 20) && opponent1.position.x <= (arcCenterX + 20)) {
        console.log("1");
        opponent1.position.x += (Math.cos(opponent1.rotation.z) * opponent1_speed);

        if (opponent1.position.y <= outerTrackRadius && opponent1.position.y >= innerTrackRadius)
            opponent1.position.y += (Math.sin(opponent1.rotation.z) * opponent1_speed);

        else if (opponent1.position.y >= -outerTrackRadius && opponent1.position.y <= -innerTrackRadius)
            opponent1.position.y += (Math.sin(opponent1.rotation.z) * opponent1_speed);

        else
            opponent1.position.y = opponent1.position.y;

    }

    else if (Math.abs(opponent1.position.x) >= arcCenterX && Math.abs(opponent1.position.x) <= (arcCenterX + outerTrackRadius)) {
        console.log("hello");

        if (Math.pow(Math.abs(opponent1.position.x) - arcCenterX, 2) + Math.pow(Math.abs(opponent1.position.y), 2) >= Math.pow(innerTrackRadius, 2)
            && Math.pow(Math.abs(opponent1.position.x) - arcCenterX, 2) + Math.pow(Math.abs(opponent1.position.y), 2) <= Math.pow(outerTrackRadius, 2)) {
            opponent1.position.x += (Math.cos(opponent1.rotation.z) * opponent1_speed);
            opponent1.position.y += (Math.sin(opponent1.rotation.z) * opponent1_speed);
        }
        else {
            opponent1.position.x = opponent1.position.x;
            opponent1.position.y = opponent1.position.y;
        }
    }
}


let opponent2_speed = 3.0;

function opponent2_move() {

    console.log(opponent2.position.x);

    if (opponent2.position.x > arcCenterX)
        opponent2.rotation.z -= 0.004 * opponent2_speed;
    else if (opponent2.position.x < -arcCenterX)
        opponent2.rotation.z -= 0.004 * opponent2_speed;

    if (opponent2.position.x >= -(arcCenterX + 20) && opponent2.position.x <= (arcCenterX + 20)) {
        console.log("1");
        opponent2.position.x += (Math.cos(opponent2.rotation.z) * opponent2_speed);

        if (opponent2.position.y <= outerTrackRadius && opponent2.position.y >= innerTrackRadius)
            opponent2.position.y += (Math.sin(opponent2.rotation.z) * opponent2_speed);

        else if (opponent2.position.y >= -outerTrackRadius && opponent2.position.y <= -innerTrackRadius)
            opponent2.position.y += (Math.sin(opponent2.rotation.z) * opponent2_speed);

        else
            opponent2.position.y = opponent2.position.y;

    }

    else if (Math.abs(opponent2.position.x) >= arcCenterX && Math.abs(opponent2.position.x) <= (arcCenterX + outerTrackRadius)) {
        console.log("hello");

        if (Math.pow(Math.abs(opponent2.position.x) - arcCenterX, 2) + Math.pow(Math.abs(opponent2.position.y), 2) >= Math.pow(innerTrackRadius, 2)
            && Math.pow(Math.abs(opponent2.position.x) - arcCenterX, 2) + Math.pow(Math.abs(opponent2.position.y), 2) <= Math.pow(outerTrackRadius, 2)) {
            opponent2.position.x += (Math.cos(opponent2.rotation.z) * opponent2_speed);
            opponent2.position.y += (Math.sin(opponent2.rotation.z) * opponent2_speed);
        }
        else {
            opponent2.position.x = opponent2.position.x;
            opponent2.position.y = opponent2.position.y;
        }
    }
}


let opponent3_speed = 3.5;

function opponent3_move() {

    console.log(opponent3.position.x);

    if (opponent3.position.x > arcCenterX)
        opponent3.rotation.z -= 0.005 * opponent3_speed;
    else if (opponent3.position.x < -arcCenterX)
        opponent3.rotation.z -= 0.005 * opponent3_speed;

    if (opponent3.position.x >= -(arcCenterX + 20) && opponent3.position.x <= (arcCenterX + 20)) {
        console.log("1");
        opponent3.rotation.z -= (Math.random() * 0.07 - 0.035);
        opponent3.position.x += (Math.cos(opponent3.rotation.z) * opponent3_speed);

        if (opponent3.position.y <= outerTrackRadius && opponent3.position.y >= innerTrackRadius)
            opponent3.position.y += (Math.sin(opponent3.rotation.z) * opponent3_speed);

        else if (opponent3.position.y >= -outerTrackRadius && opponent3.position.y <= -innerTrackRadius)
            opponent3.position.y += (Math.sin(opponent3.rotation.z) * opponent3_speed);

        else
            opponent3.position.y = opponent3.position.y;

    }

    else if (Math.abs(opponent3.position.x) >= arcCenterX && Math.abs(opponent3.position.x) <= (arcCenterX + outerTrackRadius)) {
        console.log("hello");

        if (Math.pow(Math.abs(opponent3.position.x) - arcCenterX, 2) + Math.pow(Math.abs(opponent3.position.y), 2) >= Math.pow(innerTrackRadius, 2)
            && Math.pow(Math.abs(opponent3.position.x) - arcCenterX, 2) + Math.pow(Math.abs(opponent3.position.y), 2) <= Math.pow(outerTrackRadius, 2)) {
            opponent3.position.x += (Math.cos(opponent3.rotation.z) * opponent3_speed);
            opponent3.position.y += (Math.sin(opponent3.rotation.z) * opponent3_speed);
        }
        else {
            opponent3.position.x = opponent3.position.x;
            opponent3.position.y = opponent3.position.y;
        }
    }
}



function hit_collision() {

    let car_bounds = new three.Box3().setFromObject(controlled_car);

    for (let i = 0; i < 3; i++) {
        let opp_bound = new three.Box3().setFromObject(list[i]);
           if (car_bounds.intersectsBox(opp_bound)) {
            console.log("check");
            health -= 5;
            // index++;
        }
    }
    // }

}

function animate(timestamp) {
    control();
    spawn_cans();
    car_fuel();
    opponent1_move();
    opponent2_move();
    opponent3_move();
    hit_collision();
    scoreElement.innerText = "Score: " + score;
    HealthElement.innerText = "Health: " + health;
    FuelElement.innerText = "Fuel: " + fuel;
    TimeElement.innerText = "Time: " + time + "s";
    MileageElement.innerText = "Mileage: " + mileage + "km";

    renderer.render(scene, camera2);
    renderer2.render(scene, camera);
}

function start_screen() {
    scoreElement.innerText = "Score: " + score;
    HealthElement.innerText = "Health: " + health;
    FuelElement.innerText = "Fuel: " + fuel;
    TimeElement.innerText = "Time: " + time + "s";
    MileageElement.innerText = "Mileage: " + mileage + "km";
    renderer.render(scene, camera2);
    renderer2.render(scene, camera);
}

function start() {
    if (ready)
        animate();
    else
        start_screen();
}

start();
