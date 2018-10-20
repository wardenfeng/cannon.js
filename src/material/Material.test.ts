import { Material } from './Material';

describe('Material', () => {

  it('should construct default', () => {
    const cm = new Material();
    expect(cm).not.toBeUndefined();
    expect(cm.friction).toEqual(-1);
    expect(cm.restitution).toEqual(-1);
    expect(cm.name).toEqual('');
  });

  it('should take options', () => {
    const cm = new Material({
      name: 'My Material',
      friction: 1,
      restitution: 0,
    });
    expect(cm).not.toBeUndefined();
    expect(cm.friction).toEqual(1);
    expect(cm.restitution).toEqual(0);
    expect(cm.name).toEqual('My Material');
  });
});
