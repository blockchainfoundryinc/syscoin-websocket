import { GethStatus, NetworkStatus, WalletStatus } from './index';
import { Observable } from 'rxjs';
import { TransactionListEntry } from '@syscoin/syscoin-js';
export declare class ZmqSocketService {
    private socket;
    private config;
    private newBlockSubject;
    newBlock$: Observable<string>;
    private newTxSubject;
    newTx$: Observable<TransactionListEntry[]>;
    private networkStatusSubject;
    netStatus$: Observable<NetworkStatus>;
    private gethStatusSubject;
    gethStatus$: Observable<GethStatus>;
    private walletStatusSubject;
    walletStatus$: Observable<WalletStatus>;
    private socketStatusSubject;
    socketStatus$: Observable<boolean>;
    private reconnectInterval;
    private filterMessages;
    constructor();
    connect(): void;
    private handleConnect;
    private handleMessage;
    private handleDisconnect;
    simulateWalletReady(): void;
}
