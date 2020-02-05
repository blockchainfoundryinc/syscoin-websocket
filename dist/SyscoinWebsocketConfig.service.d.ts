import { BehaviorSubject } from "rxjs";
import { SyscoinWebsocketConstructorProps } from "./index";
export declare class SyscoinWebsocketConfigService {
    url: string;
    address: string;
    configComplete: BehaviorSubject<SyscoinWebsocketConstructorProps>;
    constructor();
    configure(url: any, address: any): void;
}
