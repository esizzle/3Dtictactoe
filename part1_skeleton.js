
main();

/************************************
 * MAIN
 ************************************/


function main() {

    console.log("Setting up the canvas");

    // Find the canavas tag in the HTML document
    const canvas = document.querySelector("#assignmentCanvas");

    
    // Set the canvas width and height (this can be adjusted to any size you want)
    canvas.width = window.innerWidth; // Set to window width, for example
    canvas.height = window.innerHeight; // Set to window height, for example

    // Initialize the WebGL2 context
    var gl = canvas.getContext("webgl2");

    // Only continue if WebGL2 is available and working
    if (gl === null) {
        printError('WebGL 2 not supported by your browser',
            'Check to see you are using a <a href="https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API#WebGL_2_2" class="alert-link">modern browser</a>.');
        return;
    }

    // Set WebGL viewport to match canvas size
    gl.viewport(0, 0, canvas.width, canvas.height);


    // Hook up the button
    const fileUploadButton = document.querySelector("#fileUploadButton");
    fileUploadButton.addEventListener("click", () => {
        console.log("Submitting file...");
        let fileInput = document.getElementById('inputFile');
        let files = fileInput.files;
        let url = URL.createObjectURL(files[0]);

        fetch(url, {
            mode: 'no-cors' // 'cors' by default
        }).then(res => {
            return res.text();
        }).then(data => {
            var inputTriangles = JSON.parse(data);

            doDrawing(gl, canvas, inputTriangles);

        }).catch((e) => {
            console.error(e);
        });

    });
    const framework = {
        beams: []
      };
      
      const gridSize = 3; // 3x3x3 grid
      const spacing = 1.5; // Distance between grid points
      const thickness = 0.2; // Thickness of the beams
      
      // Function to create a cuboid beam between two points
      function createCuboid(x1, y1, z1, x2, y2, z2, thickness, color) {
        const halfThickness = thickness / 2;
      
        // Vector for direction of the beam
        const dx = x2 - x1;
        const dy = y2 - y1;
        const dz = z2 - z1;
      
        // Normalize direction to find offsets for thickness
        const length = Math.sqrt(dx * dx + dy * dy + dz * dz);
        const ux = dx / length;
        const uy = dy / length;
        const uz = dz / length;
      
        // Perpendicular offsets for thickness (cross product logic for 3D)
        const offsetX = halfThickness * (uy || 1); // Use Y-axis for cross-product
        const offsetY = halfThickness * (uz || 1); // Use Z-axis for cross-product
        const offsetZ = halfThickness * (ux || 1); // Use X-axis for cross-product
      
        return {
          material: { diffuse: color },
          vertices: [
            [x1 - offsetX, y1 - offsetY, z1 - offsetZ], // Bottom-left start
            [x1 + offsetX, y1 + offsetY, z1 + offsetZ], // Bottom-right start
            [x2 + offsetX, y2 + offsetY, z2 + offsetZ], // Bottom-right end
            [x2 - offsetX, y2 - offsetY, z2 - offsetZ], // Bottom-left end
            [x1 - offsetX, y1 - offsetY, z1 + offsetZ], // Top-left start
            [x1 + offsetX, y1 + offsetY, z1 + offsetZ], // Top-right start
            [x2 + offsetX, y2 + offsetY, z2 + offsetZ], // Top-right end
            [x2 - offsetX, y2 - offsetY, z2 + offsetZ], // Top-left end
          ],
          triangles: [
            [0, 1, 2], [0, 2, 3], // Bottom face
            [4, 5, 6], [4, 6, 7], // Top face
            [0, 1, 5], [0, 5, 4], // Front face
            [2, 3, 7], [2, 7, 6], // Back face
            [0, 3, 7], [0, 7, 4], // Left face
            [1, 2, 6], [1, 6, 5], // Right face
          ]
        };
      }
      
      // Generate the 3D grid framework
      for (let x = 0; x <= gridSize; x++) {
        for (let y = 0; y <= gridSize; y++) {
          for (let z = 0; z <= gridSize; z++) {
            // Add horizontal beams (X-axis)
            if (x < gridSize) {
              framework.beams.push(
                createCuboid(
                  x * spacing, y * spacing, z * spacing,
                  (x + 1) * spacing, y * spacing, z * spacing,
                  thickness,
                  [0.4, 0.2, 0.1]
                )
              );
            }
      
            // Add vertical beams (Y-axis)
            if (y < gridSize) {
              framework.beams.push(
                createCuboid(
                  x * spacing, y * spacing, z * spacing,
                  x * spacing, (y + 1) * spacing, z * spacing,
                  thickness,
                  [0.4, 0.2, 0.1]
                )
              );
            }
      
            // Add depth beams (Z-axis)
            if (z < gridSize) {
              framework.beams.push(
                createCuboid(
                  x * spacing, y * spacing, z * spacing,
                  x * spacing, y * spacing, (z + 1) * spacing,
                  thickness,
                  [0.4, 0.2, 0.1]
                )
              );
            }
          }
        }
      }
      const floorObject = {
        material: {
            ambient: [0.02, 0.02, 0.1],
            diffuse: [0.02, 0.02, 0.1],
            specular: [0, 0, 0],
            n: 1
        },
        vertices: [
            [-10.0, -0.1, -10.0],  // Bottom-left
            [10.0, -0.1, -10.0],   // Bottom-right
            [10.0, -0.1, 10.0],    // Top-right
            [-10.0, -0.1, 10.0]    // Top-left
        ],
        triangles: [
            [0, 1, 2], // First triangle
            [0, 2, 3]  // Second triangle
        ]
    };
    

    const frontWall = {
        material: {
            ambient: [0.1, 0.1, 0.1],
            diffuse: [0.6, 0.2, 0.2],
            specular: [0.3, 0.3, 0.3],
            n: 10
        },
        vertices: [
            [-10.0, -0.1, -10.0], // Bottom-left
            [10.0, -0.1, -10.0],  // Bottom-right
            [10.0, 2.0, -10.0],   // Top-right
            [-10.0, 2.0, -10.0]   // Top-left
        ],
        triangles: [
            [0, 1, 2], // First triangle
            [0, 2, 3]  // Second triangle
        ]
    };
    
    // Back wall
    const backWall = {
        material: {
            ambient: [0.1, 0.1, 0.1],
            diffuse: [0.6, 0.2, 0.2],
            specular: [0.3, 0.3, 0.3],
            n: 10
        },
        vertices: [
            [-10.0, -0.1, 10.0],  // Bottom-left
            [10.0, -0.1, 10.0],   // Bottom-right
            [10.0, 2.0, 10.0],    // Top-right
            [-10.0, 2.0, 10.0]    // Top-left
        ],
        triangles: [
            [0, 1, 2], // First triangle
            [0, 2, 3]  // Second triangle
        ]
    };
    
    // Left wall
    const leftWall = {
        material: {
            ambient: [0.1, 0.1, 0.1],
            diffuse: [0.2, 0.6, 0.2],
            specular: [0.3, 0.3, 0.3],
            n: 10
        },
        vertices: [
            [-10.0, -0.1, -10.0], // Bottom-left
            [-10.0, -0.1, 10.0],  // Bottom-right
            [-10.0, 2.0, 10.0],   // Top-right
            [-10.0, 2.0, -10.0]   // Top-left
        ],
        triangles: [
            [0, 1, 2], // First triangle
            [0, 2, 3]  // Second triangle
        ]
    };
    
    // Right wall
    const rightWall = {
        material: {
            ambient: [0.1, 0.1, 0.1],
            diffuse: [0.2, 0.6, 0.2],
            specular: [0.3, 0.3, 0.3],
            n: 10
        },
        vertices: [
            [10.0, -0.1, -10.0],  // Bottom-left
            [10.0, -0.1, 10.0],   // Bottom-right
            [10.0, 2.0, 10.0],    // Top-right
            [10.0, 2.0, -10.0]    // Top-left
        ],
        triangles: [
            [0, 1, 2], // First triangle
            [0, 2, 3]  // Second triangle
        ]
    };
    
    // Push walls to framework.beams
    framework.beams.push(floorObject,frontWall, backWall, leftWall, rightWall);

    const cornerCubePositions = [
    [-10.0, -0.1, -10.0],  // Front-left
    [10.0, -0.1, -10.0],   // Front-right
    [-10.0, -0.1, 10.0],   // Back-left
    [10.0, -0.1, 10.0]     // Back-right
];

const cubeSize = 5;  
    cornerCubePositions.forEach(position => {
        const cubeObject = {
            material: {
                ambient: [0.2, 0.2, 0.2],
                diffuse: [0.7, 0.2, 0.9],
                specular: [0.1, 0.1, 0.1],
                n: 10
            },
            vertices: [
                [-0.5 * cubeSize, -0.5 * cubeSize, -0.5 * cubeSize], [0.5 * cubeSize, -0.5 * cubeSize, -0.5 * cubeSize], [0.5 * cubeSize, 0.5 * cubeSize, -0.5 * cubeSize], [-0.5 * cubeSize, 0.5 * cubeSize, -0.5 * cubeSize], // Front face
                [-0.5 * cubeSize, -0.5 * cubeSize, 0.5 * cubeSize], [0.5 * cubeSize, -0.5 * cubeSize, 0.5 * cubeSize], [0.5 * cubeSize, 0.5 * cubeSize, 0.5 * cubeSize], [-0.5 * cubeSize, 0.5 * cubeSize, 0.5 * cubeSize], // Back face
                [-0.5 * cubeSize, -0.5 * cubeSize, -0.5 * cubeSize], [-0.5 * cubeSize, -0.5 * cubeSize, 0.5 * cubeSize], [-0.5 * cubeSize, 0.5 * cubeSize, 0.5 * cubeSize], [-0.5 * cubeSize, 0.5 * cubeSize, -0.5 * cubeSize], // Left face
                [0.5 * cubeSize, -0.5 * cubeSize, -0.5 * cubeSize], [0.5 * cubeSize, -0.5 * cubeSize, 0.5 * cubeSize], [0.5 * cubeSize, 0.5 * cubeSize, 0.5 * cubeSize], [0.5 * cubeSize, 0.5 * cubeSize, -0.5 * cubeSize], // Right face
                [-0.5 * cubeSize, -0.5 * cubeSize, -0.5 * cubeSize], [0.5 * cubeSize, -0.5 * cubeSize, -0.5 * cubeSize], [0.5 * cubeSize, -0.5 * cubeSize, 0.5 * cubeSize], [-0.5 * cubeSize, -0.5 * cubeSize, 0.5 * cubeSize], // Bottom face
                [-0.5 * cubeSize, 0.5 * cubeSize, -0.5 * cubeSize], [0.5 * cubeSize, 0.5 * cubeSize, -0.5 * cubeSize], [0.5 * cubeSize, 0.5 * cubeSize, 0.5 * cubeSize], [-0.5 * cubeSize, 0.5 * cubeSize, 0.5 * cubeSize]  // Top face
            ],
            triangles: [
                [0, 1, 2], [0, 2, 3], [4, 5, 6], [4, 6, 7], // Front and back faces
                [8, 9, 10], [8, 10, 11], [12, 13, 14], [12, 14, 15], // Left and right faces
                [16, 17, 18], [16, 18, 19], [20, 21, 22], [20, 22, 23]  // Bottom and top faces
            ]
        };

        // Adjust the cube position by the corner
        cubeObject.vertices = cubeObject.vertices.map(v => [
            v[0] + position[0],
            v[1] + position[1],
            v[2] + position[2]
        ]);

        framework.beams.push(cubeObject);  // Add each cube to the scene
    });



      
     
      
    
      
      doDrawing(gl, canvas, framework.beams);
      
}


