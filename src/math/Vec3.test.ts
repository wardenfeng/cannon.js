import {
  Vec3, Vec3Consts
} from './Vec3';

describe('Vec3', () => {

  it('should create a vec3', () => {
    const v = new Vec3(1, 2, 3);
    expect(v.x).toEqual(1);
    expect(v.y).toEqual(2);
    expect(v.z).toEqual(3);
  });

  it('should have basic consts', () => {
    expect(Vec3Consts.ZERO.x).toEqual(0);
    expect(Vec3Consts.ZERO.y).toEqual(0);
    expect(Vec3Consts.ZERO.z).toEqual(0);

    expect(Vec3Consts.UNIT_X.x).toEqual(1);
    expect(Vec3Consts.UNIT_X.y).toEqual(0);
    expect(Vec3Consts.UNIT_X.z).toEqual(0);
  });

  it('should have cross', () => {
    let v = new Vec3(1, 2, 3);
    const u = new Vec3(4, 5, 6);
    v = v.cross(u);

    expect(v.x).toEqual(-3);
    expect(v.y).toEqual(6);
    expect(v.z).toEqual(-3);
  });

  it('should have dot', () => {
    let v = new Vec3(1, 2, 3);
    let u = new Vec3(4, 5, 6);
    let dot = v.dot(u);

    expect(dot).toEqual(4 + 10 + 18);

    v = new Vec3(3, 2, 1);
    u = new Vec3(4, 5, 6);
    dot = v.dot(u);

    expect(dot).toEqual(12 + 10 + 6);
  });

  it('shoud have set', () => {
    const v = new Vec3(1, 2, 3);
    v.set(4, 5, 6);

    expect(v.x).toEqual(4);
    expect(v.y).toEqual(5);
    expect(v.z).toEqual(6);
  });

  it('should have vadd', () => {
    let v = new Vec3(1, 2, 3);
    const u = new Vec3(4, 5, 6);
    v = v.vadd(u);

    expect(v.x).toEqual(5);
    expect(v.y).toEqual(7);
    expect(v.z).toEqual(9);
  });

  it('should have isAntiparallelTo', () => {
    expect(
      new Vec3(1, 0, 0).isAntiparallelTo(new Vec3(-1, 0, 0))
    ).toBeTruthy();
  });

  it('should have almostEquals', () => {
    expect(
      new Vec3(1, 0, 0).almostEquals(new Vec3(1, 0, 0))
    ).toBeTruthy();
  });
});
