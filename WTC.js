// Import three.js
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene(); // Scene
const WTC_Complex = new THREE.Group();
const TwinTowers = new THREE.Group();

function main(){
    // Make our canvas
    scene.background = new THREE.Color(0xff0000);
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({antialias: true, canvas});
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Set up Camera
    // Frustrum settings
    const fov = 100; // Field of View
    const aspect = window.innerWidth / window.innerHeight; // Ratio of view's height and width
    const near = 0.1; // Minimum fov value closest to the camera
    const far = 50; // Maximum fov value farthest from the camera
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    const controls = new OrbitControls(camera, renderer.domElement);

    // camera.position.set(0, 10, -2);
    // camera.rotation.set(-1.5, 0, 0);

    //camera.position.set(-1.5, -6, 2);

    camera.position.set(0, 0, 10);

    // Apply lighting
    const color = 0xFFFFFF;
    const intensity = 3;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);

    // Build World Trade Center Complex + Sphere
    Build_Towers();
    Build_Marriott();
    Build_WTC7();
    Build_WTC4();
    Build_WTC5();

    scene.add(WTC_Complex);

    renderer.render(scene, camera);

    function render(time){
        time *= 0.001; // Time is in SECONDS
            const speed = 1;
            const rot = time * speed;
            //WTC_Complex.rotation.y = rot;
            //console.log("Camera X: " + camera.position.x + "\nCamera Y: " + camera.position.y + "\nCamera Z: " + camera.position.z);
            console.log("Camera Rotation X: " + camera.rotation.x + "\nCamera Rotation Y: " + camera.rotation.y + "\nCamera Rotation Z: " + camera.rotation.z);

        renderer.render(scene, camera);

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}

function Build_Towers(){
    const WTC1 = new THREE.Group();
    const WTC2 = new THREE.Group();
    const tower_height = 13.62;
    const tower_width = 2.09;
    const tower_depth = 2.09;

    // WTC1/2 Body
    const tower_geo = new THREE.BoxGeometry(tower_width, tower_height, tower_depth); // Geometry
    const tower_mat = new THREE.MeshPhongMaterial({color: 0x00ffff}); // Material
    const tower1_mesh = makeShape(tower_geo, tower_mat, 0, 0, 0); // Make a cube mesh
    const tower2_mesh = makeShape(tower_geo, tower_mat, 3.25, 0, -2.25); // Make a cube mesh

    // WTC1 Antenna
    const antenna_height = 3.60;
    const antenna_radius = 0.1;
    const antenna_geo = new THREE.CylinderGeometry(antenna_radius, antenna_radius, antenna_height, 32);
    const antenna_mat = new THREE.MeshPhongMaterial({color: 0xffffff});
    const antenna_mesh = makeShape(antenna_geo, antenna_mat, 0, (tower_height / 2) + (antenna_height / 2), 0);

    WTC1.add(tower1_mesh);
    WTC1.add(antenna_mesh);

    WTC2.add(tower2_mesh);

    TwinTowers.add(WTC1); // Scene is the parent of the cube mesh
    TwinTowers.add(WTC2); // Scene is the parent of the cube mesh

    WTC_Complex.add(TwinTowers);
}

function Build_Marriott(){
    var height = 2.42; // Approximate Height of Triangular Roof is the remainder of the Parthenon's height minus the height of the columns and the roof base
    const hotel_geo = new THREE.BufferGeometry();

    // width = x, height = y, length = z
    const vertices = new Float32Array([
        // Floor Level
        1.25, 0, 0, // v0
        2.5, 0, 0, // v1
        4.6, 0, -0.75, // v2
        4.6, 0, -0.15, // v3
        2.5, 0, 0.55, // v4
        1.25, 0, 0.55, // v5

        // Roof Level
        1.25, height, 0, // v6
        2.5, height, 0, // v7
        4.6, height, -0.75, // v8
        4.6, height, -0.15, // v9
        2.5, height, 0.55, // v10
        1.25, height, 0.55, // v11
    ]);

    // Connects all of the vertices together
    const indices = [
        // floor
        0, 1, 4,
        4, 1, 2,
        2, 3, 4,
        4, 5, 0,

        // north wall
        0, 5, 6,
        5, 11, 6,

        // west wall
        0, 6, 1,
        1, 6, 7,
        1, 7, 2,
        2, 7, 8,

        // south wall
        2, 8, 3,
        8, 9, 3,

        // east wall
        3, 9, 4,
        9, 10, 4,
        11, 5, 4,
        4, 10, 11,

        // roof
        6, 7, 10,
        10, 7, 8,
        8, 9, 10,
        10, 11, 6
    ];
    
    hotel_geo.setIndex( indices );
    // itemSize = 3 because there are 3 values (components) per vertex
    hotel_geo.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
    hotel_geo.setAttribute( 'normal', new THREE.BufferAttribute( vertices, 3 ) );
    const hotel_mat = new THREE.MeshPhongMaterial({color: 0xffffff, side: THREE.DoubleSide});
    const WTC3 = makeShape(hotel_geo, hotel_mat, 0, -6.81, 0);

    WTC_Complex.add(WTC3);
}

