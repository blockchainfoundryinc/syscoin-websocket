import { ZdagConstructorProps } from './index';
export declare class Zdag {
    private address;
    private socket;
    constructor(props: ZdagConstructorProps);
    destroy(): void;
    onZdagConfirm(fn: Function): void;
}
