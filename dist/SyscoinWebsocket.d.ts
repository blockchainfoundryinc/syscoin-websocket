import { Subject } from 'rxjs';
import { SyscoinWebsocketConstructorProps } from './index';
export declare class SyscoinWebsocket {
    private address;
    private socket;
    txSubject$: Subject<any>;
    hashBlockSubject$: Subject<any>;
    constructor(props: SyscoinWebsocketConstructorProps);
    destroy(): void;
}