// Define the blue and red pyramid templates
const bluePyramidTemplate = {
    name: "Blue Pyramid",
    
    material: {
        ambient: [0.1, 0.1, 0.3],
        diffuse: [0.1, 0.1, 0.8],
        specular: [0.3, 0.3, 0.3],
        n: 10
    },
    vertices: [
        [0, 0, 0], [1, 0, 0], [1, 0, 1], [0, 0, 1], [0.5, 1, 0.5]
    ],
    triangles: [
        [0, 1, 4], [1, 2, 4], [2, 3, 4], [3, 0, 4], [0, 1, 2], [0, 2, 3]
    ]
};

const redPyramidTemplate = {
    name: "Red Pyramid",

    material: {
        ambient: [0.3, 0.1, 0.1],
        diffuse: [0.8, 0.1, 0.1],
        specular: [0.3, 0.3, 0.3],
        n: 10
    },
    vertices: [
        [0, 0, 0], [1, 0, 0], [1, 0, 1], [0, 0, 1], [0.5, 1, 0.5]
    ],
    triangles: [
        [0, 1, 4], [1, 2, 4], [2, 3, 4], [3, 0, 4], [0, 1, 2], [0, 2, 3]
    ]
};

// Create the board slots
const boardSlots = [];
const gridSize = 3; // 3x3x3 grid
const slotSpacing = 1.5;

