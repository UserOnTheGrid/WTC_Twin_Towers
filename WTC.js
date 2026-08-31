// Import three.js
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene(); // Scene
const WTC_Complex = new THREE.Group();
const Brookfield_Place = new THREE.Group();
const TwinTowers = new THREE.Group();

function main(){
    // Make our canvas
    scene.background = new THREE.Color(0xff0000);
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({antialias: true, canvas});
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Set up Camera
    // Frustrum settings
    const fov = 60; // Field of View
    const aspect = window.innerWidth / window.innerHeight; // Ratio of view's height and width
    const near = 0.1; // Minimum fov value closest to the camera
    const far = 40; // Maximum fov value farthest from the camera
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    const controls = new OrbitControls(camera, renderer.domElement);

    // camera.position.set(0, 10, -2);
    // camera.rotation.set(-1.5, 0, 0);

    //camera.position.set(-1.5, -6, 2);

    camera.position.set(0, 0, 10);

    // Apply lighting
    const color = 0xFFFFFF;
    const intensity = 2;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);

    // Build World Trade Center Complex + Sphere
    Build_Towers();
    Build_Marriott();
    Build_WTC7();
    Build_WTC4();
    Build_WTC5();
    Build_WTC6();

    const sphere_rad = 0.17 / 2;
    const sphere_geo = new THREE.SphereGeometry(sphere_rad, 16, 12)
    const sphere_mat = new THREE.MeshPhongMaterial({color: 0x696611}, {emissive: 0x8a6500}, {specular: 0xcbd265}, {shininess: 13.3});

    const WTC_Sphere_Mesh = makeShape(sphere_geo, sphere_mat, 0.5, -6.81 + sphere_rad, -2.9);
    scene.add(WTC_Sphere_Mesh);

    scene.add(WTC_Complex);

    // Build Brookfield Place (World Financial Center)
    Build_Winter_Garden();
    Build_BP1();
    Build_BP2();
    scene.add(Brookfield_Place);

    // Build Adjacent Towers around WTC
    Build_Millennium_NYC();
    Build_One_Liberty_Plaza();
    Build_Gateway_Tower();

    //Build_Manhattan_Island();

    renderer.render(scene, camera);

    function render(time){
        time *= 0.001; // Time is in SECONDS
            const speed = 1;
            const rot = time * speed;
            //WTC_Complex.rotation.y = rot;
            //console.log("Camera X: " + camera.position.x + "\nCamera Y: " + camera.position.y + "\nCamera Z: " + camera.position.z);
            //console.log("Camera Rotation X: " + camera.rotation.x + "\nCamera Rotation Y: " + camera.rotation.y + "\nCamera Rotation Z: " + camera.rotation.z);

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
    const tower1_geo = new THREE.BoxGeometry(tower_width, tower_height, tower_depth); // Geometry
    const tower2_geo = new THREE.BoxGeometry(tower_width, tower_height, tower_depth);
    // const tower_mat = new THREE.MeshPhongMaterial({color: 0x00ffff}); // Material

    const tower_1_uvs = new Float32Array([
        // Right
        0, 1,
        0.18827, 1,
        0, 0,
        0.18827, 0,

        // Left
        0, 1,
        0.18827, 1,
        0, 0,
        0.18827, 0,

        // Top
        0.188, 1,
        0.595, 1,
        0.188, 0.66667,
        0.595, 0.66667,

        // Bottom
        0.188, 1,
        0.595, 1,
        0.188, 0.66667,
        0.595, 0.66667,
        
        // Front
        0, 1,
        0.18827, 1,
        0, 0,
        0.18827, 0,

        // Back
        0, 1,
        0.18827, 1,
        0, 0,
        0.18827, 0,
    ]);

    const tower_2_uvs = new Float32Array([
        // Right
        0, 1,
        0.18827, 1,
        0, 0,
        0.18827, 0,

        // Left
        0, 1,
        0.18827, 1,
        0, 0,
        0.18827, 0,

        // Top
        0.595, 1,
        1, 1,
        0.595, 0.66667,
        1, 0.66667,

        // Bottom
        0.595, 1,
        1, 1,
        0.595, 0.66667,
        1, 0.66667,
        
        // Front
        0, 1,
        0.18827, 1,
        0, 0,
        0.18827, 0,

        // Back
        0, 1,
        0.18827, 1,
        0, 0,
        0.18827, 0,
    ]);

    tower1_geo.setAttribute( 'uv', new THREE.BufferAttribute( tower_1_uvs, 2 ) );
    tower2_geo.setAttribute( 'uv', new THREE.BufferAttribute( tower_2_uvs, 2 ) );

    //const texture = new THREE.Texture({image: "Materials/Twin_Towers_Face.png", mapping: uvs});
    //texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    const tower_mat = makeMaterial("Materials/Twin_Towers_Texture.png", "Materials/Twin_Towers_Texture.png", "Materials/Twin_Towers_Texture.png", 1, 1);


    const tower1_mesh = makeShape(tower1_geo, tower_mat, 0, 0, 0); // Make a cube mesh
    const tower2_mesh = makeShape(tower2_geo, tower_mat, 3.25, 0, -2.25); // Make a cube mesh

    // WTC1 Antenna
    const antenna_height = 3.60;
    const antenna_radius = 0.1;
    const antenna_geo = new THREE.CylinderGeometry(antenna_radius, antenna_radius, antenna_height, 32);
    //const antenna_mat = new THREE.MeshPhongMaterial({color: 0xffffff});
    const antenna_mat = makeMaterial("Materials/Antenna_Map.png", "Materials/Antenna_Map.png", "Materials/Antenna_Map.png", 1, 1);
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
        2.5, 0, 0.55, // v2
        1.25, 0, 0.55, // v3
        4.6, 0, -0.75, // v4
        4.6, 0, -0.15, // v5

        // East Face A
        1.25, 0, 0, // v6
        1.25, height, 0, // v7
        2.5, height, 0, // v8
        2.5, 0, 0, // v9

        // East Face B
        2.5, 0, 0, // v10
        2.5, height, 0, // v11
        4.6, height, -0.75, // v12
        4.6, 0, -0.75, // v13

        // South Face
        4.6, 0, -0.75, // v14
        4.6, height, -0.75, // v15
        4.6, height, -0.15, // v16
        4.6, 0, -0.15, // v17

        // West Face A
        4.6, 0, -0.15, // v18
        4.6, height, -0.15, // v19
        2.5, height, 0.55, // v20
        2.5, 0, 0.55, // v21

        // West Face B
        2.5, 0, 0.55, // v22
        2.5, height, 0.55, // v23
        1.25, height, 0.55, // v24
        1.25, 0, 0.55, // v25

        // North Face
        1.25, 0, 0.55, // v26
        1.25, height, 0.55, // v27
        1.25, height, 0, // v28
        1.25, 0, 0, // v29

        // Roof Level
        1.25, height, 0, // v30
        2.5, height, 0, // v31
        2.5, height, 0.55, // v32
        1.25, height, 0.55, // v33
        4.6, height, -0.75, // v34
        4.6, height, -0.15, // v35
    ]);

    const normals = new Float32Array([
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,

        0, 0, -1,
        0, 0, -1,
        0, 0, -1,
        0, 0, -1,
        
        0, 0, -1,
        0, 0, -1,
        0, 0, -1,
        0, 0, -1,
    
        0, 0, 0,
        0, 0, 0,
        0, 0, 0,
        0, 0, 0,

        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,

        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,

        -0.1, 0, 0,
        -0.1, 0, 0,
        -0.1, 0, 0,
        -0.1, 0, 0,

        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
    ]);

    const uvs = new Float32Array([
        0, 0,
        1, 0,
        1, 1,
        0, 1,
        0, 0,
        1, 0,

        0, 0,
        1, 0,
        1, 1,
        0, 1,

        0, 0,
        1, 0,
        1, 1,
        0, 1,

        0, 0,
        1, 0,
        1, 1,
        0, 1,

        0, 0,
        1, 0,
        1, 1,
        0, 1,

        0, 0,
        1, 0,
        1, 1,
        0, 1,

        0, 0,
        1, 0,
        1, 1,
        0, 1,

        0, 0,
        1, 0,
        1, 1,
        0, 1,
        0, 0,
        1, 0,
    ]);

    // Connects all of the vertices together
    const indices = [
        // floor
        0, 1, 2,
        0, 2, 3,
        1, 4, 2,
        2, 4, 5,

        // west wall
        6, 7, 8,
        6, 8, 9,
        10, 11, 12,
        10, 12, 13,

        // south wall
        14, 15, 16,
        14, 16, 17,

        // east wall
        18, 19, 20,
        18, 20, 21,
        22, 23, 24,
        22, 24, 25,

        // north wall
        26, 27, 28,
        26, 28, 29,

        // roof
        30, 31, 32,
        30, 32, 33,
        31, 34, 32,
        32, 34, 35,
    ];
    
    hotel_geo.setIndex( indices );
    // itemSize = 3 because there are 3 values (components) per vertex
    hotel_geo.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
    hotel_geo.setAttribute( 'uv', new THREE.BufferAttribute( uvs, 2 ) );
    hotel_geo.setAttribute( 'normal', new THREE.BufferAttribute( normals, 3 ) );
    const hotel_mat = makeMaterial("Materials/default_uv.png", "Materials/default_uv.png", "Materials/default_uv.png", 1, 1);

    // const loader = new THREE.TextureLoader();
    // const hotel_mat = [
    //     new THREE.MeshStandardMaterial({map: loadColorTexture("Materials/default_texture.png"), side: THREE.DoubleSide}),
    //     new THREE.MeshStandardMaterial({map: loadColorTexture("Reference_Image.JPG"), side: THREE.DoubleSide}),
    //     new THREE.MeshStandardMaterial({map: loadColorTexture("Materials/default_texture.png"), side: THREE.DoubleSide}),
    //     new THREE.MeshStandardMaterial({map: loadColorTexture("Reference_Image.JPG"), side: THREE.DoubleSide}),
    //     new THREE.MeshStandardMaterial({map: loadColorTexture("Materials/default_texture.png"), side: THREE.DoubleSide}),
    //     new THREE.MeshStandardMaterial({map: loadColorTexture("Reference_Image.JPG"), side: THREE.DoubleSide}),
    // ];

    // function loadColorTexture( path ) {
    //     const texture = loader.load( path );
    //     texture.colorSpace = THREE.SRGBColorSpace;
    //     return texture;
    // }

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

        // South Wall
        -4.7, 0, 0.25, // v4
        -4.7, height, 0.25, // v5
        -4.7, height, -2.15, // v6
        -4.7, 0, -2.15, // v7

        // West Wall
        -4.7, 0, 0.25, // v8
        -4.7, height, 0.25, // v9
        -6.15, height, 0.75, // v10
        -6.15, 0, 0.75, // v11

        // North Wall
        -6.15, 0, 0.75, // v12
        -6.15, height, 0.75, // v13
        -6.15, height, -2.5, // v14
        -6.15, 0, -2.5, // v15

        // East Wall
        -6.15, 0, -2.5, // v16
        -6.15, height, -2.5, // v17
        -4.7, height, -2.15, // v18
        -4.7, 0, -2.15, // v19

        // Roof Level
        -4.7, height, 0.25, // v20
        -6.15, height, 0.75, // v21
        -6.15, height, -2.5, // v22
        -4.7, height, -2.15, // v23
    ]);

    const normals = new Float32Array([
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,

        0, 0, -0.5,
        0, 0, -0.5,
        0, 0, -0.5,
        0, 0, -0.5,
    
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,

        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,

        0, 0, 0,
        0, 0, 0,
        0, 0, 0,
        0, 0, 0,

        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
    ]);

    const uvs = new Float32Array([
        0, 0,
        1, 0,
        1, 1,
        0, 1,

        0, 0,
        1, 0,
        1, 1,
        0, 1,

        0, 0,
        1, 0,
        1, 1,
        0, 1,

        0, 0,
        1, 0,
        1, 1,
        0, 1,

        0, 0,
        1, 0,
        1, 1,
        0, 1,

        0, 0,
        1, 0,
        1, 1,
        0, 1,
    ]);

    // Connects all of the vertices together
    const indices = [
        // floor
        0, 1, 2,
        0, 2, 3,

        // south wall
        4, 5, 6,
        4, 6, 7,

        // east wall
        8, 9, 10,
        8, 10, 11,

        // north wall
        12, 13, 14,
        12, 14, 15,

        // west wall
        16, 17, 18,
        16, 18, 19,

        // roof
        20, 21, 22,
        20, 22, 23
    ];
    
    WTC7_geo.setIndex( indices );
    // itemSize = 3 because there are 3 values (components) per vertex
    WTC7_geo.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
    WTC7_geo.setAttribute( 'uv', new THREE.BufferAttribute( uvs, 2 ) );
    WTC7_geo.setAttribute( 'normal', new THREE.BufferAttribute( normals, 3 ) );
    //const WTC7_mat = new THREE.MeshPhongMaterial({color: 0x3127f5, side: THREE.DoubleSide});
    const WTC7_mat = makeMaterial("Materials/default_uv.png", "Materials/default_uv.png", "Materials/default_uv.png", 1, 1);
    const WTC7 = makeShape(WTC7_geo, WTC7_mat, 0, -6.81, 0);

    WTC_Complex.add(WTC7);
}

