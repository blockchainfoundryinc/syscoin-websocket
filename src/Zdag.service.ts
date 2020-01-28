import { Inject, Injectable, InjectionToken, OnDestroy, Optional } from '@angular/core';
import { PendingZdagTx, Zdag, ZdagConstructorProps } from '.';
import { Observable } from "rxjs";

export const ZMQ_URL = new InjectionToken('TEST');

@Injectable()
export class ZdagService implements OnDestroy {
  private zdag: any;
  public zmqUrl;

  constructor(@Inject('zmq_url') zmqUrl: string) {
    console.log('init zdag lib:', zmqUrl);
    this.initialize({ zmq: { url: zmqUrl } });
  }

  initialize(config: ZdagConstructorProps) {
    this.zmqUrl = config.zmq.url;
    // this.zdag = new Zdag(config); disabled for now, needs to be refactored to use remote endpoints not local RPC
  }

  ngOnDestroy() {
    this.zdag.destroy();
  }

  public isZdagConfirmed(tx: string) {
    try {
      return this.zdag.isTxZdagConfirmed(tx);
    } catch(err) {
      throw err;
    }
  }

  public statusChange(): Observable<Map<string, PendingZdagTx>> {
    return this.zdag.zdagStatusChange$;
  }
}