for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
        for (let z = 0; z < gridSize; z++) {
            boardSlots.push({
                position: [x * slotSpacing, y * slotSpacing, z * slotSpacing],
                occupied: null // Tracks whether the slot is occupied
            });
        }
    }
}

// Add logic for spawning pyramids
let currentSlotIndex = 0; // Tracks the selected slot
let isBlueTurn = true; // Alternates between blue and red pyramids

function spawnPyramid(gl,canvas, beams) {
    const currentSlot = boardSlots[currentSlotIndex];

    // Check if the slot is already occupied
    if (currentSlot.occupied) {
        console.log("Slot already occupied!");
        return;
    }

    // Decide the pyramid type based on the turn
    const pyramidTemplate = isBlueTurn ? bluePyramidTemplate : redPyramidTemplate;

    // Clone the pyramid template and update its vertices to match the slot position
    const pyramid = JSON.parse(JSON.stringify(pyramidTemplate));
    pyramid.vertices = pyramid.vertices.map(vertex => [
        vertex[0] + currentSlot.position[0] + 0.25,
        vertex[1] + currentSlot.position[1],
        vertex[2] + currentSlot.position[2] + 0.25
    ]);

    beams.push(pyramid)

    // Mark the slot as occupied
    currentSlot.occupied = isBlueTurn ? "Blue" : "Red";

    // Switch turns
    isBlueTurn = !isBlueTurn;

    // Trigger a redraw
    doDrawing(gl,canvas, beams)
}