function Build_WTC4(){
    var base_height = 0.26;
    var upper_height = 0.91;
    var diff = 0.2;

    const WTC4 = new THREE.Group();

    const WTC4_Base_Geo = new THREE.BufferGeometry();
    const WTC4_Upper_Geo = new THREE.BufferGeometry();

    // width = x, height = y, length = z
    const Upper_Vertices = new Float32Array([
        // Middle Level
        2.75, base_height, -6.25, // v0
        2.75, base_height, -6.90, // v1
        4.10, base_height, -6.90, // v2
        4.10, base_height, -6.25, // v3
        2.75, base_height, -5.40, // v4
        4.10, base_height, -5.40, // v5
        4.50, base_height, -5.40, // v6
        4.50, base_height, -4.70, // v7
        4.10, base_height, -4.70, // v8
        4.50, base_height, -3.55, // v9
        4.10, base_height, -3.55, // v10
        2.75, base_height, -3.55, // v11
        2.75, base_height, -4.75, // v12
        1.25, base_height, -4.75, // v13
        1.25, base_height, -5.35, // v14
        1.25, base_height, -6.25, // v15


        // Walls
        2.75, base_height, -6.25, // v16
        2.75, upper_height, -6.25, // v17
        2.75, upper_height, -6.90, // v18
        2.75, base_height, -6.90, // v19

        2.75, base_height, -6.90, // v20
        2.75, upper_height, -6.90, // v21
        4.10, upper_height, -6.90, // v22
        4.10, base_height, -6.90, // v23

        4.10, base_height, -6.90, // v24
        4.10, upper_height, -6.90, // v25
        4.10, upper_height, -6.25, // v26
        4.10, base_height, -6.25, // v27

        4.10, base_height, -6.25, // v28
        4.10, upper_height, -6.25, // v29
        4.10, upper_height, -5.40, // v30
        4.10, base_height, -5.40, // v31

        4.10, base_height, -5.40, // v32
        4.10, upper_height, -5.40, // v33
        4.50, upper_height, -5.40, // v34
        4.50, base_height, -5.40, // v35

        4.50, base_height, -5.40, // v36
        4.50, upper_height, -5.40, // v37
        4.50, upper_height, -4.70, // v38
        4.50, base_height, -4.70, // v39

        4.50, base_height, -4.70, // v40
        4.50, upper_height, -4.70, // v41
        4.50, upper_height, -3.55, // v42
        4.50, base_height, -3.55, // v43

        4.50, base_height, -3.55, // v44
        4.50, upper_height, -3.55, // v45
        4.10, upper_height, -3.55, // v46
        4.10, base_height, -3.55, // v47

        4.10, base_height, -3.55, // v48
        4.10, upper_height, -3.55, // v49
        2.75, upper_height, -3.55, // v50
        2.75, base_height, -3.55, // v51

        2.75, base_height, -3.55, // v52
        2.75, upper_height, -3.55, // v53
        2.75, upper_height, -4.75, // v54
        2.75, base_height, -4.75, // v55

        2.75, base_height, -4.75, // v56
        2.75, upper_height, -4.75, // v57
        1.25, upper_height, -4.75, // v58
        1.25, base_height, -4.75, // v59

        1.25, base_height, -4.75, // v60
        1.25, upper_height, -4.75, // v61
        1.25, upper_height, -5.35, // v62
        1.25, base_height, -5.35, // v63

        1.25, base_height, -5.35, // v64
        1.25, upper_height, -5.35, // v65
        1.25, upper_height, -6.25, // v66
        1.25, base_height, -6.25, // v67

        1.25, base_height, -6.25, // v68
        1.25, upper_height, -6.25, // v69
        2.75, upper_height, -6.25, // v70
        2.75, base_height, -6.25, // v71
        


        // Roof Level
        2.75, upper_height, -6.25, // v72
        2.75, upper_height, -6.90, // v73
        4.10, upper_height, -6.90, // v74
        4.10, upper_height, -6.25, // v75
        2.75, upper_height, -5.40, // v76
        4.10, upper_height, -5.40, // v77
        4.50, upper_height, -5.40, // v78
        4.50, upper_height, -4.70, // v79
        4.10, upper_height, -4.70, // v80
        4.50, upper_height, -3.55, // v81
        4.10, upper_height, -3.55, // v82
        2.75, upper_height, -3.55, // v83
        2.75, upper_height, -4.75, // v84
        1.25, upper_height, -4.75, // v85
        1.25, upper_height, -5.35, // v86
        1.25, upper_height, -6.25, // v87
    ]);

    const Base_Vertices = new Float32Array([
        // Floor Level
        2.75 + diff, 0, -6.25 + diff, // v0
        2.75 + diff, 0, -6.90 + diff, // v1
        4.10 - diff, 0, -6.90 + diff , // v2
        4.10 - diff, 0, -6.25 + diff, // v3
        2.75 + diff, 0, -5.40 - diff, // v4
        4.10 - diff, 0, -5.40 + diff, // v5
        4.50 - diff, 0, -5.40 + diff, // v6
        4.50 - diff, 0, -4.75 + diff, // v7
        4.10 - diff, 0, -4.75 - diff, // v8
        4.50 - diff, 0, -3.55 - diff, // v9
        4.10 - diff, 0, -3.55 - diff, // v10
        2.75 + diff, 0, -3.55 - diff, // v11
        2.75 + diff, 0, -4.75 - diff, // v12
        1.25 + diff, 0, -4.75 - diff, // v13
        1.25 + diff, 0, -5.40 - diff, // v14
        1.25 + diff, 0, -6.25 + diff, // v15


        // Walls
        2.75 + diff, 0, -6.25 + diff, // v16
        2.75 + diff, base_height, -6.25 + diff, // v17
        2.75 + diff, base_height, -6.90 + diff, // v18
        2.75 + diff, 0, -6.90 + diff, // v19

        2.75 + diff, 0, -6.90 + diff, // v20
        2.75 + diff, base_height, -6.90 + diff, // v21
        4.10 - diff, base_height, -6.90 + diff, // v22
        4.10 - diff, 0, -6.90 + diff, // v23

        4.10 - diff, 0, -6.90 + diff, // v24
        4.10 - diff, base_height, -6.90 + diff, // v25
        4.10 - diff, base_height, -6.25 + diff, // v26
        4.10 - diff, 0, -6.25 + diff, // v27

        4.10 - diff, 0, -6.25 + diff, // v28
        4.10 - diff, base_height, -6.25 + diff, // v29
        4.10 - diff, base_height, -5.40 + diff, // v30
        4.10 - diff, 0, -5.40 + diff, // v31

        4.10 - diff, 0, -5.40 + diff, // v32
        4.10 - diff, base_height, -5.40 + diff, // v33
        4.50 - diff, base_height, -5.40 + diff, // v34
        4.50 - diff, 0, -5.40 + diff, // v35

        4.50 - diff, 0, -5.40 + diff, // v36
        4.50 - diff, base_height, -5.40 + diff, // v37
        4.50 - diff, base_height, -4.75 + diff, // v38
        4.50 - diff, 0, -4.75 + diff, // v39

        4.50 - diff, 0, -4.75 + diff, // v40
        4.50 - diff, base_height, -4.75 + diff, // v41
        4.50 - diff, base_height, -3.55 - diff, // v42
        4.50 - diff, 0, -3.55 - diff, // v43

        4.50 - diff, 0, -3.55 - diff, // v44
        4.50 - diff, base_height, -3.55 - diff, // v45
        4.10 - diff, base_height, -3.55 - diff, // v46
        4.10 - diff, 0, -3.55 - diff, // v47

        4.10 - diff, 0, -3.55 - diff, // v48
        4.10 - diff, base_height, -3.55 - diff, // v49
        2.75 + diff, base_height, -3.55 - diff, // v50
        2.75 + diff, 0, -3.55 - diff, // v51

        2.75 + diff, 0, -3.55 - diff, // v52
        2.75 + diff, base_height, -3.55 - diff, // v53
        2.75 + diff, base_height, -4.75 - diff, // v54
        2.75 + diff, 0, -4.75 - diff, // v55

        2.75 + diff, 0, -4.75 - diff, // v56
        2.75 + diff, base_height, -4.75 - diff, // v57
        1.25 + diff, base_height, -4.75 - diff, // v58
        1.25 + diff, 0, -4.75 - diff, // v59

        1.25 + diff, 0, -4.75 - diff, // v60
        1.25 + diff, base_height, -4.75 - diff, // v61
        1.25 + diff, base_height, -5.40 - diff, // v62
        1.25 + diff, 0, -5.40 - diff, // v63

        1.25 + diff, 0, -5.40 - diff, // v64
        1.25 + diff, base_height, -5.40 - diff, // v65
        1.25 + diff, base_height, -6.25 + diff, // v66
        1.25 + diff, 0, -6.25 + diff, // v67

        1.25 + diff, 0, -6.25 + diff, // v68
        1.25 + diff, base_height, -6.25 + diff, // v69
        2.75 + diff, base_height, -6.25 + diff, // v70
        2.75 + diff, 0, -6.25 + diff, // v71
        


        // Middle Level
        2.75 + diff, base_height, -6.25 + diff, // v0
        2.75 + diff, base_height, -6.90 + diff, // v1
        4.10 - diff, base_height, -6.90 + diff , // v2
        4.10 - diff, base_height, -6.25 + diff, // v3
        2.75 + diff, base_height, -5.40 - diff, // v4
        4.10 - diff, base_height, -5.40 + diff, // v5
        4.50 - diff, base_height, -5.40 + diff, // v6
        4.50 - diff, base_height, -4.75 + diff, // v7
        4.10 - diff, base_height, -4.75 - diff, // v8
        4.50 - diff, base_height, -3.55 - diff, // v9
        4.10 - diff, base_height, -3.55 - diff, // v10
        2.75 + diff, base_height, -3.55 - diff, // v11
        2.75 + diff, base_height, -4.75 - diff, // v12
        1.25 + diff, base_height, -4.75 - diff, // v13
        1.25 + diff, base_height, -5.40 - diff, // v14
        1.25 + diff, base_height, -6.25 + diff, // v15
    ]);

    const uvs = new Float32Array([
        0.4, 0.8,
        0.4, 1,
        0.87, 1,
        0.87, 0.8,
        0.48, 0.51,
        0.87, 0.51,
        1, 0.51,
        1, 0.32,
        0.87, 0.32,
        1, 0,
        0.87, 0,
        0.4, 0,
        0.4, 0.3,
        0, 0.3,
        0, 0.51,
        0, 0.8,

        0, 0,
        1, 0,
        1, 1,
        0, 1,

        0, 0,
        1, 0,
        1, 1,
        0, 1,

        0, 0,
        1, 0,
        1, 1,
        0, 1,

        0, 0,
        1, 0,
        1, 1,
        0, 1,

        0, 0,
        1, 0,
        1, 1,
        0, 1,

        0, 0,
        1, 0,
        1, 1,
        0, 1,

        0, 0,
        1, 0,
        1, 1,
        0, 1,

        0, 0,
        1, 0,
        1, 1,
        0, 1,

        0, 0,
        1, 0,
        1, 1,
        0, 1,

        0, 0,
        1, 0,
        1, 1,
        0, 1,

        0, 0,
        1, 0,
        1, 1,
        0, 1,

        0, 0,
        1, 0,
        1, 1,
        0, 1,

        0, 0,
        1, 0,
        1, 1,
        0, 1,

        0, 0,
        1, 0,
        1, 1,
        0, 1,

        0.4, 0.8,
        0.4, 1,
        0.87, 1,
        0.87, 0.8,
        0.48, 0.51,
        0.87, 0.51,
        1, 0.51,
        1, 0.32,
        0.87, 0.32,
        1, 0,
        0.87, 0,
        0.4, 0,
        0.4, 0.3,
        0, 0.3,
        0, 0.51,
        0, 0.8,
    ]);

    const normals = new Float32Array([
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,

        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,

        0, 0, 0,
        0, 0, 0,
        0, 0, 0,
        0, 0, 0,

        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,

        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,

        0, 0, 0,
        0, 0, 0,
        0, 0, 0,
        0, 0, 0,

        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,

        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,

        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,

        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,

        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,

        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,

        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,

        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,

        0, 0, 0,
        0, 0, 0,
        0, 0, 0,
        0, 0, 0,

        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
    ]);

    // Connects all of the vertices together
    const Indices = [
        // floor
        0, 1, 2,
        0, 2, 3,
        0, 3, 5,
        0, 5, 4,
        5, 6, 7,
        5, 7, 8,
        7, 9, 10,
        7, 10, 8,
        10, 12, 8,
        10, 11, 12,
        12, 4, 5,
        12, 5, 8,
        12, 13, 4,
        13, 14, 4,
        14, 0, 4,
        14, 15, 0,

        // walls
        16, 17, 18,
        16, 18, 19,
        20, 21, 22,
        20, 22, 23,
        24, 25, 26,
        24, 26, 27,
        28, 29, 30,
        28, 30, 31,
        32, 33, 34,
        32, 34, 35,
        36, 37, 38,
        36, 38, 39,
        40, 41, 42,
        40, 42, 43,
        44, 45, 46,
        44, 46, 47,
        48, 49, 50,
        48, 50, 51,
        52, 53, 54,
        52, 54, 55,
        56, 57, 58,
        56, 58, 59,
        60, 61, 62,
        60, 62, 63,
        64, 65, 66,
        64, 66, 67,
        68, 69, 70,
        68, 70, 71,

        // Roof
        72, 73, 74,
        72, 74, 75,
        72, 75, 77,
        72, 77, 76,
        77, 78, 79,
        77, 79, 80,
        79, 81, 82,
        79, 82, 80,
        82, 83, 80,
        83, 84, 80,
        84, 76, 77,
        84, 77, 80,
        84, 85, 76,
        85, 86, 76,
        86, 72, 76,
        86, 87, 72,
    ];
    
    WTC4_Upper_Geo.setIndex( Indices );
    WTC4_Upper_Geo.setAttribute( 'position', new THREE.BufferAttribute( Upper_Vertices, 3 ) );
    WTC4_Upper_Geo.setAttribute( 'normal', new THREE.BufferAttribute( normals, 3 ) );
    WTC4_Upper_Geo.setAttribute( 'uv', new THREE.BufferAttribute( uvs, 2 ) );
    // const WTC4_Upper_Mat = new THREE.MeshPhongMaterial({color: 0x3127f5, side: THREE.DoubleSide});
    const WTC4_Upper_Mat = makeMaterial("Materials/default_uv.png", "Materials/default_uv.png", "Materials/default_uv.png", 1, 1);
    const WTC4_Upper_Mesh = makeShape(WTC4_Upper_Geo, WTC4_Upper_Mat, 0, -6.81, 0);
    WTC4.add(WTC4_Upper_Mesh);

    WTC4_Base_Geo.setIndex( Indices );
    WTC4_Base_Geo.setAttribute( 'position', new THREE.BufferAttribute( Base_Vertices, 3 ) );
    WTC4_Base_Geo.setAttribute( 'normal', new THREE.BufferAttribute( normals, 3 ) );
    WTC4_Base_Geo.setAttribute( 'uv', new THREE.BufferAttribute( uvs, 2 ) );
    //const WTC4_Base_Mat = new THREE.MeshPhongMaterial({color: 0x3127f5, side: THREE.DoubleSide});
    const WTC4_Base_Mat = makeMaterial("Materials/default_uv.png", "Materials/default_uv.png", "Materials/default_uv.png", 1, 1);
    const WTC4_Base_Mesh = makeShape(WTC4_Base_Geo, WTC4_Base_Mat, 0, -6.81, 0);
    WTC4.add(WTC4_Base_Mesh);

    WTC_Complex.add(WTC4);
}

