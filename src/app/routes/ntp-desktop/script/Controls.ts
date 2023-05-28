import * as three from "three";
import * as SceneUtils  from 'three/examples/jsm/utils/SceneUtils';
export class Controls {
  radius = 40;
  tube = 17;
  radialSegments = 186;
  tubularSegments = 4;
  p = 9;
  q = 1;
  asParticles = true;
  rotate = true;
  knot: undefined | three.Points | three.Group = undefined;
  step = 0;

  constructor() {

  }

  public redraw(scene: three.Scene) {
    if(this.knot) scene.remove(this.knot);
    let geom = new three.TorusKnotGeometry(
      this.radius,
      this.tube,
      Math.round(this.radialSegments),
      Math.round(this.tubularSegments),
      Math.round(this.p),
      Math.round(this.q),
    );
    if(this.asParticles) {
      this.knot = this.createParticleSystem(geom);
    } else {
      this.knot = this.createMesh(geom);
    }

    scene.add(this.knot);
  }

  private createParticleSystem(geom: three.TorusKnotGeometry) {
    const material = new three.PointsMaterial({
      color: '#fff',
      size: 2,
      transparent: true,
      blending: three.AdditiveBlending,
      sizeAttenuation: true,
      map: this.generateSprite(),
        depthWrite: false,
    });
  
    const points = new three.Points(geom, material);
    return points;
  }

  private generateSprite(): three.Texture | null {
    const canvas = document.createElement("canvas");
    canvas.width = 16;
    canvas.height = 16;
    let context = canvas.getContext('2d');
    if(context) {
      let gradient = context.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width / 2
      )

      gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
      gradient.addColorStop(0.2, "rgba(0, 255, 255, 1)");
      gradient.addColorStop(0.4, "rgba(0, 0, 64, 1)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 1)");

      context.fillStyle = gradient;
      context.fillRect(0, 0, canvas.width, canvas.height);

      let texture = new three.CanvasTexture(canvas);
      texture.needsUpdate = true;
      return texture;
    }
    return null;
  }

  private createMesh(geom: three.TorusKnotGeometry) {
    let meshMaterial = new three.MeshNormalMaterial({});
    meshMaterial.side = three.DoubleSide;
    let mesh = SceneUtils.createMultiMaterialObject(geom, [meshMaterial]);
    return mesh
  }

  public render = (scene: three.Scene, webGlRenderer: three.WebGLRenderer, camera: three.PerspectiveCamera) => {
    if(this.knot) {
      this.knot.rotation.y = this.step += 0.00058;
    }
    requestAnimationFrame(() => this.render(scene, webGlRenderer, camera))
    webGlRenderer.render(scene, camera)
  }
}
