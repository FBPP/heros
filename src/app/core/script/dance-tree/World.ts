import * as THREE from "three"
import dancingTreeVertex from "@core/gl/dancing-tree-vertex.glsl"
import dancingTreeFragment from "@core/gl/dancing-tree-fragment.glsl"
import dancingTreeVertexExt from "@core/gl/dancing-tree-vertex-ext.glsl"
import dancingTreeFragmentExt from "@core/gl/dancing-tree-fragment-ext.glsl"
import { Observable } from "rxjs"
import gsap from "gsap";

interface Position {
  x: number,
  y: number,
  z: number,
}

interface WorldParameters {
  count: number;
  max: number;
  a: number;
  c: number;
}

interface Time {
  current: number;
  t0: number;
  t1: number;
  t: number;
  frequency: number;
  elapsed: number;
  delta: number;
}

interface Angle {
  x: number;
  z: number;
}

export class World {
  private parameters: WorldParameters = {
    count: 1500,
    max: 12.5 * Math.PI,
    a: 2,
    c: 4.5
  };;
  private scene: THREE.Scene = new THREE.Scene;
  private clock: THREE.Clock = new THREE.Clock();
  private data: number = 0;
  private time: Time = { current: 0, t0: 0, t1: 0, t: 0, frequency: 0.0005, elapsed: 0, delta: 0 };
  private angle: Angle = { x: 0, z: 0 };
  private width: number = window.innerWidth;
  private height: number = window.innerHeight;
  private aspectRatio!: number;
  private fieldOfView!: number;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private pixelRadio!: number; 
  private timer!: number;
  private spiralMaterial!: THREE.ShaderMaterial;
  private extMaterial!: THREE.ShaderMaterial;
  private instancedGeometry!: THREE.InstancedBufferGeometry;
  private sprial!: THREE.Mesh;
  private externalSphere!: THREE.Mesh;
  private octas!: THREE.Group;
  private octaGeometry!: THREE.OctahedronGeometry;
  private analyser: THREE.AudioAnalyser | null = null;
  private sound!: THREE.Audio;
  private isRunning = false;
  private t0 = 0;
  private playButton!: HTMLButtonElement;
  