function Build_WTC7(){
    var height = 6.10;
    const WTC7_geo = new THREE.BufferGeometry();

    // width = x, height = y, length = z
    const vertices = new Float32Array([
        // Floor Level
        -4.7, 0, 0.25, // v0
        -6.15, 0, 0.75, // v1
        -6.15, 0, -2.5, // v2
        -4.7, 0, -2.15, // v3

        // Roof Level
        -4.7, height, 0.25, // v4
        -6.15, height, 0.75, // v5
        -6.15, height, -2.5, // v6
        -4.7, height, -2.15, // v7
    ]);

    // Connects all of the vertices together
    const indices = [
        // floor
        0, 3, 1,
        1, 2, 3,

        // south wall
        4, 7, 3,
        3, 0, 4,

        // east wall
        0, 4, 5,
        1, 0, 5,

        // north wall
        1, 5, 6,
        2, 1, 6,

        // west wall
        6, 2, 3,
        3, 7, 6,

        // roof
        4, 7, 5,
        5, 7, 6,
    ];
    
    WTC7_geo.setIndex( indices );
    // itemSize = 3 because there are 3 values (components) per vertex
    WTC7_geo.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
    WTC7_geo.setAttribute( 'normal', new THREE.BufferAttribute( vertices, 3 ) );
    const WTC7_mat = new THREE.MeshPhongMaterial({color: 0x3127f5, side: THREE.DoubleSide});
    const WTC7 = makeShape(WTC7_geo, WTC7_mat, 0, -6.81, 0);

    WTC_Complex.add(WTC7);
}

