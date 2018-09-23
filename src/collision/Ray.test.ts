import { Vec3 } from '../math/Vec3';
import { Box } from '../shapes/Box';
import { Ray } from './Ray';
import { RaycastResult } from './RaycastResult';
import { Body } from '../objects/Body';
import { Sphere } from '../shapes/Sphere';
import { Plane } from '../shapes/Plane';
import { Quaternion } from '../math/Quaternion';

describe('Ray', () => {
  const createPolyhedron = (size = 0.5) => {
    const box = new Box(new Vec3(size, size, size));
    box.updateConvexPolyhedronRepresentation();
    return box.convexPolyhedronRepresentation;
  };

  it('should construct', () => {
    const r = new Ray(new Vec3(), new Vec3(1, 0, 0));
    expect(r).not.toBeUndefined();
  });

  it('should intersectBody', () => {
    let r = new Ray(new Vec3(5, 0, 0), new Vec3(-5, 0, 0));
    r.skipBackfaces = true;
    const shape = createPolyhedron(0.5);
    const body = new Body({ mass: 1 });
    body.addShape(shape);

    const result = new RaycastResult();

    r.intersectBody(body, result);
    expect(result.hasHit).toBeTruthy();
    expect(result.hitPointWorld.almostEquals(new Vec3(0.5, 0, 0))).toBeTruthy();

    // test rotating the body first
    result.reset();
    body.quaternion.setFromAxisAngle(new Vec3(1, 0, 0), Math.PI);
    r.intersectBody(body, result);
    expect(result.hasHit).toEqual(true);
    expect(result.hitPointWorld.almostEquals(new Vec3(0.5, 0, 0))).toBeTruthy();

    // test shooting from other direction
    result.reset();
    r.to.set(0, 0, -5);
    r.from.set(0, 0, 5);
    r.intersectBody(body, result);
    expect(result.hasHit).toEqual(true);
    expect(result.hitPointWorld.almostEquals(new Vec3(0, 0, 0.5))).toBeTruthy();

    // test miss
    result.reset();
    r = new Ray(new Vec3(5, 1, 0), new Vec3(-5, 1, 0));
    r.intersectBody(body, result);
    expect(result.hasHit).toEqual(false);
  });

  it('should intersectBodies', () => {
    const r = new Ray(new Vec3(5, 0, 0), new Vec3(-5, 0, 0));
    r.skipBackfaces = true;
    const shape = createPolyhedron(0.5);
    const body1 = new Body({ mass: 1 });
    body1.addShape(shape);
    const body2 = new Body({ mass: 1 });
    body2.addShape(shape);
    body2.position.x = -2;

    const result = new RaycastResult();
    r.intersectBodies([body1, body2], result);
    expect(result.hasHit).toEqual(true);
    expect(result.hitPointWorld.almostEquals(new Vec3(0.5, 0, 0))).toBeTruthy();
  });

  it('should box', () => {
    const r = new Ray(new Vec3(5, 0, 0), new Vec3(-5, 0, 0));
    r.skipBackfaces = true;
    const shape = new Box(new Vec3(0.5, 0.5, 0.5));
    const body = new Body({ mass: 1 });
    body.addShape(shape);
    const result = new RaycastResult();

    r.intersectBody(body, result);
    expect(result.hasHit).toEqual(true);
    expect(result.hitPointWorld.almostEquals(new Vec3(0.5, 0, 0))).toBeTruthy();

    result.reset();
    body.quaternion.setFromAxisAngle(new Vec3(1, 0, 0), Math.PI / 2);
    r.intersectBody(body, result);
    expect(result.hasHit).toEqual(true);
    expect(result.hitPointWorld.almostEquals(new Vec3(0.5, 0, 0))).toBeTruthy();

    result.reset();
    body.quaternion.setFromAxisAngle(new Vec3(1, 0, 0), Math.PI);
    r.intersectBody(body, result);
    expect(result.hasHit).toEqual(true);
    expect(result.hitPointWorld.almostEquals(new Vec3(0.5, 0, 0))).toBeTruthy();

    result.reset();
    body.quaternion.setFromAxisAngle(new Vec3(1, 0, 0), 3 * Math.PI / 2);
    r.intersectBody(body, result);
    expect(result.hasHit).toEqual(true);
    expect(result.hitPointWorld.almostEquals(new Vec3(0.5, 0, 0))).toBeTruthy();
  });

  it('should sphere', () => {
    const r = new Ray(new Vec3(5, 0, 0), new Vec3(-5, 0, 0));
    r.skipBackfaces = true;
    const shape = new Sphere(1);
    const body = new Body({ mass: 1 });
    body.addShape(shape);

    const result = new RaycastResult();
    r.intersectBody(body, result);
    expect(result.hasHit).toEqual(true);
    expect(result.hitPointWorld.almostEquals(new Vec3(1, 0, 0))).toBeTruthy();

    result.reset();
    body.position.set(1, 0, 0);
    r.intersectBody(body, result);
    expect(result.hasHit).toEqual(true);
    expect(result.hitPointWorld.almostEquals(new Vec3(2, 0, 0))).toBeTruthy();

    result.reset();
    r.intersectBody(body, result);
    expect(result.hasHit).toEqual(true);
    expect(result.hitPointWorld.almostEquals(new Vec3(2, 0, 0))).toBeTruthy();

    result.reset();
    const shape2 = new Sphere(1);
    const body2 = new Body({ mass: 1 });
    body2.addShape(shape2, new Vec3(1, 0, 0));
    r.intersectBody(body2, result);
    expect(result.hasHit).toEqual(true);
    expect(result.hitPointWorld.almostEquals(new Vec3(2, 0, 0))).toBeTruthy();
  });

  // it('should heightfield', () => {
  //   const r = new Ray(new Vec3(0, 0, 10), new Vec3(0, 0, -10));
  //   r.skipBackfaces = true;
  //   const data = [
  //     [1, 1, 1],
  //     [1, 1, 1],
  //     [1, 1, 1]
  //   ];
  //   const shape = new Heightfield(data, {
  //     elementSize: 1
  //   });
  //   const body = new Body({ mass: 1 }, new Vec3(-1, -1, 0));
  //   body.addShape(shape);

  //   // Hit
  //   const result = new RaycastResult();
  //   r.intersectBody(body, result);
  //   test.equals(result.hasHit, true);
  //   test.deepEqual(result.hitPointWorld, new Vec3(0, 0, 1));

  //   // Miss
  //   const result = new RaycastResult();
  //   r.from.set(-100, -100, 10);
  //   r.to.set(-100, -100, -10);
  //   r.intersectBody(body, result);
  //   test.equals(result.hasHit, false);

  //   // Hit all triangles!
  //   const result = new RaycastResult();
  //   for (const i = 0; i < data.length - 1; i++) { // 3x3 data points will have 2x2 rectangles in the field
  //     for (const j = 0; j < data[i].length - 1; j++) {
  //       for (const k = 0; k < 2; k++) {
  //         result.reset();
  //         r.from.set(i + 0.25, j + 0.25, 10);
  //         r.to.set(i + 0.25, j + 0.25, -10);
  //         if (k) {
  //           r.from.x += 0.5;
  //           r.from.y += 0.5;
  //           r.to.x += 0.5;
  //           r.to.y += 0.5;
  //         }
  //         r.intersectBody(body, result);
  //         test.ok(result.hasHit, 'missed triangle ' + [i, j].join(','));
  //       }
  //     }
  //   }

  //   test.done();
  // });

  it('should plane', () => {
    let r = new Ray(new Vec3(0, 0, 5), new Vec3(0, 0, -5));
    r.skipBackfaces = true;
    const shape = new Plane();
    const body = new Body({ mass: 1 });
    body.addShape(shape);

    let result = new RaycastResult();
    r.intersectBody(body, result);
    expect(result.hasHit).toEqual(true);
    expect(result.hitPointWorld.almostEquals(new Vec3(0, 0, 0)));
    expect(result.distance).toEqual(5);

    result.reset();
    const body2 = new Body({ mass: 1 });
    body2.addShape(shape, new Vec3(0, 0, 1), new Quaternion());
    r.intersectBody(body2, result);
    expect(result.hasHit).toEqual(true);
    expect(result.hitPointWorld.almostEquals(new Vec3(0, 0, 1)));

    result.reset();
    const body3 = new Body({ mass: 1 });
    const quat = new Quaternion();
    quat.setFromAxisAngle(new Vec3(1, 0, 0), Math.PI / 2);
    body3.addShape(shape, new Vec3(), quat);
    r.intersectBody(body3, result);
    expect(result.hasHit).toEqual(false);

    result.reset();
    const body4 = new Body({ mass: 1 });
    body4.addShape(shape);
    r = new Ray(new Vec3(1, 1, 5), new Vec3(1, 1, -5));
    r.intersectBody(body4, result);
    expect(result.hasHit).toEqual(true);
    expect(result.hitPointWorld).toEqual(new Vec3(1, 1, 0));
    expect(result.distance).toEqual(5);

    result = new RaycastResult();
    r.from.set(0, 1, 1);
    r.to.set(0, -1, -1);
    body.position.set(0, 0, 0);
    r.intersectBody(body, result);
    const distance1 = result.distance;
    expect(result.hasHit).toEqual(true);
    expect(result.hitPointWorld.almostEquals(new Vec3(0, 0, 0)));

    result = new RaycastResult();
    r.from.set(0, 1 - 5, 1);
    r.to.set(0, -1 - 5, -1);
    body.position.set(0, 0, 0);
    r.intersectBody(body, result);
    const distance2 = result.distance;
    expect(result.hasHit).toEqual(true);
    expect(result.hitPointWorld.almostEquals(new Vec3(0, -5, 0)));
    expect(distance1).toEqual(distance2);
  });

  // it('should trimesh', () => {
  //   const r = new Ray(new Vec3(0.5, 0.5, 10), new Vec3(0.5, 0.5, -10));
  //   r.skipBackfaces = true;

  //   const vertices = [
  //     0, 0, 0,
  //     1, 0, 0,
  //     0, 1, 0
  //   ];
  //   const indices = [
  //     0, 1, 2
  //   ];

  //   const body = new Body({
  //     mass: 1,
  //     shape: new Trimesh(vertices, indices)
  //   });

  //   // Hit
  //   const result = new RaycastResult();
  //   r.intersectBody(body, result);
  //   test.equals(result.hasHit, true);
  //   test.deepEqual(result.hitPointWorld, new Vec3(0.5, 0.5, 0));

  //   // Miss
  //   result = new RaycastResult();
  //   r.from.set(-100, -100, 10);
  //   r.to.set(-100, -100, -10);
  //   r.intersectBody(body, result);
  //   test.equals(result.hasHit, false);

  //   test.done();
  // });

});

