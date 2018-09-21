import { Vec3 } from './Vec3';
import { Quaternion } from './Quaternion';
export declare class Mat3 {
    elements: number[];
    constructor(elements?: number[]);
    identity(): void;
    setZero(): void;
    setTrace(vec3: Vec3): void;
    getTrace(target: Vec3): void;
    vmult(v: Vec3, target: Vec3): Vec3;
    smult(s: number): void;
    mmult(m: Mat3, target: Mat3): Mat3;
    scale(v: Vec3, target: Mat3): Mat3;
    solve(b: Vec3, target: Vec3): Vec3;
    e(row: number, column: number, value: number): number;
    copy(source: Mat3): this;
    toString(): string;
    reverse(target: Mat3): Mat3;
    setRotationFromQuaternion(q: Quaternion): Mat3;
    transpose(target: Mat3): Mat3;
}
