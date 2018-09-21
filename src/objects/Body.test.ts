import { Body } from '../objects/Body';
import { Vec3 } from '../math/Vec3';
import { Box } from '../shapes/Box';
import { Quaternion } from '../math/Quaternion';
import { Sphere } from '../shapes/Sphere';

describe('Body', () => {

  describe('computeAABB', () => {
    it('should box ', () => {
      const body = new Body({ mass: 1 });
      body.addShape(new Box(new Vec3(1, 1, 1)));
      body.computeAABB();

      expect(body.aabb.lowerBound.x).toEqual(-1);
      expect(body.aabb.lowerBound.y).toEqual(-1);
      expect(body.aabb.lowerBound.z).toEqual(-1);
      expect(body.aabb.upperBound.x).toEqual(1);
      expect(body.aabb.upperBound.y).toEqual(1);
      expect(body.aabb.upperBound.z).toEqual(1);

      body.position.x = 1;
      body.computeAABB();

      expect(body.aabb.lowerBound.x).toEqual(0);
      expect(body.aabb.upperBound.x).toEqual(2);
    });

    it('should boxOffset ', () => {
      const quaternion = new Quaternion();
      quaternion.setFromAxisAngle(new Vec3(0, 0, 1), Math.PI / 2);
      const body = new Body({ mass: 1 });
      body.addShape(new Box(new Vec3(1, 1, 1)), new Vec3(1, 1, 1));
      body.computeAABB();
      expect(body.aabb.lowerBound.x).toEqual(0);
      expect(body.aabb.lowerBound.y).toEqual(0);
      expect(body.aabb.lowerBound.z).toEqual(0);
      expect(body.aabb.upperBound.x).toEqual(2);
      expect(body.aabb.upperBound.y).toEqual(2);
      expect(body.aabb.upperBound.z).toEqual(2);

      body.position.x = 1;
      body.computeAABB();

      expect(body.aabb.lowerBound.x).toEqual(1);
      expect(body.aabb.upperBound.x).toEqual(3);
    });
  });

  it('should updateInertiaWorld', () => {
    const body = new Body({ mass: 1 });
    body.addShape(new Box(new Vec3(1, 1, 1)));
    body.quaternion.setFromEuler(Math.PI / 2, 0, 0);
    body.updateInertiaWorld();
  });

  it('should pointToLocalFrame', () => {
    const body = new Body({ mass: 1 });
    body.addShape(new Sphere(1));
    body.position.set(1, 2, 2);
    const localPoint = body.pointToLocalFrame(new Vec3(1, 2, 3));
    expect(localPoint.almostEquals(new Vec3(0, 0, 1))).toBeTruthy();
  });

  it('should pointToWorldFrame', () => {
    const body = new Body({ mass: 1 });
    body.addShape(new Sphere(1));
    body.position.set(1, 2, 2);
    const worldPoint = body.pointToWorldFrame(new Vec3(1, 0, 0));
    expect(worldPoint.almostEquals(new Vec3(2, 2, 2))).toBeTruthy();
  });

  it('should addShape', () => {
    const sphereShape = new Sphere(1);

    const bodyA = new Body({
      mass: 1,
      shape: sphereShape
    });
    const bodyB = new Body({
      mass: 1
    });
    bodyB.addShape(sphereShape);

    // 'Adding shape via options did not work.'
    expect(bodyA.shapes).toEqual(bodyB.shapes);
    expect(bodyA.inertia).toEqual(bodyB.inertia);
  });

  it('should applyForce', () => {
    const sphereShape = new Sphere(1);
    const body = new Body({
      mass: 1,
      shape: sphereShape
    });

    const worldPoint = new Vec3(1, 0, 0);
    const forceVector = new Vec3(0, 1, 0);
    body.applyForce(forceVector, worldPoint);

    expect(body.force).toEqual(forceVector);
    expect(body.torque).toEqual(new Vec3(0, 0, 1));
  });

  it('should applyLocalForce', () => {
    const sphereShape = new Sphere(1);
    const body = new Body({
      mass: 1,
      shape: sphereShape
    });
    body.quaternion.setFromAxisAngle(new Vec3(1, 0, 0), Math.PI / 2);

    const localPoint = new Vec3(1, 0, 0);
    const localForceVector = new Vec3(0, 1, 0);
    body.applyLocalForce(localForceVector, localPoint);

    // The force is rotated to world space
    expect(body.force.almostEquals(new Vec3(0, 0, 1))).toBeTruthy();
  });

  it('should applyImpulse', () => {
    const sphereShape = new Sphere(1);
    const body = new Body({
      mass: 1,
      shape: sphereShape
    });

    const f = 1000;
    const dt = 1 / 60;
    const worldPoint = new Vec3(0, 0, 0);
    const impulse = new Vec3(f * dt, 0, 0);
    body.applyImpulse(impulse, worldPoint);

    expect(body.velocity.almostEquals(new Vec3(f * dt, 0, 0))).toBeTruthy();
  });

  it('should applyLocalImpulse', () => {
    const sphereShape = new Sphere(1);
    const body = new Body({
      mass: 1,
      shape: sphereShape
    });
    body.quaternion.setFromAxisAngle(new Vec3(1, 0, 0), Math.PI / 2);

    const f = 1000;
    const dt = 1 / 60;
    const localPoint = new Vec3(1, 0, 0);
    const localImpulseVector = new Vec3(0, f * dt, 0);
    body.applyLocalImpulse(localImpulseVector, localPoint);
    // The force is rotated to world space
    expect(body.velocity.almostEquals(new Vec3(0, 0, f * dt))).toBeTruthy();
  });
});
