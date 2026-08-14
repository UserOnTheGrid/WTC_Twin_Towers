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
    Build_WTC6();

    scene.add(WTC_Complex);

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
    const tower_geo = new THREE.BoxGeometry(tower_width, tower_height, tower_depth); // Geometry
    // const tower_mat = new THREE.MeshPhongMaterial({color: 0x00ffff}); // Material
    const loader = new THREE.TextureLoader();
    const tower_mat = [
        new THREE.MeshStandardMaterial({map: loadColorTexture("Materials/default_texture.png"), side: THREE.DoubleSide}),
        new THREE.MeshStandardMaterial({map: loadColorTexture("Reference_Image.JPG"), side: THREE.DoubleSide}),
        new THREE.MeshStandardMaterial({map: loadColorTexture("Materials/default_texture.png"), side: THREE.DoubleSide}),
        new THREE.MeshStandardMaterial({map: loadColorTexture("Reference_Image.JPG"), side: THREE.DoubleSide}),
        new THREE.MeshStandardMaterial({map: loadColorTexture("Materials/default_texture.png"), side: THREE.DoubleSide}),
        new THREE.MeshStandardMaterial({map: loadColorTexture("Reference_Image.JPG"), side: THREE.DoubleSide}),
    ];

    function loadColorTexture( path ) {
        const texture = loader.load( path );
        texture.colorSpace = THREE.SRGBColorSpace;
        return texture;
    }


    const tower1_mesh = makeShape(tower_geo, tower_mat, 0, 0, 0); // Make a cube mesh
    const tower2_mesh = makeShape(tower_geo, tower_mat, 3.25, 0, -2.25); // Make a cube mesh

    // WTC1 Antenna
    const antenna_height = 3.60;
    const antenna_radius = 0.1;
    const antenna_geo = new THREE.CylinderGeometry(antenna_radius, antenna_radius, antenna_height, 32);
    //const antenna_mat = new THREE.MeshPhongMaterial({color: 0xffffff});
    const antenna_mat = makeMaterial("Materials/default_texture.png", "Materials/default_texture.png", "Materials/default_texture.png", 1, 1);
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
        -3.10, base_height, -6.25,  // v19
        -3.10, upper_height, -6.25, // v20
        -3.10, upper_height, -6.50, // v21
        -3.10, base_height, -6.50,  // v22

        -3.10, base_height, -6.50,  // v23
        -3.10, upper_height, -6.50,  // v24
        -1.65, upper_height, -6.50,  // v25
        -1.65, base_height, -6.50,  // v26

        -1.65, base_height, -6.50,  // v27
        -1.65, upper_height, -6.50, // v28
        -1.65, upper_height, -6.25, // v29
        -1.65, base_height, -6.25,  // v30

        -1.65, base_height, -6.25,  // v31
        -1.65, upper_height, -6.25,  // v32
        -0.15, upper_height, -6.25,  // v33
        -0.15, base_height, -6.25,  // v34

        -0.15, base_height, -6.25,  // v35
        -0.15, upper_height, -6.25, // v36
        -0.15, upper_height, -4.75, // v37
        -0.15, base_height, -4.75,  // v38

        -0.15, base_height, -4.75,  // v39
        -0.15, upper_height, -4.75,  // v40
        -1.65, upper_height, -4.75,  // v41
        -1.65, base_height, -4.75,  // v42

        -1.65, base_height, -4.75,  // v43
        -1.65, upper_height, -4.75, // v44
        -1.65, upper_height, -4.40, // v45
        -1.65, base_height, -4.40,  // v46

        -1.65, base_height, -4.40,  // v47
        -1.65, upper_height, -4.40,  // v48
        -1.65, upper_height, -4.10,  // v49
        -1.65, base_height, -4.10,  // v50

        -1.65, base_height, -4.10,  // v51
        -1.65, upper_height, -4.10, // v52
        -1.40, upper_height, -4.10, // v53
        -1.40, base_height, -4.10,  // v54

        -1.40, base_height, -4.10,  // v55
        -1.40, upper_height, -4.10,  // v56
        -1.40, upper_height, -2.25,  // v57
        -1.40, base_height, -2.25,  // v58

        -1.40, base_height, -2.25,  // v59
        -1.40, upper_height, -2.25, // v60
        -1.65, upper_height, -2.25, // v61
        -1.65, base_height, -2.25,  // v62

        -1.65, base_height, -2.25,  // v63
        -1.65, upper_height, -2.25,  // v64
        -3.10, upper_height, -2.25,  // v65
        -3.10, base_height, -2.25,  // v66

        -3.10, base_height, -2.25,  // v67
        -3.10, upper_height, -2.25, // v68
        -3.40, upper_height, -2.25, // v69
        -3.40, base_height, -2.25,  // v70

        -3.40, base_height, -2.25,  // v71
        -3.40, upper_height, -2.25,  // v72
        -3.40, upper_height, -4.10,  // v73
        -3.40, base_height, -4.10,  // v74

        -3.40, base_height, -4.10,  // v75
        -3.40, upper_height, -4.10, // v76
        -3.40, upper_height, -4.40, // v77
        -3.40, base_height, -4.40,  // v78

        -3.40, base_height, -4.40,  // v79
        -3.40, upper_height, -4.40,  // v80
        -3.10, upper_height, -4.40,  // v81
        -3.10, base_height, -4.40,  // v82

        -3.10, base_height, -4.40,  // v83
        -3.10, upper_height, -4.40, // v84
        -3.10, upper_height, -4.75, // v85
        -3.10, base_height, -4.75,  // v86

        -3.10, base_height, -4.75,  // v87
        -3.10, upper_height, -4.75,  // v88
        -3.10, upper_height, -6.25,  // v89
        -3.10, base_height, -6.25,  // v90


        // Roof
        -3.10, upper_height, -6.25, // v91
        -3.10, upper_height, -6.50, // v92
        -1.65, upper_height, -6.50, // v93
        -1.65, upper_height, -6.25, // v94
        -0.15, upper_height, -6.25, // v95
        -0.15, upper_height, -4.75, // v96
        -1.65, upper_height, -4.75, // v97
        -1.65, upper_height, -4.40, // v98
        -1.65, upper_height, -4.10, // v99
        -1.40, upper_height, -4.10, // v100
        -1.40, upper_height, -2.25, // v101
        -1.65, upper_height, -2.25, // v102
        -3.10, upper_height, -2.25, // v103
        -3.10, upper_height, -4.10, // v104
        -3.40, upper_height, -2.25, // v105
        -3.40, upper_height, -4.10, // v106
        -3.40, upper_height, -4.40, // v107
        -3.10, upper_height, -4.40, // v108
        -3.10, upper_height, -4.75, // v109
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
        -3.10 + diff, 0, -6.25 + diff,  // v19
        -3.10 + diff, base_height, -6.25 + diff, // v20
        -3.10 + diff, base_height, -6.50 + diff, // v21
        -3.10 + diff, 0, -6.50 + diff,  // v22

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
        -1.65 - diff, base_height, -4.40 + diff, // v45
        -1.65 - diff, 0, -4.40 + diff,  // v46

        -1.65 - diff, 0, -4.40 + diff,  // v47
        -1.65 - diff, base_height, -4.40 + diff,  // v48
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
        -1.65 - diff, base_height, -2.25 - diff, // v61
        -1.65 - diff, 0, -2.25 - diff,  // v62

        -1.65 - diff, 0, -2.25 - diff,  // v63
        -1.65 - diff, base_height, -2.25 - diff,  // v64
        -3.10 + diff, base_height, -2.25 - diff,  // v65
        -3.10 + diff, 0, -2.25 - diff,  // v66

        -3.10 + diff, 0, -2.25 - diff,  // v67
        -3.10 + diff, base_height, -2.25 - diff, // v68
        -3.40 + diff, base_height, -2.25 - diff, // v69
        -3.40 + diff, 0, -2.25 - diff,  // v70

        -3.40 + diff, 0, -2.25 - diff,  // v71
        -3.40 + diff, base_height, -2.25 - diff,  // v72
        -3.40 + diff, base_height, -4.10 + diff,  // v73
        -3.40 + diff, 0, -4.10 + diff,  // v74

        -3.40 + diff, 0, -4.10 + diff,  // v75
        -3.40 + diff, base_height, -4.10 + diff, // v76
        -3.40 + diff, base_height, -4.40 + diff, // v77
        -3.40 + diff, 0, -4.40 + diff,  // v78

        -3.40 + diff, 0, -4.40 + diff,  // v79
        -3.40 + diff, base_height, -4.40 + diff,  // v80
        -3.10 + diff, base_height, -4.40 + diff,  // v81
        -3.10 + diff, 0, -4.40 + diff,  // v82

        -3.10 + diff, 0, -4.40 + diff,  // v83
        -3.10 + diff, base_height, -4.40 + diff, // v84
        -3.10 + diff, base_height, -4.75 - diff, // v85
        -3.10 + diff, 0, -4.75 - diff,  // v86

        -3.10 + diff, 0, -4.75 - diff,  // v87
        -3.10 + diff, base_height, -4.75 - diff,  // v88
        -3.10 + diff, base_height, -6.25 + diff,  // v89
        -3.10 + diff, 0, -6.25 + diff,  // v90


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
        67, 68, 69,
        67, 69, 70,
        71, 72, 73,
        71, 73, 74,
        75, 76, 77,
        75, 77, 78,
        79, 80, 81,
        79, 81, 82,
        83, 84, 85,
        83, 85, 86,
        87, 88, 89,
        87, 89, 90,

        // roof
        91, 92, 93,
        91, 93, 94,
        94, 95, 96,
        94, 96, 97,
        99, 100, 101,
        99, 101, 102,
        103, 104, 99,
        103, 99, 102,
        105, 106, 104,
        105, 104, 103,
        106, 107, 108,
        106, 108, 104,
        104, 108, 98,
        104, 98, 99,
        108, 109, 97,
        108, 97, 98,
        109, 91, 94,
        109, 94, 97,
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

// -- HELPER FUNCTIONS --

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
    texture.repeat.set(tileX, tileY);

    return texture;
}

main();