import { ContactMaterial } from './ContactMaterial';
import { Material } from './Material';

describe('Contact Material', () => {

  it('should construct default', () => {
    const cm = new ContactMaterial();
    expect(cm).not.toBeUndefined();

    expect(cm.friction).toEqual(0.3);
    expect(cm.restitution).toEqual(0.3);

    expect(cm.contactEquationStiffness).toEqual(1e7);
    expect(cm.contactEquationRelaxation).toEqual(3);
    expect(cm.frictionEquationStiffness).toEqual(1e7);
    expect(cm.frictionEquationRelaxation).toEqual(3);

    expect(cm.materials).not.toBeUndefined();

    expect(cm.materials[0]).not.toBeDefined();
    expect(cm.materials[1]).not.toBeDefined();
  });

  it('should override defaults', () => {
    const m1 = new Material();
    const m2 = new Material();

    const cm = new ContactMaterial(m1, m2, {
      friction: 1,
      restitution: 0
    });
    expect(cm).not.toBeUndefined();

    expect(cm.friction).toEqual(1);
    expect(cm.restitution).toEqual(0);

    expect(cm.materials[0]).toBe(m1);
    expect(cm.materials[1]).toBe(m2);
  });

});
