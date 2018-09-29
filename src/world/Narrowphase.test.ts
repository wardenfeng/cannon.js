import { World } from './World';
import { Narrowphase } from './Narrowphase';
import { Sphere } from '../shapes/Sphere';
import { Body } from '../objects/Body';
import { ContactMaterial } from '../material/ContactMaterial';
import { Vec3 } from '../math/Vec3';
import { Quaternion } from '../math/Quaternion';
import { HullResult } from 'shapes/ConvexPolyhedron';

describe('Narrowphase', () => {

  // const createHeightfield = () => {
  //   const matrix = [];
  //   const size = 20;
  //   for (let i = 0; i < size; i++) {
  //     matrix.push([]);
  //     for (let j = 0; j < size; j++) {
  //       matrix[i].push(0);
  //     }
  //   }
  //   const hfShape = new Heightfield(matrix, {
  //     elementSize: 1,
  //   });
  //   return hfShape;
  // };

  it('should sphereSphere', () => {
    const world = new World();
    const cg = new Narrowphase(world);
    const result: HullResult[] = [];
    const sphereShape = new Sphere(1);

    const bodyA = new Body({ mass: 1 });
    bodyA.addShape(sphereShape);
    const bodyB = new Body({ mass: 1 });
    bodyB.addShape(sphereShape);

    cg.currentContactMaterial = new ContactMaterial();
    cg.result = result;
    cg.sphereSphere(
      sphereShape,
      sphereShape,
      new Vec3(0.5, 0, 0),
      new Vec3(-0.5, 0, 0),
      new Quaternion(),
      new Quaternion(),
      bodyA,
      bodyB
    );

    expect(result.length).toEqual(1);
  });

  // it('should sphereHeightfield', () => {
  //   const world = new World();
  //   const cg = new Narrowphase(world);
  //   const result: HullResult[] = [];
  //   const hfShape = createHeightfield();
  //   const sphereShape = new Sphere(0.1);
  //   cg.currentContactMaterial = new ContactMaterial();
  //   cg.result = result;
  //   cg.sphereHeightfield(
  //     sphereShape,
  //     hfShape,
  //     new Vec3(0.25, 0.25, 0.05), // hit the first triangle in the field
  //     new Vec3(0, 0, 0),
  //     new Quaternion(),
  //     new Quaternion(),
  //     new Body(1, sphereShape),
  //     new Body(1, hfShape)
  //   );

  //   expect(result.length).toEqual(1);
  // });

});