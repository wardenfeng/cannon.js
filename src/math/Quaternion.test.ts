import { Quaternion } from './Quaternion';
import { Vec3 } from './Vec3';

describe('Quaternion', () => {

  it('should creation', () => {
    const q = new Quaternion(1, 2, 3, 4);
    expect(q.x).toEqual(1);
    expect(q.y).toEqual(2);
    expect(q.z).toEqual(3);
    expect(q.w).toEqual(4);
  });

  it('should conjugate', () => {
    const q = new Quaternion(1, 2, 3, 4);
    q.conjugate(q);
    expect(q.x).toEqual(-1);
    expect(q.y).toEqual(-2);
    expect(q.z).toEqual(-3);
    expect(q.w).toEqual(4);
  });

  it('should inverse', () => {
    const q = new Quaternion(1, 2, 3, 4);
    const denominator = 1 * 1 + 2 * 2 + 3 * 3 + 4 * 4;
    q.inverse(q);

    // Quaternion inverse is conj(q) / ||q||^2
    expect(q.x).toEqual(-1 / denominator);
    expect(q.y).toEqual(-2 / denominator);
    expect(q.z).toEqual(-3 / denominator);
    expect(q.w).toEqual( 4 / denominator);
  });

  it('shoulld toEuler', () => {
    const q = new Quaternion();
    q.setFromAxisAngle(new Vec3(0, 0, 1), Math.PI / 4);
    const euler = new Vec3();
    q.toEuler(euler);

    // we should expect (0,0,pi/4)
    expect(euler.x).toEqual(0);
    expect(euler.y).toEqual(0);
    expect(Math.abs(euler.z - Math.PI / 4) < 0.001);
  });

  it('should setFromVectors', () => {
    const q = new Quaternion();
    q.setFromVectors(new Vec3(1, 0, 0), new Vec3(-1, 0, 0));
    expect(q.vmult(new Vec3(1, 0, 0)).almostEquals(new Vec3(-1, 0, 0)));

    q.setFromVectors(new Vec3(0, 1, 0), new Vec3(0, -1, 0));
    expect(q.vmult(new Vec3(0, 1, 0)).almostEquals(new Vec3(0, -1, 0)));

    q.setFromVectors(new Vec3(0, 0, 1), new Vec3(0, 0, -1));
    expect(q.vmult(new Vec3(0, 0, 1)).almostEquals(new Vec3(0, 0, -1)));
  });

  it('should slerp', () => {
    const qa = new Quaternion();
    const qb = new Quaternion();
    qa.slerp(qb, 0.5, qb);
    expect(qa).toEqual(qb);

    qa.setFromAxisAngle(new Vec3(0, 0, 1), Math.PI / 4);
    qb.setFromAxisAngle(new Vec3(0, 0, 1), -Math.PI / 4);
    qa.slerp(qb, 0.5, qb);
    expect(qb).toEqual(new Quaternion());
  });
});
