import { Inject, Injectable, InjectionToken, OnDestroy, Optional } from '@angular/core';
import { ZdagConstructorProps } from '.';
import { Observable } from "rxjs";

export const ZMQ_URL = new InjectionToken('TEST');

@Injectable()
export class ZdagService implements OnDestroy {
  private zdag: any;
  public zmqUrl;

  constructor(@Inject('zmq_url') zmqUrl: string) {
    console.log('init zdag lib:', zmqUrl);
    this.initialize({ url: zmqUrl, address: '' });
  }

  initialize(config: ZdagConstructorProps) {
    this.zmqUrl = config.url;
    // this.zdag = new Zdag(config); disabled for now, needs to be refactored to use remote endpoints not local RPC
  }

  ngOnDestroy() {
    this.zdag.destroy();
  }
}