function doDrawing(gl, canvas, inputTriangles) {
    // Create a state for our scene

    var state = {
        camera: {
            position: vec3.fromValues(2.5, 5, -5),
            center: vec3.fromValues(2.5, 2.5, 0),
            up: vec3.fromValues(0.0, 1.0, 0.0),
        },
        objects: [],
        canvas: canvas,
        selectedIndex: 0,
        hasSelected: false,
    };

    for (var i = 0; i < inputTriangles.length; i++) {
        state.objects.push(
            {
                name: inputTriangles[i].name,
                model: {
                    position: vec3.fromValues(0.0, 0.0, 0.5),
                    rotation: mat4.create(), // Identity matrix
                    scale: vec3.fromValues(1.0, 1.0, 1.0),
                },
                // this will hold the shader info for each object
                programInfo: transformShader(gl),
                buffers: undefined,
                centroid: calculateCentroid(inputTriangles[i].vertices),
                material: {
                    ambient: inputTriangles[i].material.ambient,
                    diffuse: inputTriangles[i].material.diffuse,
                    specular: inputTriangles[i].material.specular,
                    shininess: inputTriangles[i].material.n,
                }
                // TODO: Add more object specific state like material color, ...
            }
        );

        initBuffers(gl, state.objects[i], inputTriangles[i].vertices.flat(), inputTriangles[i].triangles.flat());
    }
    setupKeypresses(gl, state,canvas, inputTriangles);

    

    //console.log(state)

    console.log("Starting rendering loop");
    startRendering(gl, state);
}


/************************************
 * RENDERING CALLS
 ************************************/

function startRendering(gl, state) {
    // A variable for keeping track of time between frames
    var then = 0.0;

    // This function is called when we want to render a frame to the canvas
    function render(now) {
        now *= 0.001; // convert to seconds
        const deltaTime = now - then;
        then = now;

        // Draw our scene
        drawScene(gl, deltaTime, state);

        // Request another frame when this one is done
        requestAnimationFrame(render);
    }

    // Draw the scene
    requestAnimationFrame(render);
}

/**
 * Draws the scene. Should be called every frame
 * 
 * @param  {} gl WebGL2 context
 * @param {number} deltaTime Time between each rendering call
 */