function Build_WTC5(){
    var base_height = 0.26;
    var upper_height = 0.91;
    var diff = 0.2;

    const WTC5 = new THREE.Group();

    const WTC5_Base_Geo = new THREE.BufferGeometry();
    const WTC5_Upper_Geo = new THREE.BufferGeometry();

    // width = x, height = y, length = z
    const Upper_Vertices = new Float32Array([
        // Middle Level
        -3.10, base_height, -6.25, // v0
        -3.10, base_height, -6.50, // v1
        -1.65, base_height, -6.50, // v2
        -1.65, base_height, -6.25, // v3
        -0.15, base_height, -6.25, // v4
        -0.15, base_height, -4.75, // v5
        -1.65, base_height, -4.75, // v6
        -1.65, base_height, -4.40, // v7
        -1.65, base_height, -4.10, // v8
        -1.40, base_height, -4.10, // v9
        -1.40, base_height, -2.25, // v10
        -1.65, base_height, -2.25, // v11
        -3.10, base_height, -2.25, // v12
        -3.10, base_height, -4.10, // v13
        -3.40, base_height, -2.25, // v14
        -3.40, base_height, -4.10, // v15
        -3.40, base_height, -4.40, // v16
        -3.10, base_height, -4.40, // v17
        -3.10, base_height, -4.75, // v18

        // Walls
        -3.10, base_height, -6.50,  // v19
        -3.10, upper_height, -6.50,  // v20
        -1.65, upper_height, -6.50,  // v21
        -1.65, base_height, -6.50,  // v22

        -1.65, base_height, -6.50,  // v23
        -1.65, upper_height, -6.50, // v24
        -1.65, upper_height, -6.25, // v25
        -1.65, base_height, -6.25,  // v26

        -1.65, base_height, -6.25,  // v27
        -1.65, upper_height, -6.25,  // v28
        -0.15, upper_height, -6.25,  // v29
        -0.15, base_height, -6.25,  // v30

        -0.15, base_height, -6.25,  // v31
        -0.15, upper_height, -6.25, // v32
        -0.15, upper_height, -4.75, // v33
        -0.15, base_height, -4.75,  // v34

        -0.15, base_height, -4.75,  // v35
        -0.15, upper_height, -4.75,  // v36
        -1.65, upper_height, -4.75,  // v37
        -1.65, base_height, -4.75,  // v38

        -1.65, base_height, -4.75,  // v39
        -1.65, upper_height, -4.75, // v40
        -1.65, upper_height, -4.10,  // v41
        -1.65, base_height, -4.10,  // v42

        -1.65, base_height, -4.10,  // v43
        -1.65, upper_height, -4.10, // v44
        -1.40, upper_height, -4.10, // v45
        -1.40, base_height, -4.10,  // v46

        -1.40, base_height, -4.10,  // v47
        -1.40, upper_height, -4.10,  // v48
        -1.40, upper_height, -2.25,  // v49
        -1.40, base_height, -2.25,  // v50

        -1.40, base_height, -2.25,  // v51
        -1.40, upper_height, -2.25, // v52
        -3.40, upper_height, -2.25, // v53
        -3.40, base_height, -2.25,  // v54

        -3.40, base_height, -2.25,  // v55
        -3.40, upper_height, -2.25,  // v56
        -3.40, upper_height, -4.40, // v57
        -3.40, base_height, -4.40,  // v58

        -3.40, base_height, -4.40,  // v59
        -3.40, upper_height, -4.40,  // v60
        -3.10, upper_height, -4.40,  // v61
        -3.10, base_height, -4.40,  // v62

        -3.10, base_height, -4.40,  // v63
        -3.10, upper_height, -4.40, // v64
        -3.10, upper_height, -6.50,  // v65
        -3.10, base_height, -6.50,  // v66


        // Roof
        -3.10, upper_height, -6.25, // v67
        -3.10, upper_height, -6.50, // v68
        -1.65, upper_height, -6.50, // v69
        -1.65, upper_height, -6.25, // v70
        -0.15, upper_height, -6.25, // v71
        -0.15, upper_height, -4.75, // v72
        -1.65, upper_height, -4.75, // v73
        -1.65, upper_height, -4.40, // v74
        -1.65, upper_height, -4.10, // v75
        -1.40, upper_height, -4.10, // v76
        -1.40, upper_height, -2.25, // v77
        -1.65, upper_height, -2.25, // v78
        -3.10, upper_height, -2.25, // v79
        -3.10, upper_height, -4.10, // v80
        -3.40, upper_height, -2.25, // v81
        -3.40, upper_height, -4.10, // v82
        -3.40, upper_height, -4.40, // v83
        -3.10, upper_height, -4.40, // v84
        -3.10, upper_height, -4.75, // v85
    ]);

    const normals = new Float32Array([
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,

        0, 0, 0,
        0, 0, 0,
        0, 0, 0,
        0, 0, 0,

        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,

        0, 0, 0,
        0, 0, 0,
        0, 0, 0,
        0, 0, 0,

        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,

        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,

        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,

        0, 0, 0,
        0, 0, 0,
        0, 0, 0,
        0, 0, 0,

        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,

        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,

        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,

        0, 0, 0,
        0, 0, 0,
        0, 0, 0,
        0, 0, 0,

        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,

        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
    ]);

    const uvs = new Float32Array([
        0.05, 0.95,
        0.05, 1,
        0.33, 1,
        0.33, 0.95,
        0.76, 0.95,
        0.76, 0.6,
        0.33, 0.6,
        0.33, 0.52,
        0.33, 0.48,
        0.47, 0.48,
        0.47, 0,
        0.44, 0,
        0.05, 0,
        0.05, 0.48,
        0, 0,
        0, 0.48,
        0, 0.52,
        0.05, 0.52,
        0.05, 0.6,

        0, 0,
        1, 0,
        1, 1,
        0, 1,

        0, 0,
        1, 0,
        1, 1,
        0, 1,

        0, 0,
        1, 0,
        1, 1,
        0, 1,

        0, 0,
        1, 0,
        1, 1,
        0, 1,

        0, 0,
        1, 0,
        1, 1,
        0, 1,

        0, 0,
        1, 0,
        1, 1,
        0, 1,

        0, 0,
        1, 0,
        1, 1,
        0, 1,

        0, 0,
        1, 0,
        1, 1,
        0, 1,

        0, 0,
        1, 0,
        1, 1,
        0, 1,

        0, 0,
        1, 0,
        1, 1,
        0, 1,

        0, 0,
        1, 0,
        1, 1,
        0, 1,

        0, 0,
        1, 0,
        1, 1,
        0, 1,

        0.05, 0.95,
        0.05, 1,
        0.33, 1,
        0.33, 0.95,
        0.76, 0.95,
        0.76, 0.6,
        0.33, 0.6,
        0.33, 0.52,
        0.33, 0.48,
        0.47, 0.48,
        0.47, 0,
        0.44, 0,
        0.05, 0,
        0.05, 0.48,
        0, 0,
        0, 0.48,
        0, 0.52,
        0.05, 0.52,
        0.05, 0.6,
    ]);
    
    const Base_Vertices = new Float32Array([
        // Middle Level
        -3.10 + diff, 0, -6.25 + diff, // v0
        -3.10 + diff, 0, -6.50 + diff, // v1
        -1.65 - diff, 0, -6.50 + diff, // v2
        -1.65 - diff, 0, -6.25 + diff, // v3
        -0.15 - diff, 0, -6.25 + diff, // v4
        -0.15 - diff, 0, -4.75 - diff, // v5
        -1.65 - diff, 0, -4.75 - diff, // v6
        -1.65 - diff, 0, -4.40 + diff, // v7
        -1.65 - diff, 0, -4.10 + diff, // v8
        -1.40 - diff, 0, -4.10 + diff, // v9
        -1.40 - diff, 0, -2.25 - diff, // v10
        -1.65 - diff, 0, -2.25 - diff, // v11
        -3.10 + diff, 0, -2.25 - diff, // v12
        -3.10 + diff, 0, -4.10 + diff, // v13
        -3.40 + diff, 0, -2.25 - diff, // v14
        -3.40 + diff, 0, -4.10 + diff, // v15
        -3.40 + diff, 0, -4.40 + diff, // v16
        -3.10 + diff, 0, -4.40 + diff, // v17
        -3.10 + diff, 0, -4.75 - diff, // v18

        // Walls
        -3.10 + diff, 0, -6.50 + diff,  // v23
        -3.10 + diff, base_height, -6.50 + diff,  // v24
        -1.65 - diff, base_height, -6.50 + diff,  // v25
        -1.65 - diff, 0, -6.50 + diff,  // v26

        -1.65 - diff, 0, -6.50 + diff,  // v27
        -1.65 - diff, base_height, -6.50 + diff, // v28
        -1.65 - diff, base_height, -6.25 + diff, // v29
        -1.65 - diff, 0, -6.25 + diff,  // v30

        -1.65 - diff, 0, -6.25 + diff,  // v31
        -1.65 - diff, base_height, -6.25 + diff,  // v32
        -0.15 - diff, base_height, -6.25 + diff,  // v33
        -0.15 - diff, 0, -6.25 + diff,  // v34

        -0.15 - diff, 0, -6.25 + diff,  // v35
        -0.15 - diff, base_height, -6.25 + diff, // v36
        -0.15 - diff, base_height, -4.75 - diff, // v37
        -0.15 - diff, 0, -4.75 - diff,  // v38

        -0.15 - diff, 0, -4.75 - diff,  // v39
        -0.15 - diff, base_height, -4.75 - diff,  // v40
        -1.65 - diff, base_height, -4.75 - diff,  // v41
        -1.65 - diff, 0, -4.75 - diff,  // v42

        -1.65 - diff, 0, -4.75 - diff,  // v43
        -1.65 - diff, base_height, -4.75 - diff, // v44
        -1.65 - diff, base_height, -4.10 + diff,  // v49
        -1.65 - diff, 0, -4.10 + diff,  // v50

        -1.65 - diff, 0, -4.10 + diff,  // v51
        -1.65 - diff, base_height, -4.10 + diff, // v52
        -1.40 - diff, base_height, -4.10 + diff, // v53
        -1.40 - diff, 0, -4.10 + diff,  // v54

        -1.40 - diff, 0, -4.10 + diff,  // v55
        -1.40 - diff, base_height, -4.10 + diff,  // v56
        -1.40 - diff, base_height, -2.25 - diff,  // v57
        -1.40 - diff, 0, -2.25 - diff,  // v58

        -1.40 - diff, 0, -2.25 - diff,  // v59
        -1.40 - diff, base_height, -2.25 - diff, // v60
        -3.40 + diff, base_height, -2.25 - diff, // v69
        -3.40 + diff, 0, -2.25 - diff,  // v70

        -3.40 + diff, 0, -2.25 - diff,  // v71
        -3.40 + diff, base_height, -2.25 - diff,  // v72
        -3.40 + diff, base_height, -4.40 + diff, // v77
        -3.40 + diff, 0, -4.40 + diff,  // v78

        -3.40 + diff, 0, -4.40 + diff,  // v79
        -3.40 + diff, base_height, -4.40 + diff,  // v80
        -3.10 + diff, base_height, -4.40 + diff,  // v81
        -3.10 + diff, 0, -4.40 + diff,  // v82

        -3.10 + diff, 0, -4.40 + diff,  // v83
        -3.10 + diff, base_height, -4.40 + diff, // v84
        -3.10 + diff, base_height, -6.50 + diff,  // v89
        -3.10 + diff, 0, -6.50 + diff,  // v90

        // Roof
        -3.10 + diff, base_height, -6.25 + diff, // v91
        -3.10 + diff, base_height, -6.50 + diff, // v92
        -1.65 - diff, base_height, -6.50 + diff, // v93
        -1.65 - diff, base_height, -6.25 + diff, // v94
        -0.15 - diff, base_height, -6.25 + diff, // v95
        -0.15 - diff, base_height, -4.75 - diff, // v96
        -1.65 - diff, base_height, -4.75 - diff, // v97
        -1.65 - diff, base_height, -4.40 + diff, // v98
        -1.65 - diff, base_height, -4.10 + diff, // v99
        -1.40 - diff, base_height, -4.10 + diff, // v100
        -1.40 - diff, base_height, -2.25 - diff, // v101
        -1.65 - diff, base_height, -2.25 - diff, // v102
        -3.10 + diff, base_height, -2.25 - diff, // v103
        -3.10 + diff, base_height, -4.10 + diff, // v104
        -3.40 + diff, base_height, -2.25 - diff, // v105
        -3.40 + diff, base_height, -4.10 + diff, // v106
        -3.40 + diff, base_height, -4.40 + diff, // v107
        -3.10 + diff, base_height, -4.40 + diff, // v108
        -3.10 + diff, base_height, -4.75 - diff, // v109
    ]);

    // Connects all of the vertices together
    const Indices = [
        // floor
        0, 1, 2,
        0, 2, 3,
        3, 4, 5,
        3, 5, 6,
        8, 9, 10,
        8, 10, 11,
        12, 13, 8,
        12, 8, 11,
        14, 15, 13,
        14, 13, 12,
        15, 16, 17,
        15, 17, 13,
        13, 17, 7,
        13, 7, 8,
        17, 18, 6,
        17, 6, 7,
        18, 0, 3,
        18, 3, 6,

        // walls
        19, 20, 21,
        19, 21, 22,
        23, 24, 25,
        23, 25, 26,
        27, 28, 29,
        27, 29, 30,
        31, 32, 33,
        31, 33, 34,
        35, 36, 37,
        35, 37, 38,
        39, 40, 41,
        39, 41, 42,
        43, 44, 45,
        43, 45, 46,
        47, 48, 49,
        47, 49, 50,
        51, 52, 53,
        51, 53, 54,
        55, 56, 57,
        55, 57, 58,
        59, 60, 61,
        59, 61, 62,
        63, 64, 65,
        63, 65, 66,

        // roof
        67, 68, 69,
        67, 69, 70,
        70, 71, 72,
        70, 72, 73,
        75, 76, 77,
        75, 77, 78,
        79, 80, 75,
        79, 75, 78,
        81, 82, 80,
        81, 80, 79,
        82, 83, 84,
        82, 84, 80,
        80, 84, 74,
        80, 74, 75,
        84, 85, 73,
        84, 73, 74,
        85, 67, 70,
        85, 70, 73,
    ];
    
    WTC5_Upper_Geo.setIndex( Indices );
    WTC5_Upper_Geo.setAttribute( 'position', new THREE.BufferAttribute( Upper_Vertices, 3 ) );
    WTC5_Upper_Geo.setAttribute( 'normal', new THREE.BufferAttribute( normals, 3 ) );
    WTC5_Upper_Geo.setAttribute( 'uv', new THREE.BufferAttribute( uvs, 2 ) );
    //const WTC5_Upper_Mat = new THREE.MeshPhongMaterial({color: 0x3127f5, side: THREE.DoubleSide});
    const WTC5_Upper_Mat = makeMaterial("Materials/default_uv.png", "Materials/default_uv.png", "Materials/default_uv.png", 1, 1);
    const WTC5_Upper_Mesh = makeShape(WTC5_Upper_Geo, WTC5_Upper_Mat, 0, -6.81, 0);
    WTC5.add(WTC5_Upper_Mesh);

    WTC5_Base_Geo.setIndex( Indices );
    WTC5_Base_Geo.setAttribute( 'position', new THREE.BufferAttribute( Base_Vertices, 3 ) );
    WTC5_Base_Geo.setAttribute( 'normal', new THREE.BufferAttribute( normals, 3 ) );
    WTC5_Base_Geo.setAttribute( 'uv', new THREE.BufferAttribute( uvs, 2 ) );
    //const WTC5_Base_Mat = new THREE.MeshPhongMaterial({color: 0x3127f5, side: THREE.DoubleSide , wireframe: false});
    const WTC5_Base_Mat = makeMaterial("Materials/default_uv.png", "Materials/default_uv.png", "Materials/default_uv.png", 1, 1);
    const WTC5_Base_Mesh = makeShape(WTC5_Base_Geo, WTC5_Base_Mat, 0, -6.81, 0);
    WTC5.add(WTC5_Base_Mesh);

    WTC_Complex.add(WTC5);
}

