import { Broadphase } from '../collision/Broadphase';
import { World } from '../world/World';
import { AABB } from './AABB';
export declare class NaiveBroadphase extends Broadphase {
    constructor();
    collisionPairs(world: World, pairs1: any[], pairs2: any[]): void;
    aabbQuery(world: World, aabb: AABB, result: any[]): any[];
}
