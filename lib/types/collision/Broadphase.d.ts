import { Body } from '../objects/Body';
import { World } from '../world/World';
import { AABB } from '../collision/AABB';
export declare class Broadphase {
    world: World;
    useBoundingBoxes: boolean;
    dirty: boolean;
    constructor(world?: World);
    collisionPairs(world: World, p1: Body[], p2: Body[]): void;
    needBroadphaseCollision(bodyA: Body, bodyB: Body): boolean;
    intersectionTest(bodyA: Body, bodyB: Body, pairs1: any[], pairs2: any[]): void;
    private Broadphase_collisionPairs_r;
    private Broadphase_collisionPairs_normal;
    private Broadphase_collisionPairs_quat;
    private Broadphase_collisionPairs_relpos;
    doBoundingSphereBroadphase(bodyA: Body, bodyB: Body, pairs1: Body[], pairs2: Body[]): void;
    doBoundingBoxBroadphase(bodyA: Body, bodyB: Body, pairs1: Body[], pairs2: Body[]): void;
    private Broadphase_makePairsUnique_temp;
    private Broadphase_makePairsUnique_p1;
    private Broadphase_makePairsUnique_p2;
    makePairsUnique(pairs1: Body[], pairs2: Body[]): void;
    setWorld(world: World): void;
    private bsc_dist;
    static boundingSphereCheck(bodyA: Body, bodyB: Body): boolean;
    aabbQuery(world: World, aabb: AABB, result: Body[]): any[];
}