function Build_WTC6(){
    var base_height = 0.26;
    var upper_height = 0.65;
    var diff = 0.2;

    const WTC6 = new THREE.Group();

    const WTC6_Base_Geo = new THREE.BufferGeometry();
    const WTC6_Upper_Geo = new THREE.BufferGeometry();

    // width = x, height = y, length = z
    const Upper_Vertices = new Float32Array([
        // Walls
        -3.25, base_height, -1.6,   // v0
        -3.25, upper_height, -1.6,  // v1
        -1.75, upper_height, -1.6,  // v2
        -1.75, base_height, -1.6,   // v3

        -1.75, base_height, -1.6,   // v4
        -1.75, upper_height, -1.6,  // v5
        -1.75, upper_height, -0.15, // v6
        -1.75, base_height, -0.15,  // v7

        -1.75, base_height, -0.15,  // v8
        -1.75, upper_height, -0.15, // v9
        -1.25, upper_height, -0.15, // v10
        -1.25, base_height, -0.15,  // v11

        -1.25, base_height, -0.15,  // v12
        -1.25, upper_height, -0.15, // v13
        -1.25, upper_height, 1.55, // v14
        -1.25, base_height, 1.55,  // v15

        -1.25, base_height, 1.55,  // v16
        -1.25, upper_height, 1.55, // v17
        -2, upper_height, 1.55,    // v18
        -2, base_height, 1.55,     // v19

        -2, base_height, 1.55,     // v20
        -2, upper_height, 1.55,    // v21
        -2, upper_height, 2.5,     // v22
        -2, base_height, 2.5,      // v23

        -2, base_height, 2.5,      // v24
        -2, upper_height, 2.5,     // v25
        -3.6, upper_height, 2.5,   // v26
        -3.6, base_height, 2.5,    // v27

        -3.6, base_height, 2.5,    // v28
        -3.6, upper_height, 2.5,   // v29
        -3.6, upper_height, 0.15,   // v30
        -3.6, base_height, 0.15,   // v31

        -3.6, base_height, 0.15,    // v32
        -3.6, upper_height, 0.15,   // v33
        -3.25, upper_height, 0.15,  // v34
        -3.25, base_height, 0.15,   // v35

        -3.25, base_height, 0.15,   // v36
        -3.25, upper_height, 0.15,  // v37
        -3.25, upper_height, -1.6,  // v38
        -3.25, base_height, -1.6,   // v39

        // Middle
        -3.25, base_height, -1.6,   // v40
        -2, base_height, -1.6,      // v41
        -1.75, base_height, -1.6,   // v42
        -3.25, base_height, -0.15,  // v43
        -2, base_height, -0.15,     // v44
        -1.75, base_height, -0.15,  // v45
        -1.25, base_height, -0.15,  // v46
        -3.6, base_height, 0.15,    // v47
        -3.25, base_height, 0.15,   // v48
        -2, base_height, 0.15,      // v49
        -1.75, base_height, 0.15,   // v50
        -1.25, base_height, 0.15,   // v51
        -3.6, base_height, 1.55,   // v52
        -3.25, base_height, 1.55,  // v53
        -2, base_height, 1.55,     // v54
        -1.75, base_height, 1.55,  // v55
        -1.25, base_height, 1.55,  // v56
        -3.6, base_height, 2.5,    // v57
        -3.25, base_height, 2.5,   // v58
        -2, base_height, 2.5,      // v59

        // Roof
        -3.25, upper_height, -1.6,  // v60
        -2, upper_height, -1.6,     // v61
        -1.75, upper_height, -1.6,  // v62
        -3.25, upper_height, -0.15, // v63
        -2, upper_height, -0.15,    // v64
        -1.75, upper_height, -0.15, // v65
        -1.25, upper_height, -0.15, // v66
        -3.6, upper_height, 0.15,   // v67
        -3.25, upper_height, 0.15,  // v68
        -2, upper_height, 0.15,     // v69
        -1.75, upper_height, 0.15,  // v70
        -1.25, upper_height, 0.15,  // v71
        -3.6, upper_height, 1.55,  // v72
        -3.25, upper_height, 1.55, // v73
        -2, upper_height, 1.55,    // v74
        -1.75, upper_height, 1.55, // v75
        -1.25, upper_height, 1.55, // v76
        -3.6, upper_height, 2.5,   // v77
        -3.25, upper_height, 2.5,  // v78
        -2, upper_height, 2.5,     // v79
    ]);


    const normals = new Float32Array([
        0, 0, 0,
        0, 0, 0,
        0, 0, 0,
        0, 0, 0,

        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,

        0, 0, 0,
        0, 0, 0,
        0, 0, 0,
        0, 0, 0,

        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,

        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,

        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,

        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,

        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,

        0, 0, 0,
        0, 0, 0,
        0, 0, 0,
        0, 0, 0,

        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,

        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,

        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
    ]);

    const uvs = new Float32Array([
        0, 0,
        1, 0,
        1, 1,
        0, 1,

        0, 0,
        1, 0,
        1, 1,
        0, 1,

        0, 0,
        1, 0,
        1, 1,
        0, 1,

        0, 0,
        1, 0,
        1, 1,
        0, 1,

        0, 0,
        1, 0,
        1, 1,
        0, 1,

        0, 0,
        1, 0,
        1, 1,
        0, 1,

        0, 0,
        1, 0,
        1, 1,
        0, 1,

        0, 0,
        1, 0,
        1, 1,
        0, 1,

        0, 0,
        1, 0,
        1, 1,
        0, 1,

        0, 0,
        1, 0,
        1, 1,
        0, 1,

        0.10, 1,
        0.37, 1,
        0.43, 1,
        0.10, 0.625,
        0.37, 0.625,
        0.43, 0.625,
        0.55, 0.625,
        0, 0.56,
        0.10, 0.56,
        0.37, 0.56,
        0.43, 0.56,
        0.55, 0.56,
        0, 0.24,
        0.10, 0.24,
        0.37, 0.24,
        0.43, 0.24,
        0.55, 0.24,
        0, 0,
        0.10, 0,
        0.37, 0,

        0.10, 1,
        0.37, 1,
        0.43, 1,
        0.10, 0.625,
        0.37, 0.625,
        0.43, 0.625,
        0.55, 0.625,
        0, 0.56,
        0.10, 0.56,
        0.37, 0.56,
        0.43, 0.56,
        0.55, 0.56,
        0, 0.24,
        0.10, 0.24,
        0.37, 0.24,
        0.43, 0.24,
        0.55, 0.24,
        0, 0,
        0.10, 0,
        0.37, 0,
    ]);
    
    const Base_Vertices = new Float32Array([
        -3.25 + diff, 0, -1.6 + diff,
        -3.25 + diff, base_height, -1.6 + diff,
        -1.75 - diff, base_height, -1.6 + diff,
        -1.75 - diff, 0, -1.6 + diff,

        -1.75 - diff, 0, -1.6 + diff,
        -1.75 - diff, base_height, -1.6 + diff,
        -1.75 - diff, base_height, -0.15 + diff,
        -1.75 - diff, 0, -0.15 + diff,

        -1.75 - diff, 0, -0.15 + diff,
        -1.75 - diff, base_height, -0.15 + diff,
        -1.25 - diff, base_height, -0.15 + diff,
        -1.25 - diff, 0, -0.15 + diff,

        -1.25 - diff, 0, -0.15 + diff,
        -1.25 - diff, base_height, -0.15 + diff,
        -1.25 - diff, base_height, 1.55 - diff,
        -1.25 - diff, 0, 1.55 - diff,

        -1.25 - diff, 0, 1.55 - diff,
        -1.25 - diff, base_height, 1.55 - diff,
        -2 - diff, base_height, 1.55 - diff,
        -2 - diff, 0, 1.55 - diff,

        -2 - diff, 0, 1.55 - diff,
        -2 - diff, base_height, 1.55 - diff,
        -2 - diff, base_height, 2.5 - diff,
        -2 - diff, 0, 2.5 - diff,

        -2 - diff, 0, 2.5 - diff,
        -2 - diff, base_height, 2.5 - diff,
        -3.6 + diff, base_height, 2.5 - diff,
        -3.6 + diff, 0, 2.5 - diff,

        -3.6 + diff, 0, 2.5 - diff,
        -3.6 + diff, base_height, 2.5 - diff,
        -3.6 + diff, base_height, 0.15 + diff,
        -3.6 + diff, 0, 0.15 + diff,

        -3.6 + diff, 0, 0.15 + diff,
        -3.6 + diff, base_height, 0.15 + diff,
        -3.25 + diff, base_height, 0.15 + diff,
        -3.25 + diff, 0, 0.15 + diff,

        -3.25 + diff, 0, 0.15 + diff,
        -3.25 + diff, base_height, 0.15 + diff,
        -3.25 + diff, base_height, -1.6 + diff,
        -3.25 + diff, 0, -1.6 + diff,
    ]);

    // Connects all of the vertices together
    const Indices = [
        0, 1, 2,
        0, 2, 3,
        4, 5, 6,
        4, 6, 7,
        8, 9, 10,
        8, 10, 11,
        12, 13, 14,
        12, 14, 15,
        16, 17, 18,
        16, 18, 19,
        20, 21, 22,
        20, 22, 23,
        24, 25, 26,
        24, 26, 27,
        28, 29, 30,
        28, 30, 31,
        32, 33, 34,
        32, 34, 35,
        36, 37, 38,
        36, 38, 39,

        43, 41, 40,
        43, 44, 41,
        44, 42, 41,
        44, 45, 42,
        48, 44, 43,
        44, 48, 49,
        49, 45, 44,
        49, 50, 45,
        50, 46, 45,
        50, 51, 46,
        52, 48, 47,
        52, 53, 48,
        53, 49, 48,
        53, 54, 49,
        54, 50, 49,
        54, 55, 50,
        55, 51, 50,
        55, 56, 51,
        57, 53, 52,
        57, 58, 53,
        58, 54, 53,
        58, 59, 54,

        63, 61, 60,
        63, 64, 61,
        64, 62, 61,
        64, 65, 62,
        68, 64, 63,
        64, 68, 69,
        69, 65, 64,
        69, 70, 65,
        70, 66, 65,
        70, 71, 66,
        72, 68, 67,
        72, 73, 68,
        73, 69, 68,
        73, 74, 69,
        74, 70, 69,
        74, 75, 70,
        75, 71, 70,
        75, 76, 71,
        77, 73, 72,
        77, 78, 73,
        78, 74, 73,
        78, 79, 74,
    ];
    
    WTC6_Upper_Geo.setIndex( Indices );
    WTC6_Upper_Geo.setAttribute( 'position', new THREE.BufferAttribute( Upper_Vertices, 3 ) );
    WTC6_Upper_Geo.setAttribute( 'normal', new THREE.BufferAttribute( normals, 3 ) );
    WTC6_Upper_Geo.setAttribute( 'uv', new THREE.BufferAttribute( uvs, 2 ) );
    //const WTC6_Upper_Mat = new THREE.MeshPhongMaterial({color: 0x3127f5, side: THREE.DoubleSide});
    const WTC6_Upper_Mat = makeMaterial("Materials/default_uv.png", "Materials/default_uv.png", "Materials/default_uv.png", 1, 1);
    const WTC6_Upper_Mesh = makeShape(WTC6_Upper_Geo, WTC6_Upper_Mat, 0, -6.81, 0);
    WTC6.add(WTC6_Upper_Mesh);

    WTC6_Base_Geo.setIndex( Indices );
    WTC6_Base_Geo.setAttribute( 'position', new THREE.BufferAttribute( Base_Vertices, 3 ) );
    WTC6_Base_Geo.setAttribute( 'normal', new THREE.BufferAttribute( normals, 3 ) );
    WTC6_Base_Geo.setAttribute( 'uv', new THREE.BufferAttribute( uvs, 2 ) );
    //const WTC6_Base_Mat = new THREE.MeshPhongMaterial({color: 0x3127f5, side: THREE.DoubleSide , wireframe: false});
    const WTC6_Base_Mat = makeMaterial("Materials/default_uv.png", "Materials/default_uv.png", "Materials/default_uv.png", 1, 1);
    const WTC6_Base_Mesh = makeShape(WTC6_Base_Geo, WTC6_Base_Mat, 0, -6.81, 0);
    WTC6.add(WTC6_Base_Mesh);

    WTC_Complex.add(WTC6);
}