function drawScene(gl, deltaTime, state) {
    // Define triangles in JSON format

  // Pass the parsed JSON to the drawing function
  
    // Set clear colour
    // This is a Red-Green-Blue-Alpha colour
    // See https://en.wikipedia.org/wiki/RGB_color_model
    // Here we use floating point values. In other places you may see byte representation (0-255).
    gl.clearColor(0.5, 0.5, 0.5, 1.0);

    // Depth testing allows WebGL to figure out what order to draw our objects such that the look natural.
    // We want to draw far objects first, and then draw nearer objects on top of those to obscure them.
    // To determine the order to draw, WebGL can test the Z value of the objects.
    // The z-axis goes out of the screen
    gl.enable(gl.DEPTH_TEST); // Enable depth testing
    gl.depthFunc(gl.LEQUAL); // Near things obscure far things
    gl.clearDepth(1.0); // Clear everything

    // Clear the color and depth buffer with specified clear colour.
    // This will replace everything that was in the previous frame with the clear colour.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    state.objects.forEach((object) => {
        // Choose to use our shader
        gl.useProgram(object.programInfo.program);

        // TODO Update uniforms with state variables values
        {
            // TODO setup projection matrix (this doesn't change)
            // use same params as in the lab5 example
            // fovy = 60deg, near=0.1, far=100
            // Generate the projection matrix using perspective
            // link to corresponding uniform object.programInfo.uniformLocations.[...]
            const projectionMatrix = mat4.create();
            mat4.perspective(projectionMatrix, glMatrix.toRadian(60), state.canvas.width / state.canvas.height, 0.1, 100.0);
            gl.uniformMatrix4fv(object.programInfo.uniformLocations.uProjectionMatrix, false, projectionMatrix);



            // TODO update view matrix with state.camera
            // use mat4.lookAt to generate the view matrix
            // link to corresponding uniform object.programInfo.uniformLocations.[...]
            const viewMatrix = mat4.create();
            mat4.lookAt(viewMatrix, state.camera.position, state.camera.center, state.camera.up);
            gl.uniformMatrix4fv(object.programInfo.uniformLocations.uViewMatrix, false, viewMatrix);

            
            // TODO Update model transform
            // apply modeling transformations in correct order using
            // object.model.position, object.model.rotation, object.model.scale
            // for correct rotation wr centroid here is the order of operations 
            // in reverese order of how they should be applied 
            // translation (object.model.position), translation(centroid), rotation, scale, translation(negative certoid)
            // link to corresponding uniform object.programInfo.uniformLocations.[...]
            const modelMatrix = mat4.create();
            mat4.translate(modelMatrix, modelMatrix, object.model.position);
            mat4.translate(modelMatrix, modelMatrix, object.centroid);
            mat4.multiply(modelMatrix, modelMatrix, object.model.rotation);
            mat4.scale(modelMatrix, modelMatrix, object.model.scale);
            mat4.translate(modelMatrix, modelMatrix, vec3.negate(vec3.create(), object.centroid));
            gl.uniformMatrix4fv(object.programInfo.uniformLocations.uModelMatrix, false, modelMatrix);

         
            // TODO Update other uniforms like colors
            gl.uniform3fv(object.programInfo.uniformLocations.uColor, object.material.diffuse);
    
        }
        // Draw 
        {
            // Bind the buffer we want to draw
            gl.bindVertexArray(object.buffers.vao);

            // Draw the object
            const offset = 0; // Number of elements to skip before starting
            gl.drawElements(gl.TRIANGLES, object.buffers.numVertices, gl.UNSIGNED_SHORT, offset);
        }
    });
}


/************************************
 * UI EVENTS
 ************************************/

