// Get canvas and create Babylon engine
const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);

const createScene = async () => {
  const scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color3(0.1, 0.1, 0.1);

  // Kamera
  const camera = new BABYLON.ArcRotateCamera(
    "camera",
    Math.PI / 2,
    Math.PI / 2.5,
    5,
    new BABYLON.Vector3(0, 1, 0),
    scene
  );
  camera.attachControl(canvas, true);
  camera.inputs.removeByType("ArcRotateCameraKeyboardMoveInput"); // Nonaktifkan default arrow keys

  // Lighting
  const hemiLight = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(0, 1, 0), scene);
  hemiLight.intensity = 0.6;

  const dirLight = new BABYLON.DirectionalLight("dirLight", new BABYLON.Vector3(-1, -2, -1), scene);
  dirLight.position = new BABYLON.Vector3(10, 10, 10);
  dirLight.intensity = 0.8;

  const shadowGenerator = new BABYLON.ShadowGenerator(1024, dirLight);

  // Ground tetap
  const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 15, height: 15 }, scene);
  ground.receiveShadows = true;

  // Load model
  const result = await BABYLON.SceneLoader.ImportMeshAsync("", "./", "model.glb", scene);

  // Ambil root dari model
  const rootMesh = result.meshes[0]; // biasanya __root__

  // Pastikan root bukan ground
  if (rootMesh.name === "ground") {
    console.warn("Root mesh named 'ground', please rename it in Blender or GLB exporter.");
  }

  // Set posisi awal
  rootMesh.position = new BABYLON.Vector3(0, 0.5, 0); // sedikit di atas ground

  // Tambahkan semua mesh ke shadow
  result.meshes.forEach(mesh => {
    if (mesh !== ground && mesh !== rootMesh) {
      shadowGenerator.addShadowCaster(mesh);
    }
  });

  // Keyboard movement
  scene.onKeyboardObservable.add((kbInfo) => {
    if (kbInfo.type === BABYLON.KeyboardEventTypes.KEYDOWN) {
      const speed = 0.2;
      switch (kbInfo.event.key) {
        case "ArrowRight":
          rootMesh.position.x += speed;
          break;
        case "ArrowLeft":
          rootMesh.position.x -= speed;
          break;
        case "ArrowUp":
          rootMesh.position.z += speed;
          break;
        case "ArrowDown":
          rootMesh.position.z -= speed;
          break;
      }
    }
  });

  return scene;
};

// Jalankan
createScene().then(scene => {
  engine.runRenderLoop(() => {
    scene.render();
  });
});

window.addEventListener("resize", () => {
  engine.resize();
});
