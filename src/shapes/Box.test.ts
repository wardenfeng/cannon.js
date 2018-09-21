import { Box } from './Box';
import { Vec3 } from '../math/Vec3';
import { Quaternion } from '../math/Quaternion';

describe('Box', () => {
  it('should forEachWorldCorner', () => {
    const box = new Box(new Vec3(1, 1, 1));
    const pos = new Vec3();
    const quat = new Quaternion();
    quat.setFromAxisAngle(new Vec3(0, 0, 1), Math.PI * 0.25);
    let numCorners = 0;
    const unique: Vec3[] = [];

    box.forEachWorldCorner(pos, quat, (x: number, y: number, z: number) => {
      const corner = new Vec3(x, y, z);
      for (let i = 0; i < unique.length; i++) {
        // test.ok(!corner.almostEquals(unique[i]), "Corners " + i + " and " + numCorners + "
        // are almost equal: (" + unique[i].toString() + ") == (" + corner.toString() + ")");
        expect(corner.almostEquals(unique[i])).toBeFalsy();
      }
      unique.push(corner);
      numCorners++;
    });
    expect(numCorners).toEqual(8);
  });

  it('should calculateWorldAABB', () => {
    const box = new Box(new Vec3(1, 1, 1));
    const min = new Vec3();
    const max = new Vec3();
    box.calculateWorldAABB(new Vec3(3, 0, 0),
      new Quaternion(0, 0, 0, 1),
      min,
      max);
    expect(min.x).toEqual(2);
    expect(max.x).toEqual(4);
    expect(min.y).toEqual(-1);
    expect(max.y).toEqual(1);
  });
});