function Build_WTC4(){
    var base_height = 0.26;
    var upper_height = 0.78;
    var diff = 0.2;

    const WTC4 = new THREE.Group();

    const WTC4_Base_Geo = new THREE.BufferGeometry();
    const WTC4_Upper_Geo = new THREE.BufferGeometry();

    // width = x, height = y, length = z
    const Upper_Vertices = new Float32Array([
        // Middle Level
        4.50, base_height, -3.55, // v0
        2.75, base_height, -3.55, // v1
        2.75, base_height, -4.75, // v2
        1.15, base_height, -4.75, // v3
        1.15, base_height, -6.15, // v4
        2.75, base_height, -6.15, // v5
        2.75, base_height, -6.90, // v6
        4.10, base_height, -6.90, // v7
        4.10, base_height, -5.40, // v8
        4.50, base_height, -5.40, // v9

        // Roof Level
        4.50, upper_height, -3.55, // v10
        2.75, upper_height, -3.55, // v11
        2.75, upper_height, -4.75, // v12
        1.15, upper_height, -4.75, // v13
        1.15, upper_height, -6.15, // v14
        2.75, upper_height, -6.15, // v15
        2.75, upper_height, -6.90, // v16
        4.10, upper_height, -6.90, // v17
        4.10, upper_height, -5.40, // v18
        4.50, upper_height, -5.40, // v19
    ]);

    const Base_Vertices = new Float32Array([
        // Base Level
        4.50 - diff, 0, -3.55 - diff, // v0
        2.75 + diff, 0, -3.55 - diff, // v1
        2.75 + diff, 0, -4.75 - diff, // v2
        1.15 + diff, 0, -4.75 - diff, // v3
        1.15 + diff, 0, -6.15 + diff, // v4
        2.75 + diff, 0, -6.15 + diff, // v5
        2.75 + diff, 0, -6.90 + diff, // v6
        4.10 - diff, 0, -6.90 + diff, // v7
        4.10 - diff, 0, -5.40 + diff, // v8
        4.50 - diff, 0, -5.40 + diff, // v9

        // Middle Level
        4.50 - diff, base_height, -3.55 - diff, // v10
        2.75 + diff, base_height, -3.55 - diff, // v11
        2.75 + diff, base_height, -4.75 - diff, // v12
        1.15 + diff, base_height, -4.75 - diff, // v13
        1.15 + diff, base_height, -6.15 + diff, // v14
        2.75 + diff, base_height, -6.15 + diff, // v15
        2.75 + diff, base_height, -6.90 + diff, // v16
        4.10 - diff, base_height, -6.90 + diff, // v17
        4.10 - diff, base_height, -5.40 + diff, // v18
        4.50 - diff, base_height, -5.40 + diff, // v19
    ]);

    // Connects all of the vertices together
    const Indices = [
        // floor
        0, 1, 8,
        1, 2, 8,
        2, 3, 5,
        3, 4, 5,
        5, 6, 7,
        7, 8, 5,
        2, 5, 8,
        8, 9, 0,

        // walls
        0, 1, 10,
        1, 11, 10,
        1, 2, 11,
        2, 12, 11,
        2, 13, 12,
        3, 13, 2,
        3, 4, 13,
        14, 13, 4,
        4, 14, 15,
        15, 5, 4,
        5, 15, 16,
        16, 6, 5,
        6, 16, 17,
        17, 7, 6,
        7, 17, 18,
        18, 8, 7,
        8, 18, 19,
        19, 9, 8,
        9, 19, 10,
        10, 0, 9,

        // roof
        10, 11, 18,
        11, 12, 18,
        12, 13, 15,
        13, 14, 15,
        15, 16, 17,
        17, 18, 15,
        12, 15, 18,
        18, 19, 10,
    ];
    
    WTC4_Upper_Geo.setIndex( Indices );
    WTC4_Upper_Geo.setAttribute( 'position', new THREE.BufferAttribute( Upper_Vertices, 3 ) );
    WTC4_Upper_Geo.setAttribute( 'normal', new THREE.BufferAttribute( Upper_Vertices, 3 ) );
    const WTC4_Upper_Mat = new THREE.MeshPhongMaterial({color: 0x3127f5, side: THREE.DoubleSide});
    const WTC4_Upper_Mesh = makeShape(WTC4_Upper_Geo, WTC4_Upper_Mat, 0, -6.81, 0);
    WTC4.add(WTC4_Upper_Mesh);

    WTC4_Base_Geo.setIndex( Indices );
    WTC4_Base_Geo.setAttribute( 'position', new THREE.BufferAttribute( Base_Vertices, 3 ) );
    WTC4_Base_Geo.setAttribute( 'normal', new THREE.BufferAttribute( Base_Vertices, 3 ) );
    const WTC4_Base_Mat = new THREE.MeshPhongMaterial({color: 0x3127f5, side: THREE.DoubleSide});
    const WTC4_Base_Mesh = makeShape(WTC4_Base_Geo, WTC4_Base_Mat, 0, -6.81, 0);
    WTC4.add(WTC4_Base_Mesh);

    WTC_Complex.add(WTC4);
}

