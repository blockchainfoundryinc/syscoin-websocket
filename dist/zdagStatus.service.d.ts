import { InjectionToken, OnDestroy } from '@angular/core';
import { PendingZdagTx, ZdagConstructorProps } from '.';
import { Observable } from "rxjs";
export declare const ZMQ_URL: InjectionToken<unknown>;
export declare class ZdagStatusService implements OnDestroy {
    private zdag;
    zmqUrl: any;
    constructor(zmqUrl: string);
    initialize(config: ZdagConstructorProps): void;
    ngOnDestroy(): void;
    isZdagConfirmed(tx: string): any;
    statusChange(): Observable<Map<string, PendingZdagTx>>;
}