function setupKeypresses(gl,state, canvas, beams) {
    const layerSize = 9; // 3x3 grid per layer
    const rowSize = 3;

    

        
    
    
    document.addEventListener("keydown", (event) => {
        console.log(event.code);
        event.preventDefault();

        console.log("Selected Slot Index:", currentSlotIndex);
        switch (event.code) {
            case "KeyA":
                if (event.getModifierState("Shift")) {
                    if (state.hasSelected) {
                        // TODO Rotate selected object around Y
                        const rotationY = mat4.create();
                        mat4.rotateY(rotationY, rotationY, 0.1);
                        mat4.multiply(object.model.rotation, rotationY, object.model.rotation);
                    } else {
                        // TODO Rotate camera around Y
                        const rotationMatrixA = mat4.create();
                    const worldUpA = vec3.fromValues(0, 1, 0);
                    mat4.rotate(rotationMatrixA, rotationMatrixA, 0.05, worldUpA);

                    const tempLookDirA = vec3.create();
                    vec3.subtract(tempLookDirA, state.camera.center, state.camera.position);
                    vec3.transformMat4(tempLookDirA, tempLookDirA, rotationMatrixA);
                    vec3.normalize(tempLookDirA, tempLookDirA);
                    vec3.add(state.camera.center, state.camera.position, tempLookDirA);

                    const tempRightA = vec3.create();
                    vec3.cross(tempRightA, tempLookDirA, state.camera.up);
                    vec3.normalize(state.camera.right, tempRightA);

                    vec3.cross(state.camera.up, state.camera.right, tempLookDirA);
                    vec3.normalize(state.camera.up, state.camera.up);
                        

                    }
                } else {
                    if (state.hasSelected) {
                        // TODO: Move selected object along X axis
                        object.model.position[0] += 0.05;
                    } else {
                        // TODO: Move camera along X axis
                        state.camera.position[0] += 0.05;
                        state.camera.center[0] += 0.05;
                    }
                }
                break;
            case "KeyD":
                if (event.getModifierState("Shift")) {
                    if (state.hasSelected) {
                        // TODO Rotate selected object around Y (other direction)
                        const rotationY = mat4.create();
                        mat4.rotateY(rotationY, rotationY, -0.1);
                        mat4.multiply(object.model.rotation, rotationY, object.model.rotation);
                    } else {
                        // TODO Rotate camera around Y (other direction)
                        const rotationMatrixD = mat4.create();
                    const worldUpD = vec3.fromValues(0, 1, 0);
                    mat4.rotate(rotationMatrixD, rotationMatrixD, -0.05, worldUpD);

                    const tempLookDirD = vec3.create();
                    vec3.subtract(tempLookDirD, state.camera.center, state.camera.position);
                    vec3.transformMat4(tempLookDirD, tempLookDirD, rotationMatrixD);
                    vec3.normalize(tempLookDirD, tempLookDirD);
                    vec3.add(state.camera.center, state.camera.position, tempLookDirD);

                    const tempRightD = vec3.create();
                    vec3.cross(tempRightD, tempLookDirD, state.camera.up);
                    vec3.normalize(state.camera.right, tempRightD);

                    vec3.cross(state.camera.up, state.camera.right, tempLookDirD);
                    vec3.normalize(state.camera.up, state.camera.up);
                    }
                } else {
                    if (state.hasSelected) {
                        // TODO: Move selected object along X axis (other direction)
                        object.model.position[0] -= 0.05;
                    } else {
                        // TODO: Move camera along X axis (other direction)
                        state.camera.position[0] -= 0.05;
                        state.camera.center[0] -= 0.05;
                    }
                }
                break;
            case "KeyW":
                if (event.getModifierState("Shift")) {
                    if (state.hasSelected) {
                        // TODO: rotate selection forward and backward around view X
                        const rotationX = mat4.create();
                        mat4.rotateX(rotationX, rotationX, 0.1);
                        mat4.multiply(object.model.rotation, rotationX, object.model.rotation);
                    } else {
                        
                        }
                } else {
                    if (state.hasSelected) {
                        // TODO: Move selected object along Z axis
                        object.model.position[2] += 0.05;
                    } else {
                        // TODO: Move camera along Z axis
                        state.camera.position[2] += 0.05;
                        state.camera.center[2] += 0.05;
                    }
                }
                break;
            case "KeyS":
                if (event.getModifierState("Shift")) {
                    if (state.hasSelected) {
                        // TODO: rotate selection forward and backward around view X (other direction)
                        const rotationX = mat4.create();
                        mat4.rotateX(rotationX, rotationX, -0.1);
                        mat4.multiply(object.model.rotation, rotationX, object.model.rotation);
                    } else {
                        // TODO: Rotate camera about X axis (pitch)
                        
                    }
                } else {
                    if (state.hasSelected) {
                        // TODO: Move selected object along Z axis  (other direction)
                        object.model.position[2] -= 0.05;
                    } else {
                        // TODO: Move camera along Z axis (other direction)
                        state.camera.position[2] -= 0.05;
                        state.camera.center[2] -= 0.05;
                        
                    }
                }
                break;
            case "KeyQ":
                if (event.getModifierState("Shift")) {
                    if (state.hasSelected) {
                        // TODO : rotate selected object around z axis
                        const rotationZ = mat4.create();
                        mat4.rotateZ(rotationZ, rotationZ, 0.1);
                        mat4.multiply(object.model.rotation, rotationZ, object.model.rotation);
                    }
                } else {
                    if (state.hasSelected) {
                        // TODO : move selected object along Y axis 
                        object.model.position[1] += 0.05;
                    } else {
                        // TODO: move camera along Y axis
                        state.camera.position[1] += 0.05;
                        state.camera.center[1] += 0.05;
                    }
                }

                break;
            case "KeyE":
                if (event.getModifierState("Shift")) {
                    if (state.hasSelected) {
                        // TODO : rotate selected object around z axis
                        const rotationZ = mat4.create();
                        mat4.rotateZ(rotationZ, rotationZ, -0.1);
                        mat4.multiply(object.model.rotation, rotationZ, object.model.rotation);
                    }
                } else {
                    if (state.hasSelected) {
                        // TODO : move selected object along Y axis 
                        object.model.position[1] -= 0.05;
                    } else {
                       if (state.camera.position[1] < 0.5){
                        state.camera.position[1] = 0.5;
                        state.camera.center[1] = 0.5;
                       } else{
                        state.camera.position[1] -= 0.05;
                        state.camera.center[1] -= 0.05;
                       }
                       
                        // TODO: move camera along Y axis
                        
                    }
                }
                break;
                case "ArrowUp":
                currentSlotIndex = (currentSlotIndex - rowSize + boardSlots.length) % boardSlots.length;
                break;
            case "ArrowDown":
                currentSlotIndex = (currentSlotIndex + rowSize) % boardSlots.length;
                break;
            case "ArrowLeft":
                currentSlotIndex = (currentSlotIndex - 1 + boardSlots.length) % boardSlots.length;
                break;
            case "ArrowRight":
                currentSlotIndex = (currentSlotIndex + 1) % boardSlots.length;
                break;
            case "PageUp":
                currentSlotIndex = (currentSlotIndex - layerSize + boardSlots.length) % boardSlots.length;
                break;
            case "PageDown":
                currentSlotIndex = (currentSlotIndex + layerSize) % boardSlots.length;
                break;
            case "Space":
                spawnPyramid(gl,canvas,beams); 
                break;
                case "KeyR":
                beams = beams.filter(object => {
                    return object.name !== "Blue Pyramid" && object.name !== "Red Pyramid";
                }); 
                console.log("All pyramids have been removed!");
                doDrawing(gl, canvas, beams); 
                break;
            default:
                break;
        }

    });


}

