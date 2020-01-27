import io from 'socket.io-client';
import { ZdagConstructorProps } from './index';

export class Zdag {
  private address: string;
  private socket: any;

  constructor(props: ZdagConstructorProps) {
    this.socket = io.connect(props.url);
    this.address = props.address;
  }

  public destroy() {
    this.socket.close();
  }

  public onZdagConfirm(fn: Function) {
    this.socket.on(this.address, data => {
      if (data.message && data.message.status === 0) {
        fn(data.message)
      }
    });
  }

}
