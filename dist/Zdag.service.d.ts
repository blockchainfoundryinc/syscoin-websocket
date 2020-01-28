import { OnDestroy } from '@angular/core';
export declare class ZdagService implements OnDestroy {
    private zdag;
    zmqUrl: any;
    sysAddress: any;
    constructor(zmqUrl: string, sysAddress: string);
    ngOnDestroy(): void;
    asObservable(): any;
}
