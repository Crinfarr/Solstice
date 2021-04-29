//set the scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(5, 5, 5);

//predef materials
const bulbgeo = new THREE.SphereGeometry(0.2, 5, 5);

//define light basics
// I still don't know how the fuck this worked
const lights = [
    {
        name: 'vran',
        position: {
            x: -3,
            y: 7,
            z: -2
        },
        obj: new THREE.PointLight(0xffffff, 0, 0.3, 0, 2),
        bulb: new THREE.Mesh(bulbgeo, new THREE.MeshBasicMaterial({ color: 0xffffff }))
    },
    {
        name: 'vrae',
        position: {
            x: 0,
            y: 7,
            z: -5
        },
        obj: new THREE.PointLight(0xffffff, 0.3, 0, 2),
        bulb: new THREE.Mesh(bulbgeo, new THREE.MeshBasicMaterial({ color: 0xffffff }))
    },
    {
        name: 'vras',
        position: {
            x: 3,
            y: 7,
            z: -2
        },
        obj: new THREE.PointLight(0xffffff, 0.3, 0, 2),
        bulb: new THREE.Mesh(bulbgeo, new THREE.MeshBasicMaterial({ color: 0xffffff }))
    },
    {
        name: 'bed',
        position: {
            x: -3,
            y: 7,
            z: 3
        },
        obj: new THREE.PointLight(0xffffff, 0.3, 0, 2),
        bulb: new THREE.Mesh(bulbgeo, new THREE.MeshBasicMaterial({ color: 0xffffff }))
    },
    {
        name: 'desk',
        position: {
            x: 3,
            y: 7,
            z: 3
        },
        obj: new THREE.PointLight(0xffffff, 0.3, 0, 2),
        bulb: new THREE.Mesh(bulbgeo, new THREE.MeshBasicMaterial({ color: 0xffffff }))
    }
];

//orbit function
//set an object at a radius from an object at a specific relative angle
//can be used to do things like multipendulums IN THEORY
//STOLEN FROM MYSELF
function orbit(center, orbiter, distance, height, angle) {
    let cpos = [center.position.x, center.position.y, center.position.z];
    let dx = distance * Math.sin(angle);
    let dy = height;
    let dz = distance * Math.cos(angle);
    orbiter.position.set(cpos[0] + dx, cpos[1] + dy, cpos[2] + dz);
}

//light recolor function
function changeColor(obj, color) {
    obj.bulb.material.color.setHex(color);
    obj.obj.color.setHex(color);
}

//set up renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//set up room
const roomgeo = new THREE.BoxGeometry(10, 7, 12);
var wf = new THREE.EdgesGeometry(roomgeo);
const lines = new THREE.LineSegments(wf);
scene.add(lines);
lines.position.set(0, 3.5, 0);

//add bed
const bedgeo = new THREE.BoxGeometry(3, 2.01, 6);
wf = new THREE.WireframeGeometry(bedgeo);
const bedlines = new THREE.LineSegments(wf);
scene.add(bedlines);
bedlines.position.set(-2, 1, 4.5);
bedlines.rotateY(-Math.PI * 0.5);

//add shelf
const shelfgeo = new THREE.BoxGeometry(6, 6.01, 1);
wf = new THREE.WireframeGeometry(shelfgeo);
const shelflines = new THREE.LineSegments(wf);
scene.add(shelflines);
shelflines.position.set(0, 3, -5.5);

//add other shelf
const shelfgeo2 = new THREE.BoxGeometry(6, 4, 0.75);
wf = new THREE.WireframeGeometry(shelfgeo2);
const shelflines2 = new THREE.LineSegments(wf);
scene.add(shelflines2);
shelflines2.position.set(-2, 2.01, 2.5);

//set up basic lights
const light = new THREE.PointLight(0xffffff, 1, 0, 2);
const helper = new THREE.PointLightHelper(light);
lights.forEach(light => {
    light.obj.position.set(light.position.x, light.position.y, light.position.z);
    light.bulb.position.set(light.position.x, light.position.y, light.position.z);
    scene.add(light.obj);
    scene.add(light.bulb);
    // light.bulb.material.color.setHex(0xff0000);
    // scene.add(new THREE.PointLightHelper(light.obj));
});

//setup floor
const floorgeo = new THREE.PlaneGeometry(10, 12);
const floormat = new THREE.MeshStandardMaterial({ color: 0x5f5f5f, roughness: 0 });
const floor = new THREE.Mesh(floorgeo, floormat);
scene.add(floor);
floor.rotateX(-Math.PI * 0.5);

//animation
let angle = 0.0;
function animate() {
    requestAnimationFrame(animate);
    orbit(lines, camera, 14, 8, angle);
    camera.lookAt(lines.position);
    angle += 0.005;

    /*NO EDITS PAST HERE*/
    renderer.render(scene, camera);
}
animate();