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
    var upper_height = 0.78;
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
    //const WTC5_Upper_Mat = new THREE.MeshPhongMaterial({color: 0x3127f5, side: THREE.DoubleSide});
    const WTC5_Upper_Mat = makeMaterial("Materials/default_texture.png", "Materials/default_texture.png", "Materials/default_texture.png", 1, 1);
    const WTC5_Upper_Mesh = makeShape(WTC5_Upper_Geo, WTC5_Upper_Mat, 0, -6.81, 0);
    WTC5.add(WTC5_Upper_Mesh);

    WTC5_Base_Geo.setIndex( Indices );
    WTC5_Base_Geo.setAttribute( 'position', new THREE.BufferAttribute( Base_Vertices, 3 ) );
    WTC5_Base_Geo.setAttribute( 'normal', new THREE.BufferAttribute( Base_Vertices, 3 ) );
    //const WTC5_Base_Mat = new THREE.MeshPhongMaterial({color: 0x3127f5, side: THREE.DoubleSide});
    const WTC5_Base_Mat = makeMaterial("Materials/default_texture.png", "Materials/default_texture.png", "Materials/default_texture.png", 1, 1);
    const WTC5_Base_Mesh = makeShape(WTC5_Base_Geo, WTC5_Base_Mat, 0, -6.81, 0);
    WTC5.add(WTC5_Base_Mesh);

    WTC_Complex.add(WTC5);
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