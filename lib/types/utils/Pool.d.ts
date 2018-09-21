export declare class Pool {
    objects: any[];
    type: any;
    constructor();
    release(...obj: any[]): this;
    get(): any;
    constructObject(): void;
    resize(size: number): this;
}