/************************************
 * SHADER SETUP
 ************************************/
function transformShader(gl) {
    // Vertex shader source code
    const vsSource =
        `#version 300 es
    in vec3 aPosition;

    // TODO add uniforms for projection, view and model matrices
    // type uniform mat4 
    uniform mat4 uProjectionMatrix;
    uniform mat4 uViewMatrix;
    uniform mat4 uModelMatrix;
   
 
    void main() {
        // Position needs to be a vec4 with w as 1.0
        // TODO apply transformation stored in uniforms 
        gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aPosition, 1.0);
        
    }
    `;

    // Fragment shader source code
    const fsSource =
        `#version 300 es
    precision highp float;

    out vec4 fragColor;
    
    // TODO: add uniform for object material color
    // type vec3 
    uniform vec3 uColor;
    
    void main() {
        // TODO: replace with corresponding color from uniform
        fragColor = vec4(uColor, 1.0);
    }
    `;

    // Create our shader program with our custom function
    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

    // Collect all the info needed to use the shader program.
    const programInfo = {
        // The actual shader program
        program: shaderProgram,
        // The attribute locations. WebGL will use there to hook up the buffers to the shader program.
        // NOTE: it may be wise to check if these calls fail by seeing that the returned location is not -1.
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, 'aPosition'),
        },
        uniformLocations: {
            // TODO: add the locations for the 3 uniforms related to projection, view, modeling transforms
            uProjectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
            uViewMatrix: gl.getUniformLocation(shaderProgram, 'uViewMatrix'),
            uModelMatrix: gl.getUniformLocation(shaderProgram, 'uModelMatrix'),
           
    
            // TODO: Add location to additional uniforms here (ex related to material color)
            uColor: gl.getUniformLocation(shaderProgram, 'uColor'),
        },
    };

    // Check to see if we found the locations of our uniforms and attributes
    // Typos are a common source of failure
    // TODO add testes for all your uniform locations 
    if (programInfo.attribLocations.vertexPosition === -1||
        programInfo.uniformLocations.uProjectionMatrix === -1 ||
        programInfo.uniformLocations.uViewMatrix === -1 ||
        programInfo.uniformLocations.uModelMatrix === -1 ||
        programInfo.uniformLocations.uColor === -1) {

        printError('Shader Location Error', 'One or more of the uniform and attribute variables in the shaders could not be located');
    }

    return programInfo;
}

/************************************
 * BUFFER SETUP
 ************************************/

