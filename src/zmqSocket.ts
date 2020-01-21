import { GethStatus, NetworkStatus, WalletStatus } from './index';
import * as SockJS from 'sockjs-client';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { TransactionListEntry } from '@syscoin/syscoin-js';

export class ZMQSocket {
  private socket: WebSocket;
  private config;

  private newBlockSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public newBlock$: Observable<string> = this.newBlockSubject.asObservable();

  private newTxSubject: Subject<TransactionListEntry[]> = new Subject<TransactionListEntry[]>();
  public newTx$: Observable<TransactionListEntry[]> = this.newTxSubject.asObservable();

  private networkStatusSubject: BehaviorSubject<NetworkStatus> = new BehaviorSubject<NetworkStatus>({ connections: 0, status: null });
  public netStatus$: Observable<NetworkStatus> = this.networkStatusSubject.asObservable();

  private gethStatusSubject: BehaviorSubject<GethStatus> = new BehaviorSubject<GethStatus>({geth_sync_status: 'not connected', geth_current_block: 0, geth_total_blocks: 1});
  public gethStatus$: Observable<GethStatus> = this.gethStatusSubject.asObservable();

  private walletStatusSubject: BehaviorSubject<WalletStatus> = new BehaviorSubject<WalletStatus>({ status: null, name: null });
  public walletStatus$: Observable<WalletStatus> = this.walletStatusSubject.asObservable();

  private socketStatusSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public socketStatus$: Observable<boolean> = this.socketStatusSubject.asObservable();

  private reconnectInterval = null;
  private filterMessages = {
    'ethstatus': true,
    'hashtx': true,
    'hashblock': true,
    'networkstatus': true,
    'walletstatus': true,
    'walletrawtx': true};

  constructor(zmqUrl: string) {
    this.config = {
        zmq_socket_url: zmqUrl
    };
    this.connect();
  }

  public connect() {
    this.socket = new SockJS(this.config.zmq_socket_url);
    this.socket.onopen = this.handleConnect;
    this.socket.onmessage = this.handleMessage;
    this.socket.onclose = this.handleDisconnect;
  }

  private handleConnect = () => {
    console.log('zmq connected');
    this.socketStatusSubject.next(true);
    clearInterval(this.reconnectInterval);
  };

  private handleMessage = (e) => {
    e.data = JSON.parse(e.data);

    // filter messages
    if (!this.filterMessages[e.data.topic]) {
      return null;
    }

    console.log('zmq message', e.data.topic);
    switch (e.data.topic) {
      case 'walletrawtx':
        this.newTxSubject.next(JSON.parse(e.data.message));
        break;

      case 'ethstatus':
        this.gethStatusSubject.next(JSON.parse(e.data.message));
        break;

      case 'walletstatus':
        this.walletStatusSubject.next(JSON.parse(e.data.message));
        break;

      case 'networkstatus':
        this.networkStatusSubject.next(JSON.parse(e.data.message));
        break;

      case 'hashblock':
        this.newBlockSubject.next(e.data.message);
        break;
    }
  };

  private handleDisconnect = (err) => {
    console.log('zmq disconnected', err);
    this.socketStatusSubject.next(false);

    clearInterval(this.reconnectInterval);
    this.reconnectInterval = setInterval(this.connect.bind(this), 3000);
  };

  public simulateWalletReady() {
    console.log('simulate ready');
    this.walletStatusSubject.next({ status: 'ready', name: ''});
  }


}
