import * as io from 'socket.io-client';
import { Subject } from 'rxjs';
import { SyscoinWebsocketConstructorProps } from './index';

export class SyscoinWebsocket {
  private address: string;
  private socket: any;
  public txSubject$: Subject<any> = new Subject();
  public hashBlockSubject$: Subject<any> = new Subject();

  constructor(props: SyscoinWebsocketConstructorProps) {
    this.socket = io(props.url, {
      transports: ['websocket'],
      query: `address=${props.address}`
    });
    this.address = props.address;
    this.txSubject$ = new Subject();

    this.socket.on(props.address, (data) => {
      data.zdagTx = data.message.hasOwnProperty('status') ? true : false;
      this.txSubject$.next(data);
    });

    this.socket.on('hashblock', (data) => {
      this.hashBlockSubject$.next(data);
    });
  }

  public destroy() {
    this.socket.close();
  }
}