  constructor(
    canvas: HTMLCanvasElement,
    width: number,
    height: number,
    cameraPosition: Position,
    fieldOfView = 75,
    nearPlane = 0.1,
    farPlane = 100
  ) {
    this.scene.background = new THREE.Color('#00101a');
    if(width) this.width = width;
    if(height) this.height = height;
    this.aspectRatio = this.width / this.height;
    this.fieldOfView = fieldOfView;
    this.camera = new THREE.PerspectiveCamera(
      this.fieldOfView,
      this.aspectRatio,
      nearPlane,
      farPlane,
    );
    this.camera.position.set(
      cameraPosition.x, 
      cameraPosition.y,
      cameraPosition.z
    );
    this.scene.add(this.camera);
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      powerPreference: "high-performance",
      antialias: false,
      stencil: false,
      depth: false,
    });
    this.pixelRadio = Math.min(window.devicePixelRatio, 2);
    this.renderer.setPixelRatio(this.pixelRadio);
    this.renderer.setSize(this.width, this.height);
    this.timer = 0;
    this.addToScene();
    this.render();

    this.listenToResize();
  }

  addSpiral() {
    this.spiralMaterial = new THREE.ShaderMaterial({
      vertexShader: dancingTreeVertex,
      fragmentShader: dancingTreeFragment,
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: 0.045 }
      },
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })
    const count = this.parameters.count;
    const scales = new Float32Array(count * 1);
    const colors = new Float32Array(count * 3);
    const phis = new Float32Array(count);
    const randoms = new Float32Array(count);
    const randoms1 = new Float32Array(count);
    const colorChoise = ["pink", "green", "cyan", "wheat", "red"];

    const squareGeometry = new THREE.PlaneGeometry(1, 1);
    this.instancedGeometry = new THREE.InstancedBufferGeometry();
    Object.keys(squareGeometry.attributes).forEach(attr => {
      this.instancedGeometry.attributes[attr] = squareGeometry.attributes[attr];
    })
    this.instancedGeometry.index = squareGeometry.index;
    this.instancedGeometry.instanceCount = count;

    for(let i = 0; i < count; ++i) {
      const i3 = 3 * i;
      const colorIndex = Math.floor(Math.random() * colorChoise.length);
      const color = new THREE.Color(colorChoise[colorIndex]);
      phis[i] = Math.random() * this.parameters.max;
      randoms[i] = Math.random();
      scales[i] = Math.random();
      colors[i3 + 0] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }
    this.instancedGeometry.setAttribute("phi", new THREE.InstancedBufferAttribute(phis, 1, false));
    this.instancedGeometry.setAttribute('random', new THREE.InstancedBufferAttribute(randoms, 1, false));
    this.instancedGeometry.setAttribute('aScale', new THREE.InstancedBufferAttribute(scales, 1, false));
    this.instancedGeometry.setAttribute('aColor', new THREE.InstancedBufferAttribute(colors, 3, false));
    this.sprial = new THREE.Mesh(this.instancedGeometry, this.spiralMaterial);
    this.scene.add(this.sprial)
  }

  addExternalSphere() {
    this.extMaterial = new THREE.ShaderMaterial({
      vertexShader: dancingTreeVertexExt,
      fragmentShader: dancingTreeFragmentExt,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color('orange') }
      },
      wireframe: true,
      transparent: true,
    })
    const geometry = new THREE.SphereGeometry(6, 128, 128);
    this.externalSphere = new THREE.Mesh(geometry, this.extMaterial);
    this.scene.add(this.externalSphere);
  }

  addOctahedrons() {
    this.octas = new THREE.Group();
    this.octaGeometry = new THREE.OctahedronGeometry(0.2, 0);
    this.addOctahedron({ color: "red", scale: [1, 1.4, 1] });
    this.addOctahedron({ color: "tomato", position: [0, 0.85, 0], scale: [0.5, 0.7, 0.5] });
    this.addOctahedron({ color: "red", position: [1, -0.75, 0], scale: [0.5, 0.7, 0.5] });
    this.addOctahedron({ color:  "tomato", position: [-0.75, -1.75, 0], scale: [1, 1.2, 1] });
    this.addOctahedron({ color: "red", position: [0.5, -1.2, 0.5], scale: [0.25, 0.37, 0.25] });
    this.scene.add(this.octas);
  }

  addOctahedron({ color = 'white', scale, position = [0, 0, 0] }: { color: string, scale: [number, number, number], position?: [number, number, number]  }) {
    const octa = new THREE.Mesh(
      this.octaGeometry,
      new THREE.MeshBasicMaterial({
        wireframe: true,
        color
      })
    )

    octa.scale.set(...scale)
    octa.position.set(...position)
    this.octas.add(octa);
  }
  
  addToScene(): void {
    this.addSpiral();
    this.addExternalSphere();
    this.addOctahedrons();
  }

  playMusic(playButton: HTMLButtonElement) {
    this.playButton = playButton;
    playButton.disabled = true;
    if(this.analyser) {
      this.sound.play();
      this.time.t0 = this.time.elapsed;
      this.data = 0;
      this.isRunning = true;
      gsap.to(playButton, {
        opacity: 0,
        duration: 1,
        ease: "power1.out"
      })
    } else {
      playButton.textContent = 'Loading...';
      this.loadMusic(playButton).subscribe(() => {
        console.log('music loaded');
      })
    }
  }

  private loadMusic(playButton: HTMLButtonElement) {
    return new Observable(observer => {
      const listener = new THREE.AudioListener();
      this.camera.add(listener);
      this.sound = new THREE.Audio(listener);
      const audioLoader = new THREE.AudioLoader();
      audioLoader.load(
        "https://assets.codepen.io/74321/short-snow_01.mp3",
        (buffer) => {
          this.sound.setBuffer(buffer),
          this.sound.setLoop(false),
          this.sound.setVolume(0.5),
          this.sound.play(),
          this.analyser = new THREE.AudioAnalyser(this.sound, 32);
          const data = this.analyser.getAverageFrequency();
          this.isRunning = true;
          this.t0 = this.time.elapsed;
          observer.next(data)
        },
        (progress) => {
          gsap.to(playButton, {
            opacity: () => 1 - progress.loaded / progress.total,
            duration: 1,
            ease: "power1.out"
          })
        },
        (error) => {
          console.log(error)
        }
      )
    })
  }


  listenToResize(): void {
    window.addEventListener("resize", () => {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.camera.aspect = this.width / this.height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.width, this.height);
    })
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  loop() {
    this.time.elapsed = this.clock.getElapsedTime();
    this.time.delta = Math.min(60, this.time.current - this.time.elapsed) * 1000;
    if(this.analyser && this.isRunning) {
      this.time.t = this.time.elapsed - this.time.t0 + this.time.t1;
      this.data = this.analyser.getAverageFrequency();
      this.data *= this.data / 2000;
      this.angle.x += this.time.delta * 0.001 * 0.63;
      this.angle.z += this.time.delta * 0.001 * 0.39;
      const justFinished = this.isRunning && !this.sound.isPlaying;
      if(justFinished) {
        this.time.t1 = this.time.t;
        this.playButton.textContent = "Play again";
        this.playButton.disabled = false;
        this.isRunning = false;
        const tl = gsap.timeline();
        this.angle.x = 0;
        this.angle.z = 0;
        tl.to(this.camera.position, {
          x: 0,
          z: 4.5,
          duration: 4,
          ease: 'expo.in'
        })
        tl.to(this.playButton, {
          opacity: 1,
          duration: 1,
          ease: "power1.out"
        });
      } else {
        this.camera.position.x = Math.sin(this.angle.x) * this.parameters.a;
        this.camera.position.z = Math.min(
          Math.max(Math.cos(this.angle.z) * this.parameters.c, -4.5),
          4.5
        )
      }
    }
    this.camera.lookAt(this.scene.position);
    this.spiralMaterial.uniforms.uTime.value += this.time.delta * this.time.frequency * (1 + this.data * 0.2);
    this.extMaterial.uniforms.uTime.value += this.time.delta * this.time.frequency;

    for(const octa of this.octas.children) {
      octa.rotation.y += this.data ? (0.001 * this.time.delta * this.data) / 5 : 0.001 * this.time.delta;
    }

    this.octas.rotation.y -= 0.0002 * this.time.delta;
    this.externalSphere.rotation.y += 0.0001 * this.time.delta;
    this.render();
    this.time.current = this.time.elapsed;
    requestAnimationFrame(() => this.loop())
  }
}