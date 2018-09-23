import { Body } from '../objects/Body';
import { Constraint } from './Constraint';
import { Equation } from '../equations/Equation';

describe('Constraint', () => {

  it('should construct', () => {
    const bodyA = new Body();
    const bodyB = new Body();
    const c = new Constraint(bodyA, bodyB);
    expect(c).not.toBeUndefined();
  });

  it('should enable', () => {
    const bodyA = new Body();
    const bodyB = new Body();
    const c = new Constraint(bodyA, bodyB);
    const eq = new Equation(bodyA, bodyB);
    c.equations.push(eq);

    c.enable();
    expect(eq.enabled).toBeTruthy();

    c.disable();
    expect(eq.enabled).toBeFalsy();
  });
});
