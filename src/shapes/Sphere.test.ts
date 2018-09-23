import { Sphere } from './Sphere';

describe('Sphere', () => {
  it('should throwOnWrongRadius', () => {
    // These should be all right
    const s = new Sphere(1);
    expect(s).not.toBeUndefined();
    const s1 = new Sphere(0);
    expect(s1).not.toBeUndefined();

    expect(() => {
      const s2 = new Sphere(-1);
    }).toThrowError('The sphere radius cannot be negative.');
  });
});