function Build_Millennium_NYC(){
    const tower_height = 5.88;
    const tower_width = 0.5;
    const tower_length = 1.25;

    const tower_geo = new THREE.BoxGeometry(tower_length, tower_height, tower_width); // Geometry
    const tower_mat = new THREE.MeshPhongMaterial({color: 0xffffff});
    const tower_mesh = makeShape(tower_geo, tower_mat, -0.8, -3.80, -8.65); // Make a mesh

    scene.add(tower_mesh);

}

function Build_One_Liberty_Plaza(){
    const tower_height = 7.43;
    const tower_width = 2.38;
    const tower_length = 1.63;

    const tower_geo = new THREE.BoxGeometry(tower_length, tower_height, tower_width); // Geometry
    const tower_mat = new THREE.MeshPhongMaterial({color: 0xffffff});
    const tower_mesh = makeShape(tower_geo, tower_mat, 4.1, -3, -10); // Make a mesh

    scene.add(tower_mesh);
}

function Build_Winter_Garden(){

    const atrium_height = 1.20;
    const atrium_geo = new THREE.BufferGeometry();

    const vertices = new Float32Array([
        // Floor
        -3.50, 0, 5.60,                 // v0
        -1.90, 0, 5.20,                 // v1
        -1.55, 0, 5.60,                 // v2
         1.05, 0, 4.90,                 // v3
         1.05, 0, 4.47,                 // v4
         4.25, 0, 3.25,                 // v5
         3.95, 0, 4.95,                 // v6
         3.05, 0, 5.15,                 // v7
         3.52, 0, 7.00,                 // v8
         2.50, 0, 7.30,                 // v9
         2.52, 0, 7.95,                 // v10
        -1.52, 0, 7.95,                 // v11
        -3.50, 0, 7.95,                 // v12

        // Wall
        -3.50, 0, 5.60,                 // v13
        -3.50, atrium_height, 5.60,     // v14
        -1.90, atrium_height, 5.20,     // v15
        -1.90, 0, 5.20,                 // v16

        -1.90, 0, 5.20,                 // v17
        -1.90, atrium_height, 5.20,     // v18
        -1.55, atrium_height, 5.60,     // v19
        -1.55, 0, 5.60,                 // v20

        -1.55, 0, 5.60,                 // v21
        -1.55, atrium_height, 5.60,     // v22
         1.05, atrium_height, 4.90,     // v23
         1.05, 0, 4.90,                 // v24

        1.05, 0, 4.90,                  // v25
        1.05, atrium_height, 4.90,      // v26
        1.05, atrium_height, 4.47,      // v27
        1.05, 0, 4.47,                  // v28

        1.05, 0, 4.47,                  // v29
        1.05, atrium_height, 4.47,      // v30
        4.25, atrium_height, 3.25,      // v31
        4.25, 0, 3.25,                  // v32

        4.25, 0, 3.25,                  // v33
        4.25, atrium_height, 3.25,      // v34
        3.95, atrium_height, 4.95,      // v35
        3.95, 0, 4.95,                  // v36

        3.95, 0, 4.95,                  // v37
        3.95, atrium_height, 4.95,      // v38
        3.05, atrium_height, 5.15,      // v39
        3.05, 0, 5.15,                  // v40

        3.05, 0, 5.15,                  // v41
        3.05, atrium_height, 5.15,      // v42
        3.52, atrium_height, 7.00,      // v43
        3.52, 0, 7.00,                  // v44

        3.52, 0, 7.00,                  // v45
        3.52, atrium_height, 7.00,      // v46
        2.50, atrium_height, 7.30,      // v47
        2.50, 0, 7.30,                  // v48

        2.50, 0, 7.30,                  // v49
        2.50, atrium_height, 7.30,      // v50
        2.52, atrium_height, 7.95,      // v51
        2.52, 0, 7.95,                  // v52

         2.52, 0, 7.95,                 // v53
         2.52, atrium_height, 7.95,     // v54
        -3.50, atrium_height, 7.95,     // v55
        -3.50, 0, 7.95,                 // v56

        -3.50, 0, 7.95,                 // v57
        -3.50, atrium_height, 7.95,     // v58
        -3.50, atrium_height, 5.60,     // v59
        -3.50, 0, 5.60,                 // v60

        // Roof
        -3.50, atrium_height, 5.60,     // v61
        -1.90, atrium_height, 5.20,     // v62
        -1.55, atrium_height, 5.60,     // v63
         1.05, atrium_height, 4.90,     // v64
         1.05, atrium_height, 4.47,     // v65
         4.25, atrium_height, 3.25,     // v66
         3.95, atrium_height, 4.95,     // v67
         3.05, atrium_height, 5.15,     // v68
         3.52, atrium_height, 7.00,     // v69
         2.50, atrium_height, 7.30,     // v70
         2.52, atrium_height, 7.95,     // v71
        -1.52, atrium_height, 7.95,     // v72
        -3.50, atrium_height, 7.95,     // v73
    ]);


    const normals = new Float32Array([
        // Floor
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,

        // Walls
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,

        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,

        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,

        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,

        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,

        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,

        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,

        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,

        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,

        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,

        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,

        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,

        // Roof
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
    ]);

    const uvs = new Float32Array([
        0,      0.27,
        0.24,   0.29,
        0.25,   0.27,
        0.58,   0.34,
        0.58,   0.45,
        1,      0.6,
        0.9,    0.33,
        0.8,    0.27,
        0.84,   0.12,
        0.76,   0.1,
        0.765,  0,
        0.25,   0,
        0,      0,

        0, 0,
        1, 0,
        1, 1,
        0, 1,
        
        0, 0,
        1, 0,
        1, 1,
        0, 1,
        
        0, 0,
        1, 0,
        1, 1,
        0, 1,
        
        0, 0,
        1, 0,
        1, 1,
        0, 1,
        
        0, 0,
        1, 0,
        1, 1,
        0, 1,
        
        0, 0,
        1, 0,
        1, 1,
        0, 1,
        
        0, 0,
        1, 0,
        1, 1,
        0, 1,
        
        0, 0,
        1, 0,
        1, 1,
        0, 1,
        
        0, 0,
        1, 0,
        1, 1,
        0, 1,
        
        0, 0,
        1, 0,
        1, 1,
        0, 1,
        
        0, 0,
        1, 0,
        1, 1,
        0, 1,
        
        0, 0,
        1, 0,
        1, 1,
        0, 1,
        
        0,      0.27,
        0.24,   0.29,
        0.25,   0.27,
        0.58,   0.34,
        0.58,   0.45,
        1,      0.6,
        0.9,    0.33,
        0.8,    0.27,
        0.84,   0.12,
        0.76,   0.1,
        0.765,  0,
        0.25,   0,
        0,      0,
    ]);

    const indices = [
        // Floor
        0, 1, 2,
        0, 2, 12,
        2, 3, 9,
        3, 4, 7,
        3, 7, 9,
        4, 5, 7,
        5, 6, 7,
        7, 8, 9,
        9, 10, 11,
        2, 11, 12,
        2, 9, 11,

        // Walls
        13, 14, 15,
        13, 15, 16,
        17, 18, 19,
        17, 19, 20,
        21, 22, 23,
        21, 23, 24,
        25, 26, 27,
        25, 27, 28,
        29, 30, 31,
        29, 31, 32,
        33, 34, 35,
        33, 35, 36,
        37, 38, 39,
        37, 39, 40,
        41, 42, 43,
        41, 43, 44,
        45, 46, 47,
        45, 47, 48,
        49, 50, 51,
        49, 51, 52,
        53, 54, 55,
        53, 55, 56,
        57, 58, 59,
        57, 59, 60,

        // Roof
        61, 62, 63,
        61, 63, 73,
        63, 64, 70,
        64, 65, 68,
        64, 68, 70,
        65, 66, 68,
        66, 67, 68,
        68, 69, 70,
        70, 71, 72,
        63, 72, 73,
        63, 70, 72,
    ];

    atrium_geo.setIndex(indices);
    atrium_geo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    atrium_geo.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
    atrium_geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));

    const atrium_mat = makeMaterial("Materials/default_uv.png", "Materials/default_uv.png", "Materials/default_uv.png", 1, 1);
    const atrium_mesh = makeShape(atrium_geo, atrium_mat, 0, -6.81, 0);
    Brookfield_Place.add(atrium_mesh);


    const glass_roof_radius = 0.25;
    const glass_roof_length = 1.5;

    const glass_roof_geo = new THREE.CapsuleGeometry(glass_roof_radius, glass_roof_length, 10, 20, 1);
    const glass_roof_mat = new THREE.MeshPhongMaterial({color: 0x00ffff}); // Material
    const glass_roof_mesh = makeShape(glass_roof_geo, glass_roof_mat, 0, -6.81 + atrium_height, 6.95);
    glass_roof_mesh.rotation.x = 1.57;
    Brookfield_Place.add(glass_roof_mesh);

    // Add First Tower
    const tower1 = new THREE.Group();

    const tower1_geo = new THREE.CylinderGeometry(0.7, 0.7, atrium_height + 0.01, 8);
    const tower1_mat = new THREE.MeshPhongMaterial({color:0x0037ff});
    const tower1_mesh = makeShape(tower1_geo, tower1_mat, 0, 0, 0);
    tower1_mesh.rotation.y = 0.3926991;
    tower1.add(tower1_mesh);
    
    const tower1_dome_geo = new THREE.CylinderGeometry(0.3, 0.6, 0.3, 20);
    const tower1_dome_mat = new THREE.MeshPhongMaterial({color:0x31e896});
    const tower1_dome_mesh = makeShape(tower1_dome_geo, tower1_dome_mat, 0, (atrium_height / 2) + 0.1, 0);
    tower1.add(tower1_dome_mesh);
    tower1.position.x = 4.15;
    tower1.position.y = -6.81 + atrium_height - (atrium_height / 2);
    tower1.position.z = 3.85;

    Brookfield_Place.add(tower1);
}

