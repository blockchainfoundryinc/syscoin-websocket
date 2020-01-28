import { Inject, Injectable, InjectionToken, OnDestroy, Optional } from '@angular/core';
import { Zdag } from "./Zdag";

@Injectable()
export class ZdagService implements OnDestroy {
  private zdag: any;
  public zmqUrl;
  public sysAddress;

  constructor(@Inject('zmq_url') zmqUrl: string, @Inject('sys_address') sysAddress: string) {
    console.log('init zdag lib:', zmqUrl);
    this.zmqUrl = zmqUrl;
    this.sysAddress = sysAddress;
    this.zdag = new Zdag({ url: this.zmqUrl, address: this.sysAddress});
  }

  ngOnDestroy() {
    this.zdag.destroy();
  }

  asObservable() {
    return this.zdag.txSubject$;
  }
}
