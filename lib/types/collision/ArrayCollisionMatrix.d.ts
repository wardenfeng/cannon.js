import { Body } from '../objects/Body';
export declare class ArrayCollisionMatrix {
    matrix: any[];
    constructor();
    get(ii: Body, ji: Body): number;
    set(ii: Body, ji: Body, value: boolean): void;
    reset(): void;
    setNumObjects(n: number): void;
}