function Build_WTC5(){
    var base_height = 0.26;
    var upper_height = 0.78;
    var diff = 0.2;

    const WTC5 = new THREE.Group();

    const WTC5_Base_Geo = new THREE.BufferGeometry();
    const WTC5_Upper_Geo = new THREE.BufferGeometry();

    // width = x, height = y, length = z
    const Upper_Vertices = new Float32Array([
        // Middle Level
        -1.40, base_height, -2.25, // v0
        -3.40, base_height, -2.25, // v1
        -3.40, base_height, -4.40, // v2
        -3.10, base_height, -4.40, // v3
        -3.10, base_height, -6.50, // v4
        -1.65, base_height, -6.50, // v5
        -1.65, base_height, -6.25, // v6
        -0.15, base_height, -6.25, // v7
        -0.15, base_height, -4.75, // v8
        -1.65, base_height, -4.75, // v9
        -1.65, base_height, -4.10, // v10
        -1.40, base_height, -4.10, // v11

        // Roof
        -1.40, upper_height, -2.25, // v12
        -3.40, upper_height, -2.25, // v13
        -3.40, upper_height, -4.40, // v14
        -3.10, upper_height, -4.40, // v15
        -3.10, upper_height, -6.50, // v16
        -1.65, upper_height, -6.50, // v17
        -1.65, upper_height, -6.25, // v18
        -0.15, upper_height, -6.25, // v19
        -0.15, upper_height, -4.75, // v20
        -1.65, upper_height, -4.75, // v21
        -1.65, upper_height, -4.10, // v22
        -1.40, upper_height, -4.10, // v23
    ]);

    
    const Base_Vertices = new Float32Array([
        // Base Level
        -1.40 - diff, 0, -2.25 - diff, // v0
        -3.40 + diff, 0, -2.25 - diff, // v1
        -3.40 + diff, 0, -4.40 + diff, // v2
        -3.10 + diff, 0, -4.40 + diff, // v3
        -3.10 + diff, 0, -6.50 + diff, // v4
        -1.65 - diff, 0, -6.50 + diff, // v5
        -1.65 - diff, 0, -6.25 + diff, // v6
        -0.15 - diff, 0, -6.25 + diff, // v7
        -0.15 - diff, 0, -4.75 - diff, // v8
        -1.65 - diff, 0, -4.75 - diff, // v9
        -1.65 - diff, 0, -4.10 + diff, // v10
        -1.40 - diff, 0, -4.10 + diff, // v11

        // Roof
        -1.40 - diff, base_height, -2.25 - diff, // v0
        -3.40 + diff, base_height, -2.25 - diff, // v1
        -3.40 + diff, base_height, -4.40 + diff, // v2
        -3.10 + diff, base_height, -4.40 + diff, // v3
        -3.10 + diff, base_height, -6.50 + diff, // v4
        -1.65 - diff, base_height, -6.50 + diff, // v5
        -1.65 - diff, base_height, -6.25 + diff, // v6
        -0.15 - diff, base_height, -6.25 + diff, // v7
        -0.15 - diff, base_height, -4.75 - diff, // v8
        -1.65 - diff, base_height, -4.75 - diff, // v9
        -1.65 - diff, base_height, -4.10 + diff, // v10
        -1.40 - diff, base_height, -4.10 + diff, // v11
    ]);

    // Connects all of the vertices together
    const Indices = [
        // floor
        0, 1, 10,
        1, 2, 3,
        1, 3, 10,
        3, 4, 6,
        4, 5, 6,
        6, 9, 3,
        6, 7, 8,
        8, 9, 6,
        9, 10, 3,
        10, 11, 0,

        // walls
        0, 1, 12,
        1, 13, 12,
        1, 2, 13,
        2, 14, 13,
        15, 3, 2,
        14, 15, 2,
        3, 4, 16,
        16, 15, 3,
        17, 5, 4,
        4, 16, 17,
        5, 17, 18,
        18, 6, 5,
        6, 18, 19,
        19, 7, 6,
        7, 19, 20,
        20, 8, 7,
        8, 9, 21,
        21, 20, 8,
        22, 10, 9,
        9, 21, 22,
        10, 22, 23,
        23, 11, 10,
        23, 12, 11,
        0, 11, 12,

        // roof
        12, 13, 22,
        13, 14, 15,
        15, 22, 13,
        15, 16, 18,
        16, 17, 18,
        18, 21, 15,
        18, 19, 20,
        20, 21, 18,
        21, 22, 15,
        22, 23, 12,
    ];
    
    WTC5_Upper_Geo.setIndex( Indices );
    WTC5_Upper_Geo.setAttribute( 'position', new THREE.BufferAttribute( Upper_Vertices, 3 ) );
    WTC5_Upper_Geo.setAttribute( 'normal', new THREE.BufferAttribute( Upper_Vertices, 3 ) );
    const WTC5_Upper_Mat = new THREE.MeshPhongMaterial({color: 0x3127f5, side: THREE.DoubleSide});
    const WTC5_Upper_Mesh = makeShape(WTC5_Upper_Geo, WTC5_Upper_Mat, 0, -6.81, 0);
    WTC5.add(WTC5_Upper_Mesh);

    WTC5_Base_Geo.setIndex( Indices );
    WTC5_Base_Geo.setAttribute( 'position', new THREE.BufferAttribute( Base_Vertices, 3 ) );
    WTC5_Base_Geo.setAttribute( 'normal', new THREE.BufferAttribute( Base_Vertices, 3 ) );
    const WTC5_Base_Mat = new THREE.MeshPhongMaterial({color: 0x3127f5, side: THREE.DoubleSide});
    const WTC5_Base_Mesh = makeShape(WTC5_Base_Geo, WTC5_Base_Mat, 0, -6.81, 0);
    WTC5.add(WTC5_Base_Mesh);

    WTC_Complex.add(WTC5);
}

function makeShape(geo, mat, x, y, z){
        //const mat = new THREE.MeshPhongMaterial({ /*color,*/ map: texture1, normalMap: texture2, side: THREE.DoubleSide });
        // PROBLEM: Phong Material on Triangular Prism is always black b.c. it isn't reflecting any light
        // Until the problem is solved, all mats are basic, not phong.
        const shape = new THREE.Mesh(geo, mat);
        shape.position.x = x;
        shape.position.y = y;
        shape.position.z = z;
    
        return shape; // Mesh is only returned, as add() is used to parent objects not only to the scene, but also eachother
    }

main();