function initBuffers(gl, object, positionArray, indicesArray) {

    // We have 3 vertices with x, y, and z values
    const positions = new Float32Array(positionArray);

    // We are using gl.UNSIGNED_SHORT to enumerate the indices
    const indices = new Uint16Array(indicesArray);


    // Allocate and assign a Vertex Array Object to our handle
    var vertexArrayObject = gl.createVertexArray();

    // Bind our Vertex Array Object as the current used object
    gl.bindVertexArray(vertexArrayObject);

    object.buffers = {
        vao: vertexArrayObject,
        attributes: {
            position: initPositionAttribute(gl, object.programInfo, positions),
        },
        indices: initIndexBuffer(gl, indices),
        numVertices: indices.length,
    };
}

function initPositionAttribute(gl, programInfo, positionArray) {

    // Create a buffer for the positions.
    const positionBuffer = gl.createBuffer();

    // Select the buffer as the one to apply buffer
    // operations to from here out.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Now pass the list of positions into WebGL to build the
    // shape. We do this by creating a Float32Array from the
    // JavaScript array, then use it to fill the current buffer.
    gl.bufferData(
        gl.ARRAY_BUFFER, // The kind of buffer this is
        positionArray, // The data in an Array object
        gl.STATIC_DRAW // We are not going to change this data, so it is static
    );

    // Tell WebGL how to pull out the positions from the position
    // buffer into the vertexPosition attribute.
    {
        const numComponents = 3; // pull out 3 values per iteration, ie vec3
        const type = gl.FLOAT; // the data in the buffer is 32bit floats
        const normalize = false; // don't normalize between 0 and 1
        const stride = 0; // how many bytes to get from one set of values to the next
        // Set stride to 0 to use type and numComponents above
        const offset = 0; // how many bytes inside the buffer to start from


        // Set the information WebGL needs to read the buffer properly
        gl.vertexAttribPointer(
            programInfo.attribLocations.vertexPosition,
            numComponents,
            type,
            normalize,
            stride,
            offset
        );
        // Tell WebGL to use this attribute
        gl.enableVertexAttribArray(
            programInfo.attribLocations.vertexPosition);
    }

    return positionBuffer;
}


function initColourAttribute(gl, programInfo, colourArray) {

    // Create a buffer for the positions.
    const colourBuffer = gl.createBuffer();

    // Select the buffer as the one to apply buffer
    // operations to from here out.
    gl.bindBuffer(gl.ARRAY_BUFFER, colourBuffer);

    // Now pass the list of positions into WebGL to build the
    // shape. We do this by creating a Float32Array from the
    // JavaScript array, then use it to fill the current buffer.
    gl.bufferData(
        gl.ARRAY_BUFFER, // The kind of buffer this is
        colourArray, // The data in an Array object
        gl.STATIC_DRAW // We are not going to change this data, so it is static
    );

    // Tell WebGL how to pull out the positions from the position
    // buffer into the vertexPosition attribute.
    {
        const numComponents = 4; // pull out 4 values per iteration, ie vec4
        const type = gl.FLOAT; // the data in the buffer is 32bit floats
        const normalize = false; // don't normalize between 0 and 1
        const stride = 0; // how many bytes to get from one set of values to the next
        // Set stride to 0 to use type and numComponents above
        const offset = 0; // how many bytes inside the buffer to start from

        // Set the information WebGL needs to read the buffer properly
        gl.vertexAttribPointer(
            programInfo.attribLocations.vertexColour,
            numComponents,
            type,
            normalize,
            stride,
            offset
        );
        // Tell WebGL to use this attribute
        gl.enableVertexAttribArray(
            programInfo.attribLocations.vertexColour);
    }

    return colourBuffer;
}

function initIndexBuffer(gl, elementArray) {

    // Create a buffer for the positions.
    const indexBuffer = gl.createBuffer();

    // Select the buffer as the one to apply buffer
    // operations to from here out.
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    // Now pass the list of positions into WebGL to build the
    // shape. We do this by creating a Float32Array from the
    // JavaScript array, then use it to fill the current buffer.
    gl.bufferData(
        gl.ELEMENT_ARRAY_BUFFER, // The kind of buffer this is
        elementArray, // The data in an Array object
        gl.STATIC_DRAW // We are not going to change this data, so it is static
    );

    return indexBuffer;
}

/**
 * 
 * @param {array of x,y,z vertices} vertices 
 */
function calculateCentroid(vertices) {

    var center = vec3.fromValues(0.0, 0.0, 0.0);
    for (let t = 0; t < vertices.length; t++) {
        vec3.add(center,center,vertices[t]);
    }
    vec3.scale(center,center,1/vertices.length);
    return center;

}