function Build_BP2(){
    const BP2 = new THREE.Group();
    const tower_height = 6.45;
    const inner_core_length = 1.5;
    const outer_core_height = tower_height - (0.14 * 4);
    const sleeve_height = 3.66;
    const window_length = 0.1;

    // Inner Core
    const inner_core_geo = new THREE.BoxGeometry(inner_core_length, tower_height, inner_core_length);
    const inner_core_mat = new THREE.MeshPhongMaterial({color: 0x00ffff});
    const inner_core_mesh = makeShape(inner_core_geo, inner_core_mat, 0, 0, 0);
    BP2.add(inner_core_mesh);

    // Outer Core
    const outer_core_length = inner_core_length + (window_length * 3);
    const outer_core_geo = new THREE.BoxGeometry(outer_core_length, outer_core_height, outer_core_length);
    const outer_core_mat = new THREE.MeshPhongMaterial({color: 0xff0000});
    const outer_core_mesh = makeShape(outer_core_geo, outer_core_mat, 0, -0.32, 0);
    BP2.add(outer_core_mesh);

    // Sleeve (Base of BP2) (Simplified for now)
    const sleeve_length = outer_core_length + (window_length * 2);
    const sleeve_geo = new THREE.BoxGeometry(sleeve_length, sleeve_height, sleeve_length);
    const sleeve_mat = new THREE.MeshPhongMaterial({color:0x000fff});
    const sleeve_mesh = makeShape(sleeve_geo, sleeve_mat, 0, -1.433, 0);
    BP2.add(sleeve_mesh);

    // Dome
    const dome_radius = inner_core_length / 2;
    const dome_geo = new THREE.SphereGeometry(dome_radius, 16, 24);
    const dome_mat = new THREE.MeshPhongMaterial({color:0x31e896});
    const dome_mesh = makeShape(dome_geo, dome_mat, 0, (tower_height / 2) - 0.25, 0);
    BP2.add(dome_mesh);

    BP2.rotation.y = 0.3;

    BP2.position.x = 2;
    BP2.position.y = (-tower_height / 2) - 0.32;
    BP2.position.z = 5.8;

    Brookfield_Place.add(BP2);
}

