import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '../../Components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '../../Components/ui/alert';
import { RotateCw, ArrowLeft, ArrowRight } from 'lucide-react';

const ThreeHumanViewer = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [selectedPart, setSelectedPart] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const modelRef = useRef(null);

  const anatomyInfo = {
    head: {
      title: "Head",
      description: "Contains the brain, central nervous system, and major sensory organs. The brain processes information and controls all body functions."
    },
    torso: {
      title: "Torso",
      description: "Houses vital organs including heart, lungs, and digestive system. Protected by the ribcage and spine. Contains major muscle groups."
    },
    leftArm: {
      title: "Left Arm",
      description: "Complex limb with shoulder, elbow, and wrist joints. Contains muscles like biceps and triceps. Essential for movement and manipulation."
    },
    rightArm: {
      title: "Right Arm",
      description: "Mirror structure to left arm with identical bone and muscle composition. Works in coordination for balanced movement and strength."
    },
    legs: {
      title: "Legs",
      description: "Lower limbs containing powerful muscles and joints. Essential for mobility, balance, and support. Features complex joint systems."
    }
  };

  useEffect(() => {
    let scene, camera, renderer, model;
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const init = async () => {
      await loadThreeJS();
      
      scene = new window.THREE.Scene();
      scene.background = new window.THREE.Color(0xffffff);

      camera = new window.THREE.PerspectiveCamera(
        45,
        containerRef.current.clientWidth / containerRef.current.clientHeight,
        0.1,
        1000
      );
      camera.position.set(0, 0, 8);

      renderer = new window.THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true,
        preserveDrawingBuffer: true
      });
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      canvasRef.current.appendChild(renderer.domElement);

      // Lighting
      const ambientLight = new window.THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);

      const frontLight = new window.THREE.DirectionalLight(0xffffff, 0.8);
      frontLight.position.set(0, 0, 5);
      scene.add(frontLight);

      const backLight = new window.THREE.DirectionalLight(0xffffff, 0.5);
      backLight.position.set(0, 0, -5);
      scene.add(backLight);

      const topLight = new window.THREE.DirectionalLight(0xffffff, 0.5);
      topLight.position.set(0, 5, 0);
      scene.add(topLight);

      model = createHumanModel();
      modelRef.current = model;
      scene.add(model);

      setupMouseControls(model, renderer.domElement);
      animate();
      setIsLoading(false);
    };

    const loadThreeJS = () => {
      return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.0/three.min.js';
        script.onload = resolve;
        document.body.appendChild(script);
      });
    };

    const createHumanModel = () => {
      const group = new window.THREE.Group();
      const material = new window.THREE.MeshPhongMaterial({ 
        color: 0xf0f0f0,
        shininess: 30,
        specular: 0x444444
      });

      // Head
      const head = new window.THREE.Mesh(
        new window.THREE.SphereGeometry(0.4, 32, 32),
        material
      );
      head.position.y = 2.2;
      head.scale.set(1, 1.1, 1);
      head.userData.part = 'head';
      group.add(head);

      // Neck
      const neck = new window.THREE.Mesh(
        new window.THREE.CylinderGeometry(0.2, 0.25, 0.3, 32),
        material
      );
      neck.position.y = 1.9;
      neck.userData.part = 'head';
      group.add(neck);

      // Torso
      const torso = new window.THREE.Mesh(
        new window.THREE.CylinderGeometry(0.7, 0.6, 2, 32, 1, true),
        material
      );
      torso.position.y = 0.8;
      torso.userData.part = 'torso';
      group.add(torso);

      // Chest overlay
      const chest = new window.THREE.Mesh(
        new window.THREE.SphereGeometry(0.7, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2),
        material
      );
      chest.position.y = 1.6;
      chest.rotation.x = -Math.PI / 2;
      chest.userData.part = 'torso';
      group.add(chest);

      // Shoulders
      const shoulderGeometry = new window.THREE.SphereGeometry(0.3, 32, 32);
      const leftShoulder = new window.THREE.Mesh(shoulderGeometry, material);
      leftShoulder.position.set(-0.8, 1.6, 0);
      leftShoulder.userData.part = 'leftArm';
      group.add(leftShoulder);

      const rightShoulder = new window.THREE.Mesh(shoulderGeometry, material);
      rightShoulder.position.set(0.8, 1.6, 0);
      rightShoulder.userData.part = 'rightArm';
      group.add(rightShoulder);

      // Arms
      const armGeometry = new window.THREE.CylinderGeometry(0.15, 0.15, 1.4, 32);
      const leftArm = new window.THREE.Mesh(armGeometry, material);
      leftArm.position.set(-0.8, 0.9, 0);
      leftArm.userData.part = 'leftArm';
      group.add(leftArm);

      const rightArm = new window.THREE.Mesh(armGeometry, material);
      rightArm.position.set(0.8, 0.9, 0);
      rightArm.userData.part = 'rightArm';
      group.add(rightArm);

      // Hips
      const hips = new window.THREE.Mesh(
        new window.THREE.CylinderGeometry(0.6, 0.6, 0.4, 32),
        material
      );
      hips.position.y = -0.3;
      hips.userData.part = 'legs';
      group.add(hips);

      // Legs
      const legGeometry = new window.THREE.CylinderGeometry(0.2, 0.15, 2, 32);
      const leftLeg = new window.THREE.Mesh(legGeometry, material);
      leftLeg.position.set(-0.3, -1.4, 0);
      leftLeg.userData.part = 'legs';
      group.add(leftLeg);

      const rightLeg = new window.THREE.Mesh(legGeometry, material);
      rightLeg.position.set(0.3, -1.4, 0);
      rightLeg.userData.part = 'legs';
      group.add(rightLeg);

      group.rotation.y = Math.PI;
      return group;
    };

    const setupMouseControls = (model, canvas) => {
      canvas.addEventListener('mousedown', (e) => {
        isDragging = true;
        previousMousePosition = {
          x: e.clientX,
          y: e.clientY
        };
      });

      canvas.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        const deltaMove = {
          x: e.clientX - previousMousePosition.x,
          y: e.clientY - previousMousePosition.y
        };

        model.rotation.y += deltaMove.x * 0.01;
        model.rotation.x += deltaMove.y * 0.01;

        previousMousePosition = {
          x: e.clientX,
          y: e.clientY
        };
      });

      canvas.addEventListener('mouseup', () => {
        isDragging = false;
      });

      canvas.addEventListener('mouseleave', () => {
        isDragging = false;
      });

      canvas.addEventListener('click', (e) => {
        if (isDragging) return;

        const raycaster = new window.THREE.Raycaster();
        const mouse = new window.THREE.Vector2();

        const rect = canvas.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(model.children, true);

        if (intersects.length > 0) {
          const part = intersects[0].object.userData.part;
          setSelectedPart(part);
        }
      });
    };

    const animate = () => {
      requestAnimationFrame(animate);
      renderer?.render(scene, camera);
    };

    init();

    const handleResize = () => {
      if (camera && renderer && containerRef.current) {
        camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer?.dispose();
      const script = document.querySelector('script[src*="three.js"]');
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handleRotate = (direction) => {
    if (modelRef.current) {
      modelRef.current.rotation.y += direction * Math.PI / 2;
    }
  };

  const handleReset = () => {
    if (modelRef.current) {
      modelRef.current.rotation.set(0, Math.PI, 0);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 p-4 w-full max-w-6xl mx-auto">
      <Card className="flex-1">
        <CardContent className="p-6">
          <div className="flex justify-between mb-4">
            <div className="flex gap-2">
              <button 
                onClick={() => handleRotate(1)}
                className="p-2 rounded-lg hover:bg-gray-100 flex items-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Rotate Left</span>
              </button>
              <button 
                onClick={() => handleRotate(-1)}
                className="p-2 rounded-lg hover:bg-gray-100 flex items-center gap-2"
              >
                <ArrowRight className="w-5 h-5" />
                <span>Rotate Right</span>
              </button>
            </div>
            <button 
              onClick={handleReset}
              className="p-2 rounded-lg hover:bg-gray-100 flex items-center gap-2"
            >
              <RotateCw className="w-5 h-5" />
              <span>Reset View</span>
            </button>
          </div>

          <div 
            ref={containerRef} 
            className="relative w-full bg-gray-50 rounded-lg overflow-hidden" 
            style={{ height: '600px' }}
          >
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
              </div>
            )}
            <div ref={canvasRef} className="w-full h-full"></div>
          </div>

          <div className="mt-4 flex justify-center">
            <div className="text-sm text-gray-500">
              Drag to rotate • Click to select parts
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="flex-1">
        <CardContent className="p-6">
          {selectedPart ? (
            <Alert className="bg-blue-50">
              <AlertTitle className="text-lg font-semibold mb-2">
                {anatomyInfo[selectedPart].title}
              </AlertTitle>
              <AlertDescription className="text-gray-700">
                {anatomyInfo[selectedPart].description}
              </AlertDescription>
            </Alert>
          ) : (
            <div className="text-center text-gray-500">
              <p className="mb-2">Click on any body part to see detailed information</p>
              <p>Drag the model to rotate and explore</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ThreeHumanViewer;