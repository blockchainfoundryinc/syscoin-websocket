import { BehaviorSubject, Subject } from 'rxjs';
import { SyscoinWebsocketConstructorProps } from './index';
export declare class SyscoinWebsocket {
    private address;
    private socket;
    txSubject$: Subject<any>;
    hashBlockSubject$: Subject<any>;
    connectedSubject$: BehaviorSubject<boolean>;
    constructor(props: SyscoinWebsocketConstructorProps);
    private handleConnect;
    private handleDisconnect;
    private handleTxMessage;
    private handleHashblockMessage;
    destroy(): void;
}
