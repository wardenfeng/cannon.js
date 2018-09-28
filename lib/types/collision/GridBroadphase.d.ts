import { Broadphase } from './Broadphase';
import { Vec3 } from '../math/Vec3';
import { World } from '../world/World';
import { Body } from '../objects/Body';
export declare class GridBroadphase extends Broadphase {
    aabbMin: Vec3;
    aabbMax: Vec3;
    nx: number;
    ny: number;
    nz: number;
    bins: Body[][];
    binLengths: number[];
    constructor(aabbMin?: Vec3, aabbMax?: Vec3, nx?: number, ny?: number, nz?: number);
    private GridBroadphase_collisionPairs_d;
    private GridBroadphase_collisionPairs_binPos;
    collisionPairs(world: World, pairs1: Body[], pairs2: Body[]): void;
}
