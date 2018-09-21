import { AABB } from './AABB';
import { Vec3 } from '../math/Vec3';
import { Transform } from '../math/Transform';

describe('AABB', () => {

  it('should create a new instance', () => {
    const b = new AABB();
    expect(b).not.toBeUndefined();
  });

  it('should copy', () => {
    const a = new AABB(),
      b = new AABB();

    a.upperBound.set(1, 2, 3);
    b.copy(a);

    expect(a.upperBound).toEqual(b.upperBound);
  });

  it('should clone', () => {
    const a = new AABB({
      lowerBound: new Vec3(-1, -2, -3),
      upperBound: new Vec3(1, 2, 3)
    });
    const b = a.clone();

    expect(a.lowerBound).toEqual(b.lowerBound);
    expect(a.lowerBound).not.toBe(b.lowerBound);
  });


  it('should check overlaps', () => {
    const a = new AABB(),
      b = new AABB();

    // Same aabb
    a.lowerBound.set(-1, -1, 0);
    a.upperBound.set(1, 1, 0);
    b.lowerBound.set(-1, -1, 0);
    b.upperBound.set(1, 1, 0);
    expect(a.overlaps(b)).toBeTruthy();

    // Corner overlaps
    b.lowerBound.set(1, 1, 0);
    b.upperBound.set(2, 2, 0);
    expect(a.overlaps(b)).toBeTruthy();

    // Separate
    b.lowerBound.set(1.1, 1.1, 0);
    expect(!a.overlaps(b)).toBeTruthy();

    // fully inside
    b.lowerBound.set(-0.5, -0.5, 0);
    b.upperBound.set(0.5, 0.5, 0);
    expect(a.overlaps(b)).toBeTruthy();

    b.lowerBound.set(-1.5, -1.5, 0);
    b.upperBound.set(1.5, 1.5, 0);
    expect(a.overlaps(b)).toBeTruthy();

    // Translated
    b.lowerBound.set(-3, -0.5, 0);
    b.upperBound.set(-2, 0.5, 0);
    expect(!a.overlaps(b)).toBeTruthy();
  });

  it('should contains', () => {
    const a = new AABB(),
      b = new AABB();

    a.lowerBound.set(-1, -1, -1);
    a.upperBound.set(1, 1, 1);
    b.lowerBound.set(-1, -1, -1);
    b.upperBound.set(1, 1, 1);

    expect(a.contains(b)).toBeTruthy();

    a.lowerBound.set(-2, -2, -2);
    a.upperBound.set(2, 2, 2);
    expect(a.contains(b)).toBeTruthy();

    b.lowerBound.set(-3, -3, -3);
    b.upperBound.set(3, 3, 3);
    expect(a.contains(b)).toBeFalsy();

    a.lowerBound.set(0, 0, 0);
    a.upperBound.set(2, 2, 2);
    b.lowerBound.set(-1, -1, -1);
    b.upperBound.set(1, 1, 1);

    expect(a.contains(b)).toBeFalsy();
  });

  it('should toLocalFrame', () => {
      const worldAABB = new AABB();
      const localAABB = new AABB();
      const frame = new Transform();

      worldAABB.lowerBound.set(-1, -1, -1);
      worldAABB.upperBound.set(1, 1, 1);

      // No transform - should stay the same
      worldAABB.toLocalFrame(frame, localAABB);
      expect(localAABB.lowerBound).toEqual(worldAABB.lowerBound);

      // Some translation
      frame.position.set(-1, 0, 0);
      worldAABB.toLocalFrame(frame, localAABB);
      expect(localAABB).toEqual(
        new AABB({
          lowerBound: new Vec3(0, -1, -1),
          upperBound: new Vec3(2, 1, 1)
        })
      );
  });

  it('should toWorldFrame', () => {
      const localAABB = new AABB();
      const worldAABB = new AABB();
      const frame = new Transform();

      localAABB.lowerBound.set(-1, -1, -1);
      localAABB.upperBound.set(1, 1, 1);

      // No transform - should stay the same
      localAABB.toLocalFrame(frame, worldAABB);
      expect(localAABB.upperBound).toEqual(worldAABB.upperBound);

      // Some translation on the frame
      frame.position.set(1, 0, 0);
      localAABB.toWorldFrame(frame, worldAABB);
      expect(worldAABB).toEqual(
        new AABB({
          lowerBound: new Vec3(0, -1, -1),
          upperBound: new Vec3(2, 1, 1)
        })
      );
  });
});
