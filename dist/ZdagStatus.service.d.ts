import { OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { ZmqSocketService } from './ZmqSocket.service';
import { PendingZdagTx } from './index';
export declare class ZdagStatusService implements OnDestroy {
    private zmq;
    private pendingTxs;
    private subscriptions;
    private updateZdagInterval;
    private zdagStatusChangeSubject;
    zadgStatusChange$: Observable<Map<string, PendingZdagTx>>;
    constructor(zmq: ZmqSocketService);
    ngOnDestroy(): void;
    private addZdagTx;
    private updateZdagTxs;
    private removeZdagTx;
    checkAddressZdagStatus(address: string, guid: number): number;
}
