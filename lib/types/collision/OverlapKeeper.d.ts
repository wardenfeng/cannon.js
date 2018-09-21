export declare class OverlapKeeper {
    current: any[];
    previous: any[];
    constructor();
    getKey(i: number, j: number): number;
    set(i: number, jj: number): void;
    tick(): void;
    getDiff(additions: any[], removals: any[]): void;
}
