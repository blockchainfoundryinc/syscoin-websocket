import * as io from 'socket.io-client';
import { BehaviorSubject, Subject } from 'rxjs';
import { SyscoinWebsocketConstructorProps } from './index';

export class SyscoinWebsocket {
  private address: string;
  private socket: any;
  public txSubject$: Subject<any> = new Subject();
  public hashBlockSubject$: Subject<any> = new Subject();
  public connectedSubject$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(props: SyscoinWebsocketConstructorProps) {
    this.socket = io(props.url, {
      transports: ['websocket'],
      query: `address=${props.address}`
    });
    this.address = props.address;
    this.txSubject$ = new Subject();

    this.socket.on('connect', this.handleConnect.bind(this));
    this.socket.on('disconnect', this.handleDisconnect.bind(this));
    this.socket.on(props.address, this.handleTxMessage.bind(this));
    this.socket.on('hashblock', this.handleHashblockMessage.bind(this));
  }

  private handleConnect() {
    this.connectedSubject$.next(true);
  }

  private handleDisconnect() {
    this.connectedSubject$.next(false);
  }

  private handleTxMessage(data) {
    try {
      data.zdagTx = data.message.hasOwnProperty('status');
    } catch(err) {
      data.zdagTx = false;
    }

    this.txSubject$.next(data);
  }

  private handleHashblockMessage(data) {
    this.hashBlockSubject$.next(data);
  }

  public destroy() {
    this.socket.close();
  }
}
