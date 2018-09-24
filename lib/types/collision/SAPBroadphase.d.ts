import { World } from '../world/World';
import { Broadphase } from './Broadphase';
import { Body } from '../objects/Body';
import { AABB } from './AABB';
export declare class SAPBroadphase extends Broadphase {
    axisList: Body[];
    axisIndex: number;
    dirty: boolean;
    _addBodyHandler: Function;
    _removeBodyHandler: Function;
    constructor(world: World);
    setWorld(world: World): void;
    insertionSortX(a: Body[]): Body[];
    insertionSortY(a: Body[]): Body[];
    insertionSortZ(a: Body[]): Body[];
    collisionPairs(world: World, p1: Body[], p2: Body[]): void;
    sortList(): void;
    checkBounds(bi: Body, bj: Body, axisIndex: number): boolean;
    autoDetectAxis(): void;
    aabbQuery(world: World, aabb: AABB, result: Body[]): Body[];
}
