import { World } from './World';
import { Body } from '../objects/Body';
import { Vec3 } from '../math/Vec3';
import { RaycastResult } from '../collision/RaycastResult';
import { Box } from '../shapes/Box';
import { Sphere } from '../shapes/Sphere';
import { Shape } from '../shapes/Shape';
import { NaiveBroadphase } from '../collision/NaiveBroadphase';
import { ArrayCollisionMatrix } from '../collision/ArrayCollisionMatrix';

describe('World', () => {

  it('should create a world', () => {
    const world = new World();
    expect(world).not.toBeUndefined();
  });

  it('should clearForces', () => {
    const world = new World();
    const body = new Body();
    world.addBody(body);
    body.force.set(1, 2, 3);
    body.torque.set(4, 5, 6);

    world.clearForces();

    expect(body.force.almostEquals(new Vec3(0, 0, 0))).toBeTruthy();
    expect(body.torque.almostEquals(new Vec3(0, 0, 0))).toBeTruthy();
  });

  it('should rayTestBox', () => {
    const world = new World();

    const body = new Body();
    body.addShape(new Box(new Vec3(1, 1, 1)));
    world.addBody(body);

    const from = new Vec3(-10, 0, 0);
    const to = new Vec3(10, 0, 0);

    const result = new RaycastResult();
    world.rayTest(from, to, result);

    expect(result.hasHit).toBeTruthy();
  });

  it('should rayTestSphere', () => {
    const world = new World();

    const body = new Body();
    body.addShape(new Sphere(1));
    world.addBody(body);

    const from = new Vec3(-10, 0, 0);
    const to = new Vec3(10, 0, 0);

    const result = new RaycastResult();
    world.rayTest(from, to, result);

    expect(result.hasHit).toBeTruthy();
  });

  describe('raycastClosest', () => {
    it('should single', () => {
      const world = new World();
      const body = new Body({
        shape: new Sphere(1)
      });
      world.addBody(body);

      const from = new Vec3(-10, 0, 0);
      const to = new Vec3(10, 0, 0);

      const result = new RaycastResult();
      world.raycastClosest(from, to, {}, result);

      expect(result.hasHit).toBeTruthy();
      expect(result.body).toEqual(body);
      expect(result.shape).toEqual(body.shapes[0]);
    });

    it('should order', () => {
      const world = new World();
      const bodyA = new Body({ shape: new Sphere(1), position: new Vec3(-1, 0, 0) });
      const bodyB = new Body({ shape: new Sphere(1), position: new Vec3(1, 0, 0) });
      world.addBody(bodyA);
      world.addBody(bodyB);

      const from = new Vec3(-10, 0, 0);
      const to = new Vec3(10, 0, 0);

      let result = new RaycastResult();
      world.raycastClosest(from, to, {}, result);

      expect(result.hasHit).toBeTruthy();
      expect(result.body).toEqual(bodyA);
      expect(result.shape).toEqual(bodyA.shapes[0]);

      from.set(10, 0, 0);
      to.set(-10, 0, 0);

      result = new RaycastResult();
      world.raycastClosest(from, to, {}, result);

      expect(result.hasHit).toBeTruthy();
      expect(result.body).toEqual(bodyB);
      expect(result.shape).toEqual(bodyB.shapes[0]);
    });
  });

  describe('raycastAll', () => {
    it('should simple', () => {
      const world = new World();
      const body = new Body({ shape: new Sphere(1) });
      world.addBody(body);

      const from = new Vec3(-10, 0, 0);
      const to = new Vec3(10, 0, 0);

      let hasHit;
      let numResults = 0;
      let resultBody: Body;
      let resultShape: Shape;

      const returnVal = world.raycastAll(from, to, {}, (result: RaycastResult) => {
        hasHit = result.hasHit;
        resultShape = result.shape;
        resultBody = result.body;
        numResults++;
      });

      expect(returnVal).toBeTruthy();
      expect(hasHit).toBeTruthy();
      expect(resultBody).toEqual(body);
      expect(numResults).toEqual(2);
      expect(resultShape).toEqual(resultBody.shapes[0]);
    });

    it('should twoSpheres', () => {
      const world = new World();
      const body = new Body({ shape: new Sphere(1) });
      world.addBody(body);

      const body2 = new Body({ shape: new Sphere(1) });
      world.addBody(body2);

      const from = new Vec3(-10, 0, 0);
      const to = new Vec3(10, 0, 0);

      let hasHit = false;
      let numResults = 0;
      let resultBody;
      let resultShape;

      world.raycastAll(from, to, {}, function (result: RaycastResult) {
        hasHit = result.hasHit;
        resultShape = result.shape;
        resultBody = result.body;
        numResults++;
      });

      expect(hasHit).toBeTruthy();
      expect(numResults).toEqual(4);
    });

    it('should skipBackFaces', () => {
      const world = new World();
      const body = new Body({ shape: new Sphere(1) });
      world.addBody(body);

      let hasHit = false;
      let numResults = 0;
      let resultBody: Body;
      let resultShape: Shape;

      world.raycastAll(new Vec3(-10, 0, 0), new Vec3(10, 0, 0),
        { skipBackfaces: true },
        (result: RaycastResult) => {
        hasHit = result.hasHit;
        resultShape = result.shape;
        resultBody = result.body;
        numResults++;
      });

      expect(hasHit).toBeTruthy();
      expect(numResults).toEqual(1);
    });

    it('should collisionFilters', () => {
      const world = new World();
      const body = new Body({
        shape: new Sphere(1)
      });
      world.addBody(body);
      body.collisionFilterGroup = 2;
      body.collisionFilterMask = 2;

      let numResults = 0;

      world.raycastAll(new Vec3(-10, 0, 0), new Vec3(10, 0, 0), {
        collisionFilterGroup: 2,
        collisionFilterMask: 2
      }, (result: RaycastResult) => {
        numResults++;
      });

      expect(numResults).toEqual(2);

      numResults = 0;

      world.raycastAll(new Vec3(-10, 0, 0), new Vec3(10, 0, 0), {
        collisionFilterGroup: 1,
        collisionFilterMask: 1
      }, (result: RaycastResult) => {
        numResults++;
      });

      // 'should use collision groups!';
      expect(numResults).toEqual(0);
    });
  });

  it('should raycastAny', () => {
    const world = new World();
    world.addBody(new Body({ shape: new Sphere(1) }));

    const from = new Vec3(-10, 0, 0);
    const to = new Vec3(10, 0, 0);

    const result = new RaycastResult();
    world.raycastAny(from, to, {}, result);

    expect(result.hasHit).toBeTruthy();
  });

  it('should collisionMatrix', () => {
    // function testCollisionMatrix(CollisionMatrix) {
      const test_configs = [
        {
          positions: [
            [0, 0, 0],
            [2, 0, 0],
            [0, 4, 0],
            [2, 4, 0],
            [0, 8, 0],
            [2, 8, 0]
          ],
          colliding: {
            '0-1': true,
            '2-3': true,
            '4-5': true
          }
        },
        {
          positions: [
            [0, 0, 0],
            [0, 4, 0],
            [0, 8, 0],
            [2, 0, 0],
            [2, 4, 0],
            [2, 8, 0]
          ],
          colliding: {
            '0-3': true,
            '1-4': true,
            '2-5': true
          }
        },
        {
          positions: [
            [0, 0, 0],
            [0, 1, 0],
            [0, 10, 0],
            [0, 20, 0],
            [0, 30, 0],
            [0, 40, 0],
            [0, 50, 0],
            [0, 51, 0]
          ],
          colliding: {
            '0-1': true,
            '6-7': true
          }
        }
      ];

      for (let config_idx = 0; config_idx < test_configs.length; config_idx++) {
        const test_config = test_configs[config_idx];

        const world = new World();
        world.broadphase = new NaiveBroadphase();
        world.collisionMatrix = new ArrayCollisionMatrix();
        world.collisionMatrixPrevious = new ArrayCollisionMatrix();

        for (let position_idx = 0; position_idx < test_config.positions.length; position_idx++) {
          const body = new Body({ mass: 1 });
          body.addShape(new Sphere(1.1));
          body.position.set.apply(body.position, test_config.positions[position_idx]);
          world.addBody(body);
        }

        for (let step_idx = 0; step_idx < 2; step_idx++) {
          world.step(0.1);
          const is_first_step = (step_idx === 0);

          for (let coll_i = 0; coll_i < world.bodies.length; coll_i++) {
            for (let coll_j = coll_i + 1; coll_j < world.bodies.length; coll_j++) {
              const is_colliding_pair = (<any>test_config.colliding)[coll_i + '-' + coll_j] === true;
              const expected = is_colliding_pair;
              const is_colliding = is_first_step ?
                !!world.collisionMatrix.get(world.bodies[coll_i], world.bodies[coll_j]) :
                !!world.collisionMatrixPrevious.get(world.bodies[coll_i], world.bodies[coll_j]);

                expect(is_colliding).toEqual(expected);
                // test.ok(is_colliding === expected,
                // (expected ? "Should be colliding" : "Should not be colliding") +
                // ': cfg=' + config_idx +
                // ' is_first_step=' + is_first_step +
                // ' is_colliding_pair=' + is_colliding_pair +
                // ' expected=' + expected +
                // ' is_colliding=' + is_colliding +
                // ' i=' + coll_i +
                // ' j=' + coll_j);
            }
          }
        }
      }
    // }
    // testCollisionMatrix(ArrayCollisionMatrix);
    // testCollisionMatrix(ObjectCollisionMatrix);
  });

});
