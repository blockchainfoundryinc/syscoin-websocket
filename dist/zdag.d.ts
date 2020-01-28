import { Subject } from 'rxjs';
import { ZdagConstructorProps } from './index';
export declare class Zdag {
    private address;
    private socket;
    txSubject$: Subject<any>;
    constructor(props: ZdagConstructorProps);
    destroy(): void;
}