function Build_BP1(){
    const BP1 = new THREE.Group();
    const tower_height = 5.77;
    const inner_core_length = 1.2;
    const outer_core_height = tower_height - (0.14 * 4);
    const sleeve_height = 3.66;
    const base_height = 1.2;
    const window_length = 0.1;
    
    // Base
    const base_length = inner_core_length + (window_length * 6);
    const base_geo = new THREE.BoxGeometry(base_length, base_height, base_length);
    const base_mat = new THREE.MeshPhongMaterial({color: 0x00ffff});
    const base_mesh = makeShape(base_geo, base_mat, 0, (-tower_height / 2) + 0.4, 0);
    BP1.add(base_mesh);

    // Inner Core
    const inner_core_geo = new THREE.BoxGeometry(inner_core_length, tower_height, inner_core_length);
    const inner_core_mat = new THREE.MeshPhongMaterial({color: 0x00ffff});
    const inner_core_mesh = makeShape(inner_core_geo, inner_core_mat, 0, 0, 0);
    BP1.add(inner_core_mesh);

    // Outer Core
    const outer_core_length = inner_core_length + (window_length * 3);
    const outer_core_geo = new THREE.BoxGeometry(outer_core_length, outer_core_height, outer_core_length);
    const outer_core_mat = new THREE.MeshPhongMaterial({color: 0xff0000});
    const outer_core_mesh = makeShape(outer_core_geo, outer_core_mat, 0, -0.32, 0);
    BP1.add(outer_core_mesh);

    // Sleeve (Base of BP1) (Simplified for now)
    const sleeve_length = outer_core_length + (window_length * 2);
    const sleeve_geo = new THREE.BoxGeometry(sleeve_length, sleeve_height, sleeve_length);
    const sleeve_mat = new THREE.MeshPhongMaterial({color:0x000fff});
    const sleeve_mesh = makeShape(sleeve_geo, sleeve_mat, 0, -1.15, 0);
    BP1.add(sleeve_mesh);

    // Pyramid
    const pyramid_radius = inner_core_length / 2;
    const pyramid_geo = new THREE.CylinderGeometry(0.5, inner_core_length - (window_length * 4), 0.4, 4);
    const pyramid_mat = new THREE.MeshPhongMaterial({color:0x31e896});
    const pyramid_mesh = makeShape(pyramid_geo, pyramid_mat, 0, (tower_height / 2) + 0.2, 0);
    pyramid_mesh.rotation.y = 0.785398;
    BP1.add(pyramid_mesh);

    // Add More Base parts
    const left_base_geo = new THREE.BoxGeometry(0.8, base_height, 1.25);
    const left_base_mat = new THREE.MeshPhongMaterial({color:0x0037ff});
    const left_base_mesh = makeShape(left_base_geo, left_base_mat, -1.23, (-tower_height / 2) + 0.4, 0);
    BP1.add(left_base_mesh);

    const parking_lot_geo = new THREE.BoxGeometry(0.8, 0.14, 1.5);
    const parking_lot_mat = new THREE.MeshPhongMaterial({color:0x0037ff});
    const parking_lot_mesh = makeShape(parking_lot_geo, parking_lot_mat, 1.23, (-tower_height / 2) - 0.15, 0);
    BP1.add(parking_lot_mesh);

    BP1.rotation.y = 0.3;

    BP1.position.x = 8.25;
    BP1.position.y = (-tower_height / 2) - 0.85;
    BP1.position.z = 2.8;

    // Add Second Tower
    const tower2 = new THREE.Group();

    const tower2_geo = new THREE.CylinderGeometry(0.7, 0.7, base_height + 0.01, 8);
    const tower2_mat = new THREE.MeshPhongMaterial({color:0x0037ff});
    const tower2_mesh = makeShape(tower2_geo, tower2_mat, 0, 0, 0);
    tower2_mesh.rotation.y = 0.3926991;
    tower2.add(tower2_mesh);
    
    const tower2_dome_geo = new THREE.CylinderGeometry(0.3, 0.6, 0.3, 20);
    const tower2_dome_mat = new THREE.MeshPhongMaterial({color:0x31e896});
    const tower2_dome_mesh = makeShape(tower2_dome_geo, tower2_dome_mat, 0, (base_height / 2) + 0.1, 0);
    tower2.add(tower2_dome_mesh);
    tower2.position.x = 6.47;
    tower2.position.y = -6.81 + base_height - (base_height / 2);
    tower2.position.z = 3.65;

    Brookfield_Place.add(tower2);

    Brookfield_Place.add(BP1);
}

