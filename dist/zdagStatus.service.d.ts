import { OnDestroy } from '@angular/core';
import { ZdagConstructorProps } from '.';
export declare class ZdagStatusService implements OnDestroy {
    private zdag;
    ngOnDestroy(): void;
    initialize(config: ZdagConstructorProps): void;
    asObservable(): any;
}
