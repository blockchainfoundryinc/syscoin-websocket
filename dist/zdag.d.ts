import { Subject } from 'rxjs';
import { ZdagConstructorProps } from './index';
export declare class Zdag {
    private address;
    private socket;
    txSubject$: Subject<Array<any>>;
    zdagTxs: any;
    constructor(props: ZdagConstructorProps);
    destroy(): void;
}