import { OnDestroy } from '@angular/core';
import { ZdagConstructorProps } from '.';
export declare class ZdagStatusService implements OnDestroy {
    private zdag;
    initialize(config: ZdagConstructorProps): void;
    ngOnDestroy(): void;
    listenToZdagConfirmed(tx: string): Promise<unknown>;
    isZdagConfirmed(tx: string): any;
}
