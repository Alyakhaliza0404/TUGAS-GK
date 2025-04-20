// Get canvas and create Babylon engine
const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);

// Create scene
const createScene = async () => {
  const scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color3(0.1, 0.1, 0.1);

  // Camera
  const camera = new BABYLON.ArcRotateCamera("camera", 
    Math.PI / 2, Math.PI / 2.5, 5, BABYLON.Vector3.Zero(), scene);
  camera.attachControl(canvas, true);

  // Lighting
// Hemispheric light (ambient)
const hemiLight = new BABYLON.HemisphericLight("hemiLight",
    new BABYLON.Vector3(0, 1, 0), scene);
  hemiLight.intensity = 0.6;
  hemiLight.diffuse = new BABYLON.Color3(1, 1, 1);
  hemiLight.groundColor = new BABYLON.Color3(0.2, 0.2, 0.2);
  
  // Directional light (for shadows)
  const dirLight = new BABYLON.DirectionalLight("dirLight",
    new BABYLON.Vector3(-1, -2, -1), scene);
  dirLight.position = new BABYLON.Vector3(10, 10, 10);
  dirLight.intensity = 0.8;

  // Shadow generator
  const shadowGenerator = new BABYLON.ShadowGenerator(1024, dirLight);

  // Ground to receive shadows
  const ground = BABYLON.MeshBuilder.CreateGround("ground", {
    width: 15,
    height: 15
  }, scene);
  ground.receiveShadows = true;

  // Load GLB model
  const result = await BABYLON.SceneLoader.ImportMeshAsync(
    "", "./", "model.glb", scene
  );

  result.meshes.forEach(mesh => {
    if (mesh !== scene.meshes[0]) { // Avoid scene root
      shadowGenerator.addShadowCaster(mesh);
    }
  });

  return scene;
};

// Run
createScene().then(scene => {
  engine.runRenderLoop(() => {
    scene.render();
  });
});

// Resize handler
window.addEventListener("resize", () => {
  engine.resize();
});