function Build_Gateway_Tower(){
    const gateway_tower = new THREE.Group();
    const building_height = 2.96;
    const body_height = building_height - (0.0871 * 4);

    const body_geo = new THREE.BoxGeometry(1.05, body_height, 1.175);
    const body_mat = new THREE.MeshPhongMaterial({color:0x0037ff});
    const body_mesh = makeShape(body_geo, body_mat, 0, 0, 0);
    gateway_tower.add(body_mesh);

    const penthouse_geo = new THREE.BufferGeometry();

    const vertices = new Float32Array([
        // Wall
        -0.525, body_height - (body_height / 2), 0.3,               // v0
        -0.525, building_height - (building_height / 2), 0.3,       // v1
        -0.525, building_height - (building_height / 2), -0.3,      // v2
        -0.525, body_height - (body_height / 2), -0.3,              // v3

        -0.525, body_height - (body_height / 2), -0.3,              // v4
        -0.525, building_height - (building_height / 2), -0.3,      // v5
        -0.15, building_height - (building_height / 2), -0.3,       // v6
        -0.15, body_height - (body_height / 2), -0.3,               // v7

        -0.15, body_height - (body_height / 2), -0.3,               // v8
        -0.15, building_height - (building_height / 2), -0.3,       // v9
        -0.15, building_height - (building_height / 2), -0.5875,    // v10
        -0.15, body_height - (body_height / 2), -0.5875,            // v11

        -0.15, body_height - (body_height / 2), -0.5875,            // v12
        -0.15, building_height - (building_height / 2), -0.5875,    // v13
        0.15, building_height - (building_height / 2), -0.5875,     // v14
        0.15, body_height - (body_height / 2), -0.5875,             // v15

        0.15, body_height - (body_height / 2), -0.5875,             // v16
        0.15, building_height - (building_height / 2), -0.5875,     // v17
        0.15, building_height - (building_height / 2), -0.3,        // v18
        0.15, body_height - (body_height / 2), -0.3,                // v19

        0.15, body_height - (body_height / 2), -0.3,                // v20
        0.15, building_height - (building_height / 2), -0.3,        // v21
        0.525, building_height - (building_height / 2), -0.3,       // v22
        0.525, body_height - (body_height / 2), -0.3,               // v23

        0.525, body_height - (body_height / 2), -0.3,               // v24
        0.525, building_height - (building_height / 2), -0.3,       // v25
        0.525, building_height - (building_height / 2), 0.3,        // v26
        0.525, body_height - (body_height / 2), 0.3,                // v27

        0.525, body_height - (body_height / 2), 0.3,                // v28
        0.525, building_height - (building_height / 2), 0.3,        // v29
        0.15, building_height - (building_height / 2), 0.3,         // v30
        0.15, body_height - (body_height / 2), 0.3,                 // v31

        0.15, body_height - (body_height / 2), 0.3,                 // v32
        0.15, building_height - (building_height / 2), 0.3,         // v33
        0.15, building_height - (building_height / 2), 0.5875,      // v34
        0.15, body_height - (body_height / 2), 0.5875,              // v35

        0.15, body_height - (body_height / 2), 0.5875,              // v36
        0.15, building_height - (building_height / 2), 0.5875,      // v37
        -0.15, building_height - (building_height / 2), 0.5875,     // v38
        -0.15, body_height - (body_height / 2), 0.5875,             // v39

        -0.15, body_height - (body_height / 2), 0.5875,             // v40
        -0.15, building_height - (building_height / 2), 0.5875,     // v41
        -0.15, building_height - (building_height / 2), 0.3,        // v42
        -0.15, body_height - (body_height / 2), 0.3,                // v43

        -0.15, body_height - (body_height / 2), 0.3,                // v44
        -0.15, building_height - (building_height / 2), 0.3,        // v45
        -0.525, building_height - (building_height / 2), 0.3,       // v46
        -0.525, body_height - (body_height / 2), 0.3,               // v47

        // Roof
        -0.525, building_height - (building_height / 2), 0.3,       // v48
        -0.525, building_height - (building_height / 2), -0.3,      // v49
        -0.15, building_height - (building_height / 2), -0.3,       // v50
        -0.15, building_height - (building_height / 2), -0.5875,    // v51
        0.15, building_height - (building_height / 2), -0.5875,     // v52
        0.15, building_height - (building_height / 2), -0.3,        // v53
        0.525, building_height - (building_height / 2), -0.3,       // v54
        0.525, building_height - (building_height / 2), 0.3,        // v55
        0.15, building_height - (building_height / 2), 0.3,         // v56
        0.15, building_height - (building_height / 2), 0.5875,      // v57
        -0.15, building_height - (building_height / 2), 0.5875,     // v58
        -0.15, building_height - (building_height / 2), 0.3,        // v59
    ]);

    // TODO:
    // Normals and UV Mapping for Penthouse


    const normals = new Float32Array([
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,

        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,

        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,

        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,

        0, 0, -1,
        0, 0, -1,
        0, 0, -1,
        0, 0, -1,

        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,

        0, 0, -1,
        0, 0, -1,
        0, 0, -1,
        0, 0, -1,

        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,

        0, 0, -1,
        0, 0, -1,
        0, 0, -1,
        0, 0, -1,

        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,

        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,

        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,

        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0, 
    ]);

    const uvs = new Float32Array([
        0, 0,
        1, 0,
        1, 1,
        0, 1,

        0, 0,
        1, 0,
        1, 1,
        0, 1,

        0, 0,
        1, 0,
        1, 1,
        0, 1,

        0, 0,
        1, 0,
        1, 1,
        0, 1,

        0, 0,
        1, 0,
        1, 1,
        0, 1,

        0, 0,
        1, 0,
        1, 1,
        0, 1,

        0, 0,
        1, 0,
        1, 1,
        0, 1,

        0, 0,
        1, 0,
        1, 1,
        0, 1,

        0, 0,
        1, 0,
        1, 1,
        0, 1,

        0, 0,
        1, 0,
        1, 1,
        0, 1,

        0, 0,
        1, 0,
        1, 1,
        0, 1,

        0, 0,
        1, 0,
        1, 1,
        0, 1,

        0, 0.25,
        0, 0.75,
        0.3, 0.75,
        0.3, 1,
        0.6, 1,
        0.6, 0.75,
        1, 0.75,
        1, 0.25,
        0.6, 0.25,
        0.6, 0,
        0.3, 0,
        0.3, 0.25,
    ]);

    const indices = [
        0, 1, 2,
        0, 2, 3,
        4, 5, 6,
        4, 6, 7,
        8, 9, 10,
        8, 10, 11,
        12, 13, 14,
        12, 14, 15,
        16, 17, 18,
        16, 18, 19,
        20, 21, 22,
        20, 22, 23,
        24, 25, 26,
        24, 26, 27,
        28, 29, 30,
        28, 30, 31,
        32, 33, 34,
        32, 34, 35,
        36, 37, 38,
        36, 38, 39,
        40, 41, 42,
        40, 42, 43,
        44, 45, 46,
        44, 46, 47,

        48, 49, 50,
        50, 59, 48,
        50, 51, 52,
        52, 53, 50,
        53, 54, 55,
        55, 56, 53,
        56, 57, 58,
        58, 59, 56,
        50, 53, 59,
        53, 56, 59,
    ];

    penthouse_geo.setIndex(indices);
    penthouse_geo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    penthouse_geo.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
    penthouse_geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));

    const penthouse_mat = makeMaterial("Materials/default_uv.png", "Materials/default_uv.png", "Materials/default_uv.png", 1, 1);
    const penthouse_mesh = makeShape(penthouse_geo, penthouse_mat, 0, 0, 0);
    gateway_tower.add(penthouse_mesh);

    gateway_tower.position.x = 6.55
    gateway_tower.position.y = -building_height - (building_height/2) - 1.1;
    gateway_tower.position.z = 6.05;

    gateway_tower.rotation.y = 0.2618

    scene.add(gateway_tower);
}

function Build_Manhattan_Island(){
    const Manhattan_Geo = new THREE.BufferGeometry();
    const height = 1;

    const vertices = new Float32Array([
        0, 0, 9.25,         // v0
        1, 0, 12.25,        // v1
        -15, 0, 18.50,      // v2
        -18.5, 0, 10,       // v3
        -18.5, 0, -21,      // v4
        19, 0, -21,         // v5
        19, 0, 4.15,        // v6
        19.25, 0, 6,        // v7
        5, 0, 10.75,        // v8
        4, 0, 8,            // v9
    ]);

    const normals = new Float32Array([
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
    ]);

    const uvs = new Float32Array([
        0.479, 0.24,
        0.504, 0.165,
        0.1, 0,
        0, 0.23,
        0, 1,
        0.91, 1,
        0.91, 0.375,
        0.915, 0.34,
        0.59, 0.2,
        0.57, 0.27,
    ]);

    const indices = [
        0, 1, 2,
        0, 2, 3,
        0, 3, 4,
        0, 4, 5,
        0, 5, 9,
        5, 6, 9,
        6, 7, 8,
        6, 8, 9,
    ];

    Manhattan_Geo.setIndex(indices);
    Manhattan_Geo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    Manhattan_Geo.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
    Manhattan_Geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));

    const Manhattan_Mat = makeMaterial("Materials/default_uv.png", "Materials/default_uv.png", "Materials/default_uv.png", 1, 1);
    const Manhattan_Mesh = makeShape(Manhattan_Geo, Manhattan_Mat, 0, -6.8, 0);
    scene.add(Manhattan_Mesh);
}


// -- HELPER FUNCTIONS --

function makeShape(geo, mat, x, y, z){
    const shape = new THREE.Mesh(geo, mat);
    shape.position.x = x;
    shape.position.y = y;
    shape.position.z = z;

    return shape; // Mesh is only returned, as add() is used to parent objects not only to the scene, but also eachother
}

function makeMaterial(albedoSource, normalSource, aoSource, tileX, tileY){
    const albedoTex = makeTexture(albedoSource, tileX, tileY);
    const normalTex = makeTexture(normalSource, tileX, tileY);
    const aoTex = makeTexture(aoSource, tileX, tileY);
    //const specularTex = makeTexture(specularSource, tileX, tileY);

    var mat = new THREE.MeshStandardMaterial({map: albedoTex, side: THREE.DoubleSide});

    return mat;
}

function makeTexture(source, tileX, tileY){
    const texture = new THREE.TextureLoader().load(source);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.NearestFilter;
    //texture.minFilter = THREE.NearestFilter;
    texture.repeat.set(tileX, tileY);

    return texture;
}

main();