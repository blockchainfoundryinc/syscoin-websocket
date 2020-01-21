import { Observable } from 'rxjs';
import { PendingZdagTx, ZdagConstructorProps } from './index';
export declare class Zdag {
    private pendingTxs;
    private subscriptions;
    private updateZdagInterval;
    private zmq;
    private syscoin;
    private zdagStatusChangeSubject;
    zadgStatusChange$: Observable<Map<string, PendingZdagTx>>;
    constructor(props: ZdagConstructorProps);
    ngOnDestroy(): void;
    private addZdagTx;
    private updateZdagTxs;
    private removeZdagTx;
    checkAddressZdagStatus(address: string, guid: number): number;
}
