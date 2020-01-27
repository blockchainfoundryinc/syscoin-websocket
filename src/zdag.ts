import * as io from 'socket.io-client';
import { Subject } from 'rxjs';
import { ZdagConstructorProps } from './index';

export class Zdag {
  private address: string;
  private socket: any;
  public txSubject$: Subject<Array<any>>;
  public zdagTxs

  constructor(props: ZdagConstructorProps) {
    this.socket = io(props.url, {
      transports: ['websocket'],
      query: `address=${props.address}`
    });
    this.address = props.address;
    this.txSubject$ = new Subject();

    this.socket.on(props.address, (data) => {
      if (data.message.hasOwnProperty('status')) {
        data.zdagTx = true;
      } else {
        data.zdagTx = false
      }

      this.txSubject$.next(data);
    });
  }

  public destroy() {
    this.socket.close();
  }

}
