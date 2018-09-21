export declare class EventTarget {
    _listeners: any;
    addEventListener(type: string, listener: Function): this;
    hasEventListener(type: string, listener: Function): boolean;
    hasAnyEventListener(type: string): boolean;
    removeEventListener(type: string, listener: Function): this;
    dispatchEvent(event: any): EventTarget;
}
