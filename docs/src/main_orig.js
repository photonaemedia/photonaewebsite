const canvas = document.getElementById("renderCanvas");
    const engine = new BABYLON.Engine(canvas, true);

    const createScene = () => {
        const scene = new BABYLON.Scene(engine);

        // Camera
        const camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI/2, Math.PI/2.5, 50, new BABYLON.Vector3(0,0,0), scene);
        camera.attachControl(canvas, true);

        // Lights
        new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(0,1,0), scene).intensity = 0.7;
        new BABYLON.PointLight("pointLight", new BABYLON.Vector3(0,50,0), scene).intensity = 1;

        // Spinning cubes background
        const cubes = [];
        for(let i=0; i<50; i++){
            const box = BABYLON.MeshBuilder.CreateBox("box"+i, {size:2}, scene);
            box.position = new BABYLON.Vector3((Math.random()-0.5)*50, (Math.random()-0.5)*50, (Math.random()-0.5)*50);
            const mat = new BABYLON.StandardMaterial("mat"+i, scene);
            mat.diffuseColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
            box.material = mat;
            cubes.push(box);
        }

        // Scroll position tracker
        let scrollZ = 0;

        window.addEventListener("wheel", (e) => {
            scrollZ += e.deltaY * 0.1; // Adjust speed factor here
        });

        scene.registerBeforeRender(() => {
            // Rotate cubes
            cubes.forEach(cube => {
                cube.rotation.x += 0.01;
                cube.rotation.y += 0.01;
            });

            // Move camera along z-axis
            camera.target.z = scrollZ;
        });

        return scene;
    };

    const scene = createScene();
    engine.runRenderLoop(() => scene.render());
    window.addEventListener("resize", () => engine.resize());

    // Navigation and horizontal sliding
    const wrapper = document.getElementById("sections-wrapper");
    const sections = document.querySelectorAll(".section-content .content-wrapper");

    const activateSection = (index) => {
        wrapper.style.transform = `translateX(-${index * 100}vw)`;
        sections.forEach(sec => sec.classList.remove("active"));
        sections[index].classList.add("active");
    };

    activateSection(0);

    document.querySelectorAll("nav a").forEach(a => {
        a.addEventListener("click", e => {
            e.preventDefault();
            const index = parseInt(a.dataset.target);
            activateSection(index);
        });
    